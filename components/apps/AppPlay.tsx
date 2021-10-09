import { useEffect, useState } from "react";
import ContentDropzone, { PlayableContent } from "components/molecules/ContentDropzone";
import { Funscript } from "lib/funscript-utils/types";
import FunscriptDropzone from "components/molecules/FunscriptDropzone";
import { convertFunscriptToCsv } from "lib/funscript-utils/funConverter";
import HandyUtils from "lib/thehandy/HandyUtils";
import useHandy from "lib/thehandy-react";
import Player from "./organisms/Player";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppPlay = (): JSX.Element => {
    const { sendHsspSetup } = useHandy();

    const [content, setContent] = useState<PlayableContent | null>(null);
    const [funscript, setFunscript] = useState<Funscript | null>(null);

    useEffect(() => {
        const prepareSequence = async () => {
            if (!funscript) return;

            try {
                const csv = convertFunscriptToCsv(JSON.stringify(funscript));
                const csvFile = new File([csv], funscript.metadata?.title || "script");
                const uploadedScript = await HandyUtils.uploadCsv(csvFile);
                console.log(uploadedScript);
                await sendHsspSetup(uploadedScript.url);
            } catch (e) {
                console.error("Failed to set up", e);
            }
        };
        prepareSequence();
    }, [funscript]);

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4">
                <ContentDropzone value={content} onChange={setContent} className="h-16 md:h-32" />
                <FunscriptDropzone
                    value={funscript}
                    onChange={setFunscript}
                    className="h-16 md:h-32"
                />
            </div>
            <Player content={content} funscript={funscript} />
        </div>
    );
};

export default AppPlay;
