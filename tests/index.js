import test from 'ava'
import * as utils from '../lib'

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