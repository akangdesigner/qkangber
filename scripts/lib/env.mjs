// 讀 .env.local 成 { KEY: value } 物件（原本 60+ 支腳本各自複製這段手刻 parser）。
import fs from 'node:fs'

export function loadEnv(path = '.env.local') {
  const env = {}
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue
    const i = line.indexOf('=')
    if (i === -1) continue
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return env
}
