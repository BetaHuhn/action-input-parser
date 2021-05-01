declare type ModifierFunction = (val: InputValue) => InputValue;
export declare type InputValue = undefined | string | boolean | Array<string | boolean>;
export interface IOpts {
    key?: string;
    type?: string;
    required?: boolean;
    disableable?: boolean;
    default?: InputValue;
    modifier?: ModifierFunction;
}
export interface IParsedOpts {
    key: string;
    type: string;
    required: boolean;
    disableable: boolean;
    default?: InputValue;
    modifier?: ModifierFunction;
}
export {};
