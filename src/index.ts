import dotenv from 'dotenv'
dotenv.config()

import { IOpts, IParsedOpts, InputValue } from './types'

const VALID_TYPES = [ 'string', 'array', 'boolean' ]

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

const parseValue = (val: string, type: string): InputValue => {
	try {
		if (type === 'array') {
			return parseArray(val)
		}

		if (type === 'boolean') {
			return parseBoolean(val)
		}

		return val.trim()
	} catch (err) {
		return err
	}
}

export const getInput = (key: string | IOpts, opts: IOpts): InputValue => {
	let parsedOptions: IOpts
	if (typeof key === 'string') {
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

	if (VALID_TYPES.includes(options.type) === false) throw new Error('option type has to be one of `string | array | boolean`')

	const val = getEnvVar(options.key)

	if (options.disableable && val === 'false') return undefined

	const parsed: InputValue = val !== undefined ? parseValue(val, options.type) : undefined
	if (!parsed) {
		if (options.required) throw new Error(`Input \`${ options.key }\` is required but was not provided.`)
		if (options.default) return options.default

		return undefined
	}

	if (options.modifier) return options.modifier(parsed)
	return parsed
}

module.exports.getInput = getInput