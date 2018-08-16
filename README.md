# kenote-node-utils

Node.js Utils

![NPM](https://nodei.co/npm/kenote-node-utils.png?downloads=true)

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

- [x] [loadConfig](#loadConfig)
- [x] [getMongooseOptions](#getMongooseOptions)
- [x] [md5](#md5,%20sha1)
- [x] [sha1](#md5,%20sha1)
- [x] [encryptPwd](#encryptPwd)
- [x] [validPassword](#validPassword)
- [x] [isAccess](#isAccess)
- [x] [callback](#callback)
- [x] [isNull](#isNull)
- [x] [checkLength](#checkLength)
- [x] [isPattern](#isPattern)
- [x] [validRule](#validRule)
- [x] [filterData](#filterData)

### loadConfig

config.json
```json
{
  "HOST": "0.0.0.0",
  "PORT": 4000
}
```

config.ini
```ini
; Configure Production

HOST = 0.0.0.0
PORT = 4000
```

app.js
```js
import { loadConfig } from 'kenote-node-utils'

const configJson = loadConfig('config.json')
/*
{
  HOST: '0.0.0.0',
  POST: 4000
}
*/

const configIni = loadConfig('config.ini')
/*
{
  HOST: '0.0.0.0',
  POST: 4000
}
*/
```

### getMongooseOptions

app.js
```js
import mongoose from 'mongoose'
import { getMongooseOptions } from 'kenote-node-utils'

const mongoUri = 'mongodb://localhost:27017/collection-name'
const options = getMongooseOptions(mongoose.version)

mongoose.connect(mongoUri, options, err => {
  if (err) {
    console.error(`connect to ${mongoUri} error: ${err.message}`)
    process.exit(1)
  }
})
```

### md5, sha1

app.js
```js
import { md5, sha1 } from 'kenote-node-utils'

const md5String = utils.md5('123456')
const sha1String = utils.sha1('123456')

console.log('md5: %s, sha1: %s', md5String, sha1String)
```

### encryptPwd

app.js
```js
import { encryptPwd } from 'kenote-node-utils'

const salt = Math.random().toString(36).substr(8)
const encryptPwd = utils.encryptPwd('admin888', salt)
/*
{
  encrypt: '045c859a309a459a04c9de24b8b6b03295c3e46a',
  salt: 'zff6t'
}
*/
```

### validPassword

app.js
```js
import { validPassword } from 'kenote-node-utils'

const encryptPwd = {
  encrypt: '045c859a309a459a04c9de24b8b6b03295c3e46a',
  salt: 'zff6t'
}
const validPassword = validPassword('admin888', encryptPwd.salt, encryptPwd.encrypt) // true or false
```

### isAccess

app.js
```js
import { isAccess } from 'kenote-node-utils'

const access = ({ level }) => level >= 1000
const result = isAccess({ level: 9999 }, access) // true or false
```

### callback

app.js
```js
import { callback } from 'kenote-node-utils'

(async () => {
  const result = await new Promise((resolve, reject) => callback(resolve, reject, null, 1))
  console.log(result)
})()
```

### isNull

app.js
```js
import { isNull } from 'kenote-node-utils'

console.log(isNull(null))
```

### checkLength

app.js
```js
import { checkLength } from 'kenote-node-utils'

console.log(checkLength('你好123')) // 7
```

### isPattern

app.js
```js
import { isPattern } from 'kenote-node-utils'

const result1 = isPattern('123456', { pattern: /^[0-9]+$/, min: 4, max: 10 }) // true
const result2 = isPattern('123456', { pattern: '^[0-9]+$', min: 4, max: 10 }) // true
```

### validRule

app.js
```js
import { validRule } from 'kenote-node-utils'

const rules = [
  { required: true, message: 'Value cannot be empty.', code: 1001 },
  { pattern: /^[0-9]+$/, message: 'Wrong value format.', code: 1002 }
]
const result = utils.validRule('123456', rules) // null
const result = utils.validRule('', rules) // { message: 'Value cannot be empty.', code: 1001 }
const result = utils.validRule('abc', rules) // { message: 'Wrong value format.', code: 1002 }
```

### filterData

app.js
```js
import { filterData } from 'kenote-node-utils'

const rules = {
  username: [
    { required: true, message: 'Name cannot be empty.', code: 1001 },
    { pattern: /^[a-zA-Z]{1}[a-zA-Z0-9_]{3,11}$/, message: 'Wrong name format.', code: 1002 }
  ],
  email: [
    { required: true, message: 'Email cannot be empty.', code: 1003 },
    { pattern: /^[a-z_0-9.-]{1,64}@([a-z0-9-]{1,200}.){1,5}[a-z]{1,6}/, message: 'Wrong email format.', code: 1004 }
  ],
  phone: [
    { required: true, message: 'Phone cannot be empty.', code: 1005 },
    { pattern: /^0?(12[0-9]|13[0-9]|14[57]|15[012356789]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/, message: 'Wrong phone format.', code: 1006 }
  ],
  password: [
    { required: true, message: 'Password cannot be empty.', code: 1007 },
    { pattern: /^(?=.*[A-Za-z])[A-Za-z0-9$@$!%*#?&]{6,32}$/, message: 'Wrong password format.', code: 1008 }
  ],
}
const info = {
  username: 'thondery',
  email: 'thondery163.com',
  password: 'a123456'
}
const { username, email, phone, password } = info
const filters = [
  { key: 'username', rules: rules.username, value: username },
  { key: 'email', rules: rules.email, value: email, ignore: true },
  { key: 'phone', rules: rules.phone, value: phone, ignore: true },
  { key: 'password', rules: rules.password, value: password }
]
const options = {
  picks: [
    { 
      data: [ email, phone ],
      message: 'Email, phone number must be set one', 
      code: 1009
    }
  ]
}
filterData(filters, (data, message) => {
  if (message) {
    console.log(message)
    return
  }
  console.log(data)
}, options)
```

## License

this repo is released under the [MIT License](https://github.com/kenote/kenote-node-utils/blob/master/LICENSE).