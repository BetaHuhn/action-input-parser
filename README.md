<div align="center">
  
# Action Input Parser

[![Node CI](https://github.com/BetaHuhn/action-input-parser/workflows/Node%20CI/badge.svg)](https://github.com/BetaHuhn/action-input-parser/actions?query=workflow%3A%22Node+CI%22) [![Release CI](https://github.com/BetaHuhn/action-input-parser/workflows/Release%20CI/badge.svg)](https://github.com/BetaHuhn/action-input-parser/actions?query=workflow%3A%22Release+CI%22) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/action-input-parser/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/action-input-parser)

Helper for parsing inputs in a GitHub Action

</div>

## ⭐ Features

- Similar API to [`core.getInput()`](https://github.com/actions/toolkit/tree/main/packages/core#inputsoutputs)
- Parses [string, booleans, numbers and arrays](#types) to correct JS types
- Supports [default values](#default-values) if no input was provided
- Throws errors if input is set to [required](#required-inputs) and is missing
- Uses local environment variables (and `.env` files) during [development](#development)
- Specify a [custom function](#modify-the-parsed-input) for advanced parsing
- Supports [array of keys](#key)

## 🚀 Get started

Install [action-input-parser](https://github.com/BetaHuhn/action-input-parser) via npm:
```shell
npm install action-input-parser
```

## 📚 Usage

Import `action-input-parser` and use it like this:

```js
const parser = require('action-input-parser')

const value = parser.getInput('name')
```

### Example

Let's say you have the following workflow file (see [below](#development) on how to specify inputs during development):

```yml
uses: username/action
with:
    names: |
        Maximilian
        Richard
```

Pass an options object to the `getInput` function to specify the `array` type:

```js
const parser = require('action-input-parser')

const value = parser.getInput('names', {
    type: 'array'
})

// [ 'Maximilian', 'Richard' ]
```

[action-input-parser](https://github.com/BetaHuhn/action-input-parser) will parse the `names` input and return an array.

See below for [all options](#all-options) or checkout a few more [examples](#-examples).

## ⚙️ Configuration

You can pass the following JavaScript object to `getInput` as the first or second parameter to tell [action-input-parser](https://github.com/BetaHuhn/action-input-parser) what to parse:

```js
const options = {
    key: 'names',
    type: 'array',
    default: [ 'maximilian' ]
}

parser.getInput(options)

```

### All options

Here are all the options you can use and there default values:

| Name | Description | Required | Default |
| ------------- | ------------- | ------------- | ------------- |
| `key` | The key of the input option (can also be an array of keys) | **Yes** | N/A |
| `type` | The type of the input value (`string`/`boolean`/`number`/`array`) | **No** | `string` |
| `required` | Specify if the input is required | **No** | false |
| `default` | Specify a default value for the input | **No** | N/A |
| `disableable` | Specify if the input should be able to be disabled by setting it to `false` | **No** | `false` |
| `modifier` | A function which gets passed the parsed value as a parameter and returns another value  | **No** | N/A |

### Key

You can either specify a single key as a string, or multiple keys as an array of strings.

[See example](#multiple-keys)

### Types

You can specify one of the following types which will determine how the input is parsed:

- `string` - default type, the input value will only be trimmed
- `boolean` - will parse a boolean based on the [yaml 1.2 specification](https://yaml.org/spec/1.2/spec.html#id2804923)
- `number` - will convert the input to a number
- `array` - will parse line or comma seperated values to an array

> Note: if the input can not be converted to the specifed type, an error is thrown

[See example](#specify-a-type)

### Required inputs

When you set required to true and the input is not set, [action-input-parser](https://github.com/BetaHuhn/action-input-parser) will throw an error.

[See example](#set-an-input-to-be-required)

### Default values

You can specify a default value for the input which will be used when the input is not set.

[See example](#specify-a-default-value)

### Disableable input

If you have an input with a default value but you still want the user to be able to unset the input, set the `disableable` option to `true`.

When the input is then set to `false`, [action-input-parser](https://github.com/BetaHuhn/action-input-parser) will return `undefined` instead of your default value.

[See example](#disable-an-input)

### Modifier function

If your input needs additional processing you can specify a function which will be passed the parsed input value.

[See example](#modify-the-parsed-input)

### Development

If you run your Action locally during development, you can set the inputs as environment variables or specify them in a `.env` file. [action-input-parser](https://github.com/BetaHuhn/action-input-parser) will use them as the inputs automatically.

## 📖 Examples

Here are some examples on how to use [action-input-parser](https://github.com/BetaHuhn/action-input-parser):

### Basic example

Action Workflow:

```yml
uses: username/action
with:
    name: Maximilian
```

Action code:

```js
const parser = require('action-input-parser')

const value = parser.getInput('name')

// value -> Maximilian
```

or 

```js
const parser = require('action-input-parser')

const value = parser.getInput({
    key: 'name'
})

// value -> Maximilian
```

### Specify a type

Action Workflow:

```yml
uses: username/action
with:
    dry_run: true
```

Action code:

```js
const parser = require('action-input-parser')

const value = parser.getInput({ 
    key: 'dry_run',
    type: 'boolean'
})

// Without setting the type to boolean, the value would have been 'true'
```

### Specify a default value

Action code:

```js
const parser = require('action-input-parser')

const value = parser.getInput({ 
    key: 'name',
    default: 'Maximilian'
})

// If name is not set, Maximilian will be returned as the name
```

### Set an input to be required

Action code:

```js
const parser = require('action-input-parser')

const value = parser.getInput({
    key: 'name',
    required: true
})

// Will throw an error if name is not set
```

### Disable an input

Action Workflow:

```yml
uses: username/action
with:
    labels: false
```

Action code:

```js
const parser = require('action-input-parser')

const value = parser.getInput({
    key: 'labels', 
    default: [ 'merged', 'ready' ],
    disableable: true
})

// Value will be undefined because labels was set to false
```

### Multiple Keys

Action code:

```js
const parser = require('action-input-parser')

const value = parser.getInput({ 
    key: [ 'GITHUB_TOKEN', 'GH_PAT' ]
})

// The first key takes precedence
```

### Modify the parsed input

Action Workflow:

```yml
uses: username/action
with:
    name: Maximilian
```

Action code:

```js
const parser = require('action-input-parser')

const value = parser.getInput({
    key: 'name',
    modifier: (val) => {
        return val.toLowerCase()
    }
})

// Value will be maximilian
```

### Advanced example

Action Workflow:

```yml
uses: username/action
with:
    github_token: TOKEN
    repository: username/reponame
    labels: |
        merged
        ready
```

Action code:

```js
const { getInput } = require('action-input-parser')

const config = {
    githubToken: getInput({
        key: 'github_token',
        required: true
    }),
    repository: getInput({
        key: 'repository',
        modifier: (val) => {
            const [user, repo] = val.split('/')
            return { user, repo }
        }
    }),
    labels: getInput({
        key: 'labels',
        type: 'array'
    }),
    dryRun: getInput({
        key: 'dry_run',
        type: 'boolean',
        default: false
    }),
}

// parsed config:
{
    githubToken: 'TOKEN',
    repository: {
        name: 'username',
        repo: 'reponame'
    },
    labels: [ 'merged', 'ready' ],
    dryRun: false
}
```

## 💻 Development

Issues and PRs are very welcome!

The actual source code of this library is in the `src` folder.

- run `yarn lint` or `npm run lint` to run eslint.
- run `yarn build` or `npm run build` to produce a compiled version in the `lib` folder.

## ❔ About

This project was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F81S2RK)

## 📄 License

Copyright 2021 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
