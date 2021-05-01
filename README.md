<div align="center">
  
# Action Config Parser

[![Node CI](https://github.com/BetaHuhn/action-config-parser/workflows/Node%20CI/badge.svg)](https://github.com/BetaHuhn/action-config-parser/actions?query=workflow%3A%22Node+CI%22) [![Release CI](https://github.com/BetaHuhn/action-config-parser/workflows/Release%20CI/badge.svg)](https://github.com/BetaHuhn/action-config-parser/actions?query=workflow%3A%22Release+CI%22) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/action-config-parser/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/action-config-parser)

Helper for parsing inputs in a GitHub Action

</div>

## ⭐ Features

- Similar API to [`core.getInput()`](https://github.com/actions/toolkit/tree/main/packages/core)
- Parses string, booleans and arrays to correct JS types
- Specify default values if no input was provided
- Throws errors if input is set to required and is missing
- Uses local environment variables (and `.env` files) during development
- Modify values after parsing

## 🚀 Get started

Install [action-config-parser](https://github.com/BetaHuhn/action-config-parser) via npm:
```shell
npm install action-config-parser
```

## 📚 Usage

Import `action-config-parser` and use it like this:

```js
const parser = require('action-config-parser')

const value = parser.getInput('name')
```

Let's say you have the following workflow file:

```yml
uses: username/action
with:
    names: |
        Maximilian
        Richard
```

Pass an options object to the `getInput` function to specify the type:

```js
const parser = require('action-config-parser')

const value = parser.getInput('names', {
    type: 'array'
})

// [ 'Maximilian', 'Richard' ]
```

See below for all options or checkout a few more examples.

## ⚙️ Configuration

You can pass the following JavaScript object to `getInput` as the first or second parameter to tell [action-config-parser](https://github.com/BetaHuhn/action-config-parser) what to parse:

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
| `key` | The key of the input option | **Yes** | N/A |
| `type` | The type of the input value (`string`/`boolean`/`array`) | **No** | `string` |
| `required` | Specify if the input is required | **No** | false |
| `default` | Specify a default value for the input | **No** | N/A |
| `disableable` | Specify if the input should be able to be disabled by setting it to `false` | **No** | `false` |
| `modifier` | A function which gets passed the parsed value as a parameter and returns another value  | **No** | N/A |

### Types

You can specify one of the following types which will determine how the input is parsed:

- `string` - default type, the input value will only be trimmed
- `boolean` - will parse a boolean based on the [yaml 1.2 specification](https://yaml.org/spec/1.2/spec.html#id2804923)
- `array` - will parse line or comma seperated values to an array

### Required inputs

When you set required to true and the input is not set, [action-config-parser](https://github.com/BetaHuhn/action-config-parser) will throw an error.

### Default values

You can specify a default value for the input which will be used when the input is not set.

### Disableable input

If you have an input with a default value but you still want the user to be able to unset the input, set the `disableable` option to `true`.

When the input is then set to `false`, [action-config-parser](https://github.com/BetaHuhn/action-config-parser) will return `undefined` instead of your default value.

### Modifier function

If your input needs additional processing you can specify a function which will be passed the parsed input value.

## 📖 Examples

Here are some examples on how to use [action-config-parser](https://github.com/BetaHuhn/action-config-parser):

### Basic example

Action Workflow:

```yml
uses: username/action
with:
    name: Maximilian
```

Action code:

```js
const parser = require('action-config-parser')

const value = parser.getInput('name')

// value -> Maximilian
```

or 

```js
const parser = require('action-config-parser')

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
const parser = require('action-config-parser')

const value = parser.getInput({ 
    key: 'dry_run',
    type: 'boolean'
})

// Without setting the type to boolean, the value would have been 'true'
```

### Specify a default value

Action code:

```js
const parser = require('action-config-parser')

const value = parser.getInput({ 
    key: 'name',
    default: 'Maximilian'
})

// If name is not set, Maximilian will be returned as the name
```

### Set an input to be required

Action code:

```js
const parser = require('action-config-parser')

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
const parser = require('action-config-parser')

const value = parser.getInput({
    key: 'labels', 
    default: [ 'merged', 'ready' ],
    disableable: true
})

// Value will be undefined because labels was set to false
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
const parser = require('action-config-parser')

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
const { getInput } = require('action-config-parser')

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
