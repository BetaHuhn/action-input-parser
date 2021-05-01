/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 437:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/* @flow */
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/

const fs = __nccwpck_require__(747)
const path = __nccwpck_require__(622)

function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

const NEWLINE = '\n'
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_NEWLINES = /\\n/g
const NEWLINES_MATCH = /\n|\r|\r\n/

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug)
  const obj = {}

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '')
      const end = val.length - 1
      const isDoubleQuoted = val[0] === '"' && val[end] === '"'
      const isSingleQuoted = val[0] === "'" && val[end] === "'"

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end)

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE)
        }
      } else {
        // remove surrounding whitespace
        val = val.trim()
      }

      obj[key] = val
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
    }
  })

  return obj
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding /*: string */ = 'utf8'
  let debug = false

  if (options) {
    if (options.path != null) {
      dotenvPath = options.path
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
    if (options.debug != null) {
      debug = true
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
      }
    })

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

module.exports.config = config
module.exports.parse = parse


/***/ }),

/***/ 351:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

__nccwpck_require__(437).config()

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

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(351);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;