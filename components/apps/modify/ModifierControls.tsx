import Modifier, { ModifierType } from "lib/modify/Modifier";
import ModifierControlsCustom from "./ModifierControlsCustom";
import ModifierControlsDoubler from "./ModifierControlsDoubler";
import ModifierControlsHalver from "./ModifierControlsHalver";
import ModifierControlsLimiter from "./ModifierControlsLimiter";
import ModifierControlsMetadata from "./ModifierControlsMetadata";
import ModifierControlsOffset from "./ModifierControlsOffset";
import ModifierControlsRandomizer from "./ModifierControlsRandomizer";
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
            return <ModifierControlsDoubler modifier={modifier} onSetValue={onSetValue} />;
        case ModifierType.Limiter:
            return <ModifierControlsLimiter modifier={modifier} onSetValue={onSetValue} />;
        case ModifierType.Remapper:
            return <ModifierControlsRemapper modifier={modifier} onSetValue={onSetValue} />;
        case ModifierType.Randomizer:
            return <ModifierControlsRandomizer modifier={modifier} onSetValue={onSetValue} />;
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
