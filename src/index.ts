import dotenv from 'dotenv'
import { ArrayOpts, BaseInputValue, BooleanOpts, InputValue, IOpts, IParsedOpts, NumberOpts, StringOpts } from './types'

dotenv.config()

const VALID_TYPES = [ 'string', 'array', 'boolean', 'number' ]

const DEFAULT_OPTIONS: IOpts = {
	required: false,
	type: 'string',
	disableable: false
}

const getEnvVar = (key: string): string | undefined => {
	const parsed = process.env[`INPUT_${ key.replace(/ /g, '_').toUpperCase() }`]
	const raw = process.env[key]

	return parsed || raw || undefined
}

const parseArray = (val: string) => {
	const array = val.split('\n').join(',').split(',')
	const filtered = array.filter((n) => n)

	return filtered.map((n) => n.trim())
}

const parseBoolean = (val: string) => {
	const trueValue = [ 'true', 'True', 'TRUE' ]
	const falseValue = [ 'false', 'False', 'FALSE' ]

	if (trueValue.includes(val)) return true
	if (falseValue.includes(val)) return false

	throw new Error('boolean input has to be one of \`true | True | TRUE | false | False | FALSE\`')
}

const parseNumber = (val: string) => {
	const parsed = Number(val)

	if (isNaN(parsed)) throw new Error('input has to be a valid number')

	return parsed
}

const parseValue = (val: string, type: string): InputValue => {
	if (type === 'array') {
		return parseArray(val)
	}

	if (type === 'boolean') {
		return parseBoolean(val)
	}

	if (type === 'number') {
		return parseNumber(val)
	}

	return val.trim()
}

// eslint-disable-next-line no-unused-vars
export function getInput(key: string | Array<string> | IOpts, opts: BooleanOpts): boolean;
// eslint-disable-next-line no-unused-vars,no-redeclare
export function getInput(key: string | Array<string> | IOpts, opts: StringOpts): string;
// eslint-disable-next-line no-unused-vars,no-redeclare
export function getInput(key: string | Array<string> | IOpts, opts: NumberOpts): number;
// eslint-disable-next-line no-unused-vars,no-redeclare
export function getInput(key: string | Array<string> | IOpts, opts: ArrayOpts): BaseInputValue[];
// eslint-disable-next-line no-redeclare
export function getInput(key: string | Array<string> | IOpts, opts: IOpts): InputValue {
	let parsedOptions: IOpts
	if (typeof key === 'string' || Array.isArray(key)) {
		parsedOptions = {
			key: key,
			...opts
		}
	} else if (typeof key === 'object') {
		parsedOptions = key
	} else {
		throw new Error('No key for input specified')
	}

	if (!parsedOptions.key) throw new Error('No key for input specified')

	const options = Object.assign({}, DEFAULT_OPTIONS, parsedOptions) as IParsedOpts

	if (VALID_TYPES.includes(options.type) === false) throw new Error('option type has to be one of `string | array | boolean | number`')

	const val = typeof options.key === 'string' ? getEnvVar(options.key) : options.key.map((key) => getEnvVar(key)).filter((item) => item)[0]

	if (options.disableable && val === 'false') return undefined

	const parsed: InputValue = val !== undefined ? parseValue(val, options.type) : undefined
	if (parsed === undefined) {
		if (options.required) throw new Error(`Input \`${ options.key }\` is required but was not provided.`)
		if (options.default !== undefined) return options.default

		return undefined
	}

	if (options.modifier) return options.modifier(parsed)
	return parsed
}

module.exports.getInput = getInput