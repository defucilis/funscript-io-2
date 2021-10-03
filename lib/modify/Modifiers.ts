// import Modifier, { ModifierType } from "./Modifier";
// import ModifierCustom from "./ModifierCustom";
// import ModifierLimiter from "./ModifierCustom";
// import ModifierDoubler from "./ModifierDoubler";
// import ModifierHalver from "./ModifierHalver";
// import ModifierMetadata from "./ModifierMetadata";
// import ModifierOffset from "./ModifierOffset";
// import ModifierRandomizer from "./ModifierRandomizer";
// import ModifierRemapper from "./ModifierRemapper";

// export default class Modifiers {
//     public modifiers: Modifier[] = [];
//     public newModifier: Modifier | null = null;
//     public editingModifier = -1;

//     private _nextId = 0;

//     public createNewModifier(type: ModifierType): void {
//         switch(type) {
//             case ModifierType.Offset:
//                 this.newModifier = new ModifierOffset(type, this._nextId);
//                 break;
//             case ModifierType.Halver:
//                 this.newModifier = new ModifierHalver(type, this._nextId);
//                 break;
//             case ModifierType.Doubler:
//                 this.newModifier = new ModifierDoubler(type, this._nextId);
//                 break;
//             case ModifierType.Limiter:
//                 this.newModifier = new ModifierLimiter(type, this._nextId);
//                 break;
//             case ModifierType.Randomizer:
//                 this.newModifier = new ModifierRandomizer(type, this._nextId);
//                 break;
//             case ModifierType.Remapper:
//                 this.newModifier = new ModifierRemapper(type, this._nextId);
//                 break;
//             case ModifierType.Metadata:
//                 this.newModifier = new ModifierMetadata(type, this._nextId);
//                 break;
//             case ModifierType.Custom:
//                 this.newModifier = new ModifierCustom(type, this._nextId);
//                 break;
//             default:
//                 throw new Error("Invalid value " + type + " for ModifierType!");
//         }
//         this._nextId++;
//     }

//     public addNewModifier(): void {
//         if(!this.newModifier) return;
//         this.modifiers.push(this.newModifier);
//         this.newModifier = null;
//     }

//     // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
//     public editModifier(key: string, vaule: any): void {
//         if(this.editingModifier === -1) return;
//         this.modifiers[this.editingModifier].setValue(key, vaule);
//     }

//     public deleteModifier(id: number): void {
//         this.modifiers = this.modifiers.filter(m => m.id !== id);
//     }

//     public moveModifier(index: number, increment: 1 | -1): void {
//         const output: Modifier[] = [];
//         const swapA = index;
//         const swapB = index + increment;
//         for (let i = 0; i < this.modifiers.length; i++) {
//             if (i === swapA) output.push(this.modifiers[swapB]);
//             else if (i === swapB) output.push(this.modifiers[swapA]);
//             else output.push(this.modifiers[i]);
//         }

//         this.modifiers = output;
//     }
// }

export {};
