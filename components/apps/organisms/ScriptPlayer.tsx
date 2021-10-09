import { Funscript } from "lib/funscript-utils/types";

const ScriptPlayer = ({ script }: { script: Funscript }): JSX.Element => {
    return <div>{script.actions.length} actions</div>;
};

export default ScriptPlayer;
