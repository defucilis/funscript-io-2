import { useState } from "react";
import ContentDropzone, { PlayableContent } from "components/molecules/ContentDropzone";
import { Funscript } from "lib/funscript-utils/types";
import FunscriptDropzone from "components/molecules/FunscriptDropzone";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppPlay = (): JSX.Element => {
    const [content, setContent] = useState<PlayableContent | null>(null);
    const [funscript, setFunscript] = useState<Funscript | null>(null);

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
        </div>
    );
};

export default AppPlay;
