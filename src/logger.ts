import * as chalk from 'chalk'
const log = console.log

export const success = (message: string): void => {
  log(chalk.green('[+] ' + message))
}

export const warn = (message: string): void => {
  log(chalk.yellow('[!] ' + message))
}

export const info = (message: string): void => {
  log(chalk.blue('[*] ' + message))
}

export const fail = (message: string): void => {
  log(chalk.red('[-] ' + message))
  process.exit(1)
}
