/* eslint-disable no-unused-vars */
type ModifierFunction = (val: InputValue) => InputValue

export type BaseInputValue = string | boolean | number;

export type InputValue = undefined | BaseInputValue | Array<BaseInputValue>

export type IOpts = BooleanOpts | StringOpts | NumberOpts | ArrayOpts | BaseOpts<InputValue>;

export interface BooleanOpts extends BaseOpts<boolean> {
	type: 'boolean';
}

export interface StringOpts extends BaseOpts<string> {
	type: 'string';
}

export interface NumberOpts extends BaseOpts<number> {
	type: 'number';
}

export interface ArrayOpts extends BaseOpts<BaseInputValue[]> {
	type: 'array';
}

export interface BaseOpts<T extends InputValue> {
	key?: string | Array<string>
	type?: string
	required?: boolean,
	disableable?: boolean
	default?: T
	modifier?: ModifierFunction
}

export interface IParsedOpts {
	key: string | Array<string>
	type: string
	required: boolean,
	disableable: boolean
	default?: InputValue
	modifier?: ModifierFunction
}