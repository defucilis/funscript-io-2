import React, { useCallback, useRef } from "react";

import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsCustom = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleKey = useCallback(
        (e: React.KeyboardEvent) => {
            if (!textAreaRef.current) return;
            if (e.key !== "Tab") return;

            e.preventDefault();
            const start = textAreaRef.current.selectionStart;
            const end = textAreaRef.current.selectionEnd;
            textAreaRef.current.value =
                textAreaRef.current.value.substring(0, start) +
                "    " +
                textAreaRef.current.value.substring(end);
            textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = start + 4;
            onSetValue("customFunction", textAreaRef.current.value);
        },
        [textAreaRef]
    );

    return (
        <div className="flex flex-col gap-4 my-4">
            <div className="flex gap-4">
                <label>Custom Function</label>
                <textarea
                    value={ModifierOperations.getString(modifier, "customFunction")}
                    onChange={e => onSetValue("customFunction", e.target.value)}
                    className="bg-neutral-700 text-white p-1 rounded resize-y w-full h-32 font-mono"
                    ref={textAreaRef}
                    onKeyDown={handleKey}
                />
            </div>
        </div>
    );
};

export default ModifierControlsCustom;
