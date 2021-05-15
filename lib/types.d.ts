declare type ModifierFunction = (val: InputValue) => InputValue;
export declare type InputValue = undefined | string | boolean | number | Array<string | boolean | number>;
export interface IOpts {
    key?: string | Array<string>;
    type?: string;
    required?: boolean;
    disableable?: boolean;
    default?: InputValue;
    modifier?: ModifierFunction;
}
export interface IParsedOpts {
    key: string | Array<string>;
    type: string;
    required: boolean;
    disableable: boolean;
    default?: InputValue;
    modifier?: ModifierFunction;
}
export {};
