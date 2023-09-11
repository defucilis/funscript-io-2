import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineSync } from "react-icons/ai";
import useHandy, { HandyMode } from "thehandy-react";
import ContentDropzone, { PlayableContent } from "components/molecules/ContentDropzone";
import { Funscript } from "lib/funscript-utils/types";
import FunscriptDropzone from "components/molecules/FunscriptDropzone";
import { testProcessFunscript } from "lib/customCsvUpload";
import TextField from "components/molecules/TextField";
import Player from "./play/Player";
import PlayerAdjustments from "./player/PlayerAdjustments";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppPlay = (): JSX.Element => {
    //const { sendHsspSetup, handyState } = useHandy();
    const { sendMode, handyState, sendHsspSetup, getServerTimeOffset } = useHandy();

    const [content, setContent] = useState<PlayableContent | null>(null);
    const [funscript, setFunscript] = useState<Funscript | null>(null);
    const [preparing, setPreparing] = useState(false);
    const [preparingMessage, setPreparingMessage] = useState("");
    const [countdownTime, setCountdownTime] = useState("");
    const countdownSeconds = useMemo(() => {
        if (!countdownTime) return 0;
        const pieces = countdownTime.split(":");
        if (pieces.length > 2) return 0;
        let seconds = 0;
        for (let i = 0; i < pieces.length; i++) {
            if (!pieces[i]) continue;
            if (pieces.length > 1 && i === 0) seconds += 60 * Number(pieces[i]);
            else if (pieces.length === 1 || i > 0) seconds += Number(pieces[i]);
        }
        return seconds;
    }, [countdownTime]);
    const [prepared, setPrepared] = useState(false);

    useEffect(() => {
        sendMode(HandyMode.hssp);
    }, [sendMode]);

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

    const isCountdownTimeValid = (time: string) => {
        if (!time) return true;
        const pieces = time.split(":");
        if (pieces.length > 2) return false;
        for (let i = 0; i < pieces.length; i++) {
            if (!pieces[i]) continue;
            if (isNaN(Number(pieces[i]))) return false;
        }
        return true;
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4">
                <ContentDropzone value={content} onChange={setContent} className="h-16 md:h-32" />
                <FunscriptDropzone value={funscript} onChange={prepare} className="h-16 md:h-32" />
            </div>
            <Player
                content={content}
                funscript={funscript}
                prepared={prepared}
                countdownTime={countdownSeconds}
            />
            {preparing && (
                <div className="w-full flex justify-center mt-4">
                    <div className="flex flex-col gap-4 items-center">
                        <AiOutlineSync className="text-4xl animate-spin" />
                        <p className="text-xl">{preparingMessage}</p>
                    </div>
                </div>
            )}
            {!preparing && content && (
                <TextField
                    label="Countdown Time"
                    className="mt-2"
                    value={countdownTime}
                    error={isCountdownTimeValid(countdownTime) ? "" : "Invalid time"}
                    onChange={setCountdownTime}
                />
            )}
            {prepared && <PlayerAdjustments />}
        </div>
    );
};

export default AppPlay;
