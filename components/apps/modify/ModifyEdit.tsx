import { MdKeyboardArrowLeft } from "react-icons/md";
import { useEffect, useState } from "react";
import ButtonIcon from "components/atoms/ButtonIcon";
import Modifier, { ModifierType, ModifierOperations } from "lib/modify/Modifier";
import Button from "components/atoms/Button";
import ModifierControls from "./ModifierControls";

const ModifyEdit = ({
    modifier,
    index,
    onConfirm,
    onCancel,
    active,
}: {
    modifier: Modifier | null;
    index: number;
    onConfirm: (newModifier: Modifier, index: number) => void;
    onCancel: () => void;
    active: boolean;
}): JSX.Element => {
    const [internalModifier, setInternalModifier] = useState<Modifier | null>(null);

    useEffect(() => {
        setInternalModifier(modifier);
    }, [modifier]);

    const cancel = () => {
        setInternalModifier(null);
        onCancel();
    };

    const confirm = () => {
        if (!internalModifier) return;
        onConfirm(internalModifier, index);
        setInternalModifier(null);
    };

    const update = (key: string, value: boolean | number | string) => {
        if (!internalModifier) return;

        const newMod = ModifierOperations.setValue(internalModifier, key, value);
        setInternalModifier(newMod);
    };

    return (
        <div
            className="absolute w-full"
            style={{
                top: 0,
                left: active ? "0" : "100vw",
                transition: "all 0.5s",
            }}
        >
            {internalModifier && (
                <>
                    <div className="flex gap-4 items-center mb-4">
                        <ButtonIcon onClick={cancel}>
                            <MdKeyboardArrowLeft />
                        </ButtonIcon>
                        <h1 className="text-2xl">
                            {ModifierType[internalModifier.type]} #{internalModifier.id}
                        </h1>
                    </div>
                    <ModifierControls modifier={internalModifier} onSetValue={update} />
                    <Button onClick={confirm} className="bg-green-700">
                        Confirm
                    </Button>
                </>
            )}
        </div>
    );
};

export default ModifyEdit;
