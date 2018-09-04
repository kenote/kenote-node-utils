import path from 'path'
import fs from 'fs-extra'
import isJson from 'is-json'
import ini from 'ini'
import crypto from 'crypto'
import { isRegExp, isUndefined, format } from 'util'
import _ from 'lodash'

export const loadConfig = filePath => {
  let configInfo = {}
  let configFile = path.resolve(process.cwd(), filePath)
  try {
    let configStr = fs.readFileSync(configFile, 'utf-8')
    if (isJson(configStr)) {
      configInfo = JSON.parse(configStr)
    }
    else {
      configInfo = ini.parse(configStr)
    }
  } catch (error) {
    
  }
  return configInfo
}

export const getMongooseOptions = version => {
  let mongooseVersion = Number(version.match(/(\d+)(\.)(\d+)/)[0])
  let options = {
    ... mongooseVersion < 5 ? { useMongoClient: true } : { useNewUrlParser: true }
  }
  return options
}

export const md5 = text => crypto.createHash('md5').update(text).digest('hex')
export const sha1 = text => crypto.createHash('sha1').update(text).digest('hex')

const getEncryptPwd = (pwd, salt) => sha1(`${md5(pwd)}^${salt}`)

export const encryptPwd = (str, salt) => {
  let encrypt = getEncryptPwd(str, salt)
  return { salt, encrypt }
}

export const validPassword = (pwd, salt, encrypt) => encrypt === getEncryptPwd(pwd, salt)

export const callback = (resolve, reject, err, doc = null) => {
  if (err) {
    reject(err)
  }
  else {
    resolve(doc)
  }
}

export const isAccess = (auth, access = null) => {
  if (!access) return true
  let result = true
  if (access) {
    result = access(auth)
  }
  return result
}

export const isNull = value => String(value || '').length === 0 && value !== 0

export const checkLength = (str) => {
  let size = 0
  if (isNull(str)) return size
  let arr = str.split('')
  for (let word of arr) {
    size++
    (/[^\x00-\xff]/g.test(word)) && size++
  }
  return size
}

export const isPattern = (value, rule) => {
  let regExp = isRegExp(rule.pattern) ? rule.pattern : new RegExp(rule.pattern)
  let valid = regExp.test(value)
  if (valid) {
    let size = checkLength(value)
    if (rule.min && size < rule.min) {
      valid = false
    }
    if (rule.max && size > rule.max) {
      valid = false
    }
  }
  return valid
}

const validMessage = (rule, message = '') => (
  {
    message,
    ..._.pick(rule, ['message', 'code'])
  }
)

export const validRule = (value, rules = []) => {
  for (let rule of rules) {
    if (rule.required && isNull(value)) {
      return validMessage(rule, 'Value cannot be empty.')
    }
    if (rule.pattern && !isPattern(value, rule)) {
      return validMessage(rule, 'Wrong value format.')
    }
  }
  return null
}

const chooseOne = (data) => {
  let result = true
  for (let item of data) {
    result = isUndefined(item)
    if (!result) break
  }
  return result
}

export const filterData = (filters, done, options = {}) => {
  let info = {}
  for (let item of filters) {
    if (item.ignore && isUndefined(item.value)) continue
    info[item.key] = item.value
    if (_.isObject(item.value)) {
      for (let key in item.value) {
        let itemValid = validRule(item.value[key], item.rules)
        if (itemValid) {
          if (itemValid.message) {
            itemValid = { ...itemValid, message: format(itemValid.message, format(item.label, key)) }
          }
          return done(null, itemValid)
        }
      }
    }
    else {
      let itemValid = validRule(item.value, item.rules)
      if (itemValid) {
        return done(null, itemValid)
      }
    }
  }
  if (options.picks) {
    for (let item of options.picks) {
      let pick = chooseOne(item.data)
      if (pick) {
        return done(null, validMessage(item))
      }
    }
  }
  return done(info)
}