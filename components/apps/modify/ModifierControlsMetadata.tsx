import TextAreaField from "components/atoms/TextAreaField";
import TextField from "components/atoms/TextField";
import Modifier, { ModifierOperations } from "lib/modify/Modifier";

const ModifierControlsMetadata = ({
    modifier,
    onSetValue,
}: {
    modifier: Modifier;
    onSetValue: (key: string, value: any) => void;
}): JSX.Element => {
    return (
        <div className="flex flex-col gap-4 my-4">
            <p className="text-neutral-500 italic leading-none">
                Adds custom metadata to the funscript file, for display in various player
                applications.
            </p>
            <TextField
                value={ModifierOperations.getString(modifier, "title")}
                onChange={val => onSetValue("title", val)}
                label="Title"
            />
            <TextField
                value={ModifierOperations.getString(modifier, "creator")}
                onChange={val => onSetValue("creator", val)}
                label="Creator"
            />
            <TextField
                value={ModifierOperations.getString(modifier, "scriptUrl")}
                onChange={val => onSetValue("scriptUrl", val)}
                label="Script URL"
            />
            <TextField
                value={ModifierOperations.getString(modifier, "videoUrl")}
                onChange={val => onSetValue("videoUrl", val)}
                label="Video URL"
            />

            <TextAreaField
                label="Description"
                value={ModifierOperations.getString(modifier, "description")}
                onChange={value => onSetValue("description", value)}
                height={20}
            />
            <TextField
                value={ModifierOperations.getString(modifier, "performers")}
                onChange={val => onSetValue("performers", val)}
                label="Performers (comma-separated)"
            />
            <TextField
                value={ModifierOperations.getString(modifier, "tags")}
                onChange={val => onSetValue("tags", val)}
                label="Tags (comma-separated)"
            />
            <TextAreaField
                label="Notes"
                value={ModifierOperations.getString(modifier, "notes")}
                onChange={value => onSetValue("notes", value)}
                height={20}
            />
            <TextField
                value={ModifierOperations.getString(modifier, "license")}
                onChange={val => onSetValue("license", val)}
                label="License"
            />
            <TextField
                value={ModifierOperations.getString(modifier, "type")}
                onChange={val => onSetValue("type", val)}
                label="Type"
            />
        </div>
    );
};

export default ModifierControlsMetadata;
