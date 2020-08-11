import * as discord from 'discord.js'

export const failEmbed = (
  type: string,
  message: string
): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#ff0000')
    .addFields({ name: type, value: message })
}

export const successEmbed = (
  type: string,
  message: string
): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#00ff00')
    .addFields({ name: type, value: message })
}

export const warnEmbed = (
  type: string,
  message: string
): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#FFFF00')
    .addFields({ name: type, value: message })
}

export const ratingFailEmbed = (
  type: string,
  message: string
): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#ff0000')
    .addFields({ name: type, value: message })
}
