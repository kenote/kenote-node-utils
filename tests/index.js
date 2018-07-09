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

test('getMongooseOptions -> version < 5', t => {
  const options = utils.getMongooseOptions('4.2.2')
  t.pass()
})

test('getMongooseOptions -> version >= 5', t => {
  const options = utils.getMongooseOptions('5.2.2')
  t.pass()
})