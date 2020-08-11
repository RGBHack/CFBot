import * as discord from 'discord.js'
import * as codeforces from 'codeforces-api'

import { TOKEN, CODEFORCES_API, CODEFORCES_SECRET } from './config'
import { success, fail } from './logger'
import { helpEmbed } from './info'
import { getRating, getContest } from './functions'

const bot = new discord.Client()

codeforces.setApis(CODEFORCES_API, CODEFORCES_SECRET)
bot.login(TOKEN).catch((err) => fail(`Failed to log in with bot token. ${err}`))

bot.on('ready', () => {
  success('Bot is ready!')
  bot.user.setActivity('.cf help')
})

bot.on('message', (msg) => {
  const command = msg.content.split(' ').slice(0, 2)
  const channel = msg.channel as discord.TextChannel

  if (command[0] === '.cf') {
    switch (command[1]) {
      case 'rating':
        getRating(msg, channel)
        break
      case 'contest':
        getContest(msg, channel)
        break
      default:
        channel.send(helpEmbed)
        break
    }
  }
})
