# kenote-node-utils

Node.js Utils

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Codecov Status][codecov-image]][codecov-url]
[![Gratipay][licensed-image]][licensed-url]

[npm-image]: https://img.shields.io/npm/v/kenote-node-utils.svg
[npm-url]: https://www.npmjs.org/package/kenote-node-utils
[downloads-image]: https://img.shields.io/npm/dm/kenote-node-utils.svg
[downloads-url]: https://npmjs.org/package/kenote-node-utils
[travis-image]: https://api.travis-ci.com/kenote/kenote-node-utils.svg?branch=master
[travis-url]: https://travis-ci.com/kenote/kenote-node-utils
[codecov-image]: https://img.shields.io/codecov/c/github/kenote/kenote-node-utils/master.svg
[codecov-url]:   https://codecov.io/github/kenote/kenote-node-utils?branch=master
[licensed-image]: https://img.shields.io/badge/license-MIT-blue.svg
[licensed-url]: https://github.com/kenote/kenote-node-utils/blob/master/LICENSE

## Engines

- `Node.js` >= `8.0.0`

## Install

```bash
yarn add kenote-node-utils
```

## Features

- loadConfig

```js
import * as utils from 'kenote-node-utils'

const config = utils.loadConfig('config.ini')

console.log(config)
/*
{
  HOST: '0.0.0.0',
  POST: 4000
}
/*
```

:: `config.ini`

```ini
; Configure Production

HOST = 0.0.0.0
PORT = 4000
```

## License

this repo is released under the [MIT License](https://github.com/kenote/kenote-node-utils/blob/master/LICENSE).