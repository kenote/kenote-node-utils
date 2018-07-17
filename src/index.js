import path from 'path'
import fs from 'fs-extra'
import isJson from 'is-json'
import ini from 'ini'
import crypto from 'crypto'

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