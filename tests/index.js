import test from 'ava'
import * as utils from '../build'

test('loadConfig -> File not found', t => {
  const config = utils.loadConfig('')
  t.pass()
})

test('loadConfig -> load File config.ini', t => {
  const config = utils.loadConfig('tests/config.ini')
  t.pass()
})