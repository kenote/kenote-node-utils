import test from 'ava'
import * as utils from '../lib'

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
  website: [
    { pattern: '^(https?:\/\/)', message: 'Wrong websit format for %s.', code: 1009 }
  ]
}

test('loadConfig -> File not found', t => {
  const config = utils.loadConfig('')
  t.pass()
})

test('loadConfig -> load File config.ini', t => {
  const config = utils.loadConfig('tests/config.ini')
  t.pass()
})

test('loadConfig -> load File config.json', t => {
  const config = utils.loadConfig('tests/config.json')
  t.pass()
})

test('getMongooseOptions -> version < 5', t => {
  const options = utils.getMongooseOptions('4.2.2')
  t.pass()
})

test('getMongooseOptions -> version >= 5', t => {
  const options = utils.getMongooseOptions('5.2.2')
  t.pass()
})

test('md5', t => {
  const md5String = utils.md5('123456')
  t.pass()
})

test('sha1', t => {
  const sha1String = utils.sha1('123456')
  t.pass()
})

test('encryptPwd', t => {
  const salt = Math.random().toString(36).substr(8)
  const encryptPwd = utils.encryptPwd('admin888', salt)
  t.pass()
})

test('validPassword', t => {
  const salt = Math.random().toString(36).substr(8)
  const encryptPwd = utils.encryptPwd('admin888', salt)
  const validPassword = utils.validPassword('admin888', encryptPwd.salt, encryptPwd.encrypt)
  t.true(validPassword)
})

test('isAccess', t => {
  const access = ({ level }) => level >= 1000
  const result = utils.isAccess({ level: 9999 }, access)
  t.true(result)
})

test('callback', async t => {
  const result = await new Promise((resolve, reject) => utils.callback(resolve, reject, null, 1))
  t.is(result, 1)
})

test('isNull -> undefined', t => {
  const result = utils.isNull(undefined)
  t.true(result)
})

test('isNull -> null', t => {
  const result = utils.isNull(null)
  t.true(result)
})

test('isNull -> Number 0', t => {
  const result = utils.isNull(0)
  t.false(result)
})

test('isNull -> test', t => {
  const result = utils.isNull('test')
  t.false(result)
})

test('isNull -> Array []', t => {
  const result = utils.isNull([])
  t.true(result)
})

test('checkLength', t => {
  const result = utils.checkLength('你好123')
  t.is(result, 7)
})

test('isPattern -> RegExp', t => {
  const result = utils.isPattern('123456', { pattern: /^[0-9]+$/, min: 4, max: 10 })
  t.true(result)
})

test('isPattern -> pattern', t => {
  const result = utils.isPattern('123456', { pattern: '^[0-9]+$', min: 4, max: 10 })
  t.true(result)
})

test('validRule -> ok', t => {
  const rules = [
    { required: true, message: 'Value cannot be empty.', code: 1001 },
    { pattern: /^[0-9]+$/, message: 'Wrong value format.', code: 1002 }
  ]
  const result = utils.validRule('123456', rules)
  t.is(result, null)
})

test('validRule -> required', t => {
  const rules = [
    { required: true, message: 'Value cannot be empty.', code: 1001 },
    { pattern: /^[0-9]+$/, message: 'Wrong value format.', code: 1002 }
  ]
  const result = utils.validRule('', rules)
  t.deepEqual(result, { message: 'Value cannot be empty.', code: 1001 })
})

test('validRule -> pattern', t => {
  const rules = [
    { required: true, message: 'Value cannot be empty.', code: 1001 },
    { pattern: /^[0-9]+$/, message: 'Wrong value format.', code: 1002 }
  ]
  const result = utils.validRule('abc', rules)
  t.deepEqual(result, { message: 'Wrong value format.', code: 1002 })
})

test('filterData -> ok', t => {
  let info = {
    username: 'thondery',
    email: 'thondery@163.com',
    password: 'a123456',
    repository: {
      github: 'https://github.com/thondery',
      gitee: 'https://gitee.com/thondery'
    }
  }
  let { username, email, phone, password, repository } = info
  let filters = [
    { key: 'username', rules: rules.username, value: username },
    { key: 'email', rules: rules.email, value: email, ignore: true },
    { key: 'phone', rules: rules.phone, value: phone, ignore: true },
    { key: 'password', rules: rules.password, value: password },
    { key: 'repository', rules: rules.website, value: repository, label: `%s地址` }
  ]
  let options = {
    picks: [
      { 
        data: [ email, phone ],
        message: 'Email, phone number must be set one', 
        code: 1009
      }
    ]
  }
  utils.filterData(filters, (data, message) => {
    if (message) {
      t.pass()
    }
    t.deepEqual(info, data)
  }, options)
})

test('filterData -> error', t => {
  let info = {
    username: 'thondery',
    email: 'thondery163.com',
    password: 'a123456'
  }
  let { username, email, phone, password } = info
  let filters = [
    { key: 'username', rules: rules.username, value: username },
    { key: 'email', rules: rules.email, value: email, ignore: true },
    { key: 'phone', rules: rules.phone, value: phone, ignore: true },
    { key: 'password', rules: rules.password, value: password }
  ]
  let options = {
    picks: [
      { 
        data: [ email, phone ],
        message: 'Email, phone number must be set one', 
        code: 1009
      }
    ]
  }
  utils.filterData(filters, (data, message) => {
    if (message) {
      t.deepEqual(message, { message: 'Wrong email format.', code: 1004 })
    }
    t.pass
  }, options)
})