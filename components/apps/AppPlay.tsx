import React, { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineSync } from "react-icons/ai";
import ContentDropzone, { PlayableContent } from "components/molecules/ContentDropzone";
import { Funscript } from "lib/funscript-utils/types";
import FunscriptDropzone from "components/molecules/FunscriptDropzone";
import useHandy from "lib/thehandy-react";
import { testProcessFunscript } from "lib/customCsvUpload";
import Player from "./play/Player";
import PlayerAdjustments from "./player/PlayerAdjustments";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppPlay = (): JSX.Element => {
    //const { sendHsspSetup, handyState } = useHandy();
    const { handyState, sendHsspSetup, getServerTimeOffset } = useHandy();

    const [content, setContent] = useState<PlayableContent | null>(null);
    const [funscript, setFunscript] = useState<Funscript | null>(null);
    const [preparing, setPreparing] = useState(false);
    const [preparingMessage, setPreparingMessage] = useState("");
    const [prepared, setPrepared] = useState(false);

    const prepare = (filename: string, script: Funscript) => {
        const prepareSequence = async (filename: string, script: Funscript) => {
            if (!script) return;

            setPreparing(true);
            try {
                //const csv = convertFunscriptToCsvBlob(JSON.stringify(script));
                //const csvFile = new File([csv], script.metadata?.title || "script");
                //const uploadedScript = await HandyUtils.uploadCsv(csvFile);

                if (!handyState.connected) {
                    throw new Error("No Handy connected");
                }

                setPreparingMessage("Uploading script to server");
                const uploadedScript = await testProcessFunscript(script, filename);
                if (!uploadedScript) {
                    throw new Error("Failed to upload script to server!");
                }
                setPreparingMessage("Sending script URL to Handy");
                await sendHsspSetup(uploadedScript);
                setPreparingMessage("Synchronizing");
                await getServerTimeOffset(10);
                setPrepared(true);
            } catch (e: any) {
                console.error("Failed to set up", e);
                if (e.message === "Failed to upload script to server!") {
                    toast.error(e.message);
                } else if (e.message === "No Handy connected") {
                    toast.error(e.message);
                } else {
                    toast.error("Failed to set up Handy: " + e.message);
                }
            }
            setPreparing(false);
        };
        setFunscript(script);
        setPrepared(false);
        prepareSequence(filename, script);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4">
                <ContentDropzone value={content} onChange={setContent} className="h-16 md:h-32" />
                <FunscriptDropzone value={funscript} onChange={prepare} className="h-16 md:h-32" />
            </div>
            <Player content={content} funscript={funscript} prepared={prepared} />
            {preparing && (
                <div className="w-full flex justify-center mt-4">
                    <div className="flex flex-col gap-4 items-center">
                        <AiOutlineSync className="text-4xl animate-spin" />
                        <p className="text-xl">{preparingMessage}</p>
                    </div>
                </div>
            )}
            {prepared && <PlayerAdjustments />}
        </div>
    );
};

export default AppPlay;
