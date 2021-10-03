import { Funscript } from "lib/funscript-utils/types";
import Modifier from "./Modifier";

export default class ModifierMetadata extends Modifier {
    public creator = "";
    public description = "";
    public license = "";
    public notes = "";
    public performers = "";
    public scriptUrl = "";
    public tags = "";
    public title = "";
    public scriptType = "";
    public videoUrl = "";

    public apply(funscript: Funscript): Funscript {
        const metadata = {
            creator: this.creator,
            description: this.description,
            license: this.license,
            notes: this.notes,
            performers: this.performers
                ? this.performers.split(",").map(performer => performer.trim())
                : [],
            script_url: this.scriptUrl,
            tags: this.tags ? this.tags.split(",").map(tag => tag.trim()) : [],
            title: this.title,
            type: this.scriptType,
            video_url: this.videoUrl,
        };
        return { ...this.prepare(funscript), metadata };
    }

    public toString(): string {
        const values = [
            this.creator,
            this.description,
            this.license,
            this.notes,
            this.performers,
            this.scriptUrl,
            this.tags,
            this.title,
            this.scriptType,
            this.videoUrl,
        ];
        return values.filter(value => !!value).length + " custom values";
    }

    public reset(): void {
        this.creator = "";
        this.description = "";
        this.license = "";
        this.notes = "";
        this.performers = "";
        this.scriptUrl = "";
        this.tags = "";
        this.title = "";
        this.scriptType = "";
        this.videoUrl = "";
    }
}
