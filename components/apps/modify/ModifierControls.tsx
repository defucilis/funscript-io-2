import Modifier, { ModifierType } from "lib/modify/Modifier";
import ModifierControlsCustom from "./ModifierControlsCustom";
import ModifierControlsHalver from "./ModifierControlsHalver";
import ModifierControlsLimiter from "./ModifierControlsLimiter";
import ModifierControlsMetadata from "./ModifierControlsMetadata";
import ModifierControlsOffset from "./ModifierControlsOffset";
import ModifierControlsRemapper from "./ModifierControlsRemapper";

const ModifierControls = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    switch (modifier.type) {
        case ModifierType.Offset:
            return <ModifierControlsOffset modifier={modifier} onSetValue={onSetValue} />;
        case ModifierType.Halver:
            return <ModifierControlsHalver modifier={modifier} onSetValue={onSetValue} />;
        case ModifierType.Doubler:
            return <p>The doubler is coming soon!</p>;
        case ModifierType.Limiter:
            return <ModifierControlsLimiter modifier={modifier} onSetValue={onSetValue} />;
        case ModifierType.Remapper:
            return <ModifierControlsRemapper modifier={modifier} onSetValue={onSetValue} />;
        case ModifierType.Randomizer:
            return <p>The randomizer is coming soon!</p>;
        case ModifierType.Metadata:
            return <ModifierControlsMetadata modifier={modifier} onSetValue={onSetValue} />;
        case ModifierType.Custom:
            return <ModifierControlsCustom modifier={modifier} onSetValue={onSetValue} />;
    }

    return (
        <div>
            <h1>Unknown Modifier Type!</h1>
        </div>
    );
};

export default ModifierControls;
