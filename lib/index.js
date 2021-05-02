"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInput = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var VALID_TYPES = ['string', 'array', 'boolean'];
var DEFAULT_OPTIONS = {
    required: false,
    type: 'string',
    disableable: false
};
var getEnvVar = function (key) {
    var parsed = process.env["INPUT_" + key.replace(/ /g, '_').toUpperCase()];
    var raw = process.env[key];
    return parsed || raw || undefined;
};
var parseArray = function (val) {
    var array = val.split('\n').join(',').split(',');
    var filtered = array.filter(function (n) { return n; });
    return filtered.map(function (n) { return n.trim(); });
};
var parseBoolean = function (val) {
    var trueValue = ['true', 'True', 'TRUE'];
    var falseValue = ['false', 'False', 'FALSE'];
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new Error('boolean input has to be one of \`true | True | TRUE | false | False | FALSE\`');
};
var parseValue = function (val, type) {
    if (type === 'array') {
        return parseArray(val);
    }
    if (type === 'boolean') {
        return parseBoolean(val);
    }
    return val.trim();
};
var getInput = function (key, opts) {
    var parsedOptions;
    if (typeof key === 'string') {
        parsedOptions = __assign({ key: key }, opts);
    }
    else if (typeof key === 'object') {
        parsedOptions = key;
    }
    else {
        throw new Error('No key for input specified');
    }
    if (!parsedOptions.key)
        throw new Error('No key for input specified');
    var options = Object.assign({}, DEFAULT_OPTIONS, parsedOptions);
    if (VALID_TYPES.includes(options.type) === false)
        throw new Error('option type has to be one of `string | array | boolean`');
    var val = getEnvVar(options.key);
    if (options.disableable && val === 'false')
        return undefined;
    var parsed = val !== undefined ? parseValue(val, options.type) : undefined;
    if (!parsed) {
        if (options.required)
            throw new Error("Input `" + options.key + "` is required but was not provided.");
        if (options.default)
            return options.default;
        return undefined;
    }
    if (options.modifier)
        return options.modifier(parsed);
    return parsed;
};
exports.getInput = getInput;
module.exports.getInput = exports.getInput;
