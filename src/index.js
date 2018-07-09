import path from 'path'
import fs from 'fs-extra'
import isJson from 'is-json'
import ini from 'ini'

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