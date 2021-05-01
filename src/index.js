require('dotenv').config()

const VALID_TYPES = [ 'string', 'array', 'boolean' ]

const DEFAULT_OPTIONS = {
	required: false,
	type: 'string',
	disableable: false
}

const getEnvVar = (key) => {
	const parsed = process.env[`INPUT_${ key.replace(/ /g, '_').toUpperCase() }`]
	const raw = process.env[key]

	return parsed || raw || undefined
}

const parseArray = (val) => {
	const array = val.split('\n').join(',').split(',')
	const filtered = array.filter((n) => n)

	return filtered.map((n) => n.trim())
}

const parseBoolean = (val) => {
	const trueValue = [ 'true', 'True', 'TRUE' ]
	const falseValue = [ 'false', 'False', 'FALSE' ]

	if (trueValue.includes(val)) return true
	if (falseValue.includes(val)) return false

	return new Error('boolean input has to be one of \`true | True | TRUE | false | False | FALSE\`')
}

const parseValue = (val, type) => {
	if (type === 'array') {
		return parseArray(val)
	}

	if (type === 'boolean') {
		return parseBoolean(val)
	}

	return val.trim()
}

const getInput = (key, opts) => {

	let parsedOptions = key
	if (typeof key === 'string') {
		parsedOptions = {
			key: key,
			...opts
		}
	}

	const options = Object.assign({}, DEFAULT_OPTIONS, parsedOptions)

	// Check if the provided type is supported
	if (VALID_TYPES.includes(options.type) === false) return new Error('option type has to be one of `string | array | boolean`')

	// Get the value for the given key
	const val = getEnvVar(options.key)

	// If variable can be turned off regardless of type, return undefined
	if (options.disableable && val === 'false')
		return undefined

	// Parse value based on type
	const parsed = val !== undefined ? parseValue(val, options.type) : undefined

	// If value is required throw error, else return default value if specified
	if (!parsed) {
		if (options.required) return new Error(`Input \`${ options.key }\` is required but was not provided.`)
		if (options.default) return options.default

		return undefined
	}

	// Run modifier function if specified
	if (options.modifier) return options.modifier(parsed)

	// Finally return parsed value
	return parsed
}

module.exports = getInput