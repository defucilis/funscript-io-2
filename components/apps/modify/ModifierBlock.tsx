import React from "react";
import {
    MdKeyboardArrowUp,
    MdUndo,
    MdKeyboardArrowDown,
    MdDelete,
    MdArrowDownward,
} from "react-icons/md";
import Modifier, { ModifierOperations, ModifierType } from "lib/modify/Modifier";

const ModifierBlock = ({
    modifier,
    onDelete,
    onOpen,
    onReset,
    onUp,
    onDown,
    isFirst,
    isLast,
}: {
    modifier: Modifier;
    onOpen: () => void;
    onDelete: () => void;
    onReset: () => void;
    onUp: () => void;
    onDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}): JSX.Element => {
    const tryDelete = () => {
        if (!window.confirm(`Really delete ${ModifierType[modifier.type]} modifier?`)) return;
        onDelete();
    };

    return (
        <>
            <div className="flex justify-between h-20 bg-primary-400 w-full rounded p-2 pl-4 hover:bg-primary-500 transition-all gap-2">
                <div className="h-full cursor-pointer flex-grow" onClick={onOpen}>
                    <h2 className="text-xl font-bold text-neutral-900">
                        {ModifierType[modifier.type]} #{modifier.id}
                    </h2>
                    <p className="italic text-neutral-700 leading-none">
                        {ModifierOperations.getTagline(modifier.type)}
                    </p>
                </div>
                <div
                    className="grid grid-rows-2 grid-cols-2 gap-1 h-full text-white text-xl flex-shrink-0"
                    style={{
                        flexBasis: "4rem",
                    }}
                >
                    <button
                        className="grid place-items-center rounded bg-neutral-800"
                        onClick={tryDelete}
                    >
                        <MdDelete />
                    </button>
                    <button
                        className="grid place-items-center rounded bg-neutral-800 text-2xl"
                        disabled={isFirst}
                        onClick={onUp}
                    >
                        <MdKeyboardArrowUp />
                    </button>
                    <button
                        className="grid place-items-center rounded bg-neutral-800"
                        onClick={onReset}
                    >
                        <MdUndo />
                    </button>
                    <button
                        className="grid place-items-center rounded bg-neutral-800 text-2xl"
                        disabled={isLast}
                        onClick={onDown}
                    >
                        <MdKeyboardArrowDown />
                    </button>
                </div>
            </div>
            {!isLast && <MdArrowDownward className="text-2xl -my-1" />}
        </>
    );
};

export default ModifierBlock;
