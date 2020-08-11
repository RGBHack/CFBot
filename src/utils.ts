import * as discord from 'discord.js'
import * as codeforces from 'codeforces-api'

import { warn } from './logger'

export const failEmbed = (type, message): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#ff0000')
    .addFields({ name: type, value: message })
}

export const successEmbed = (type, message): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#00ff00')
    .addFields({ name: type, value: message })
}

export const warnEmbed = (type, message): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#FFFF00')
    .addFields({ name: type, value: message })
}

export const ratingFailEmbed = (type, message): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#ff0000')
    .addFields({ name: type, value: message })
}
