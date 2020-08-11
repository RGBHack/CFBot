import * as discord from 'discord.js'
import * as codeforces from 'codeforces-api'

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

export const ratingFailEmbed = (type, message): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#ff0000')
    .addFields({ name: type, value: message })
}

export const ratingSuccessEmbed = (
  user: string,
  channel: discord.TextChannel
): void => {
  codeforces.user.info({ handle: user }, function (err, data) {
    if (err) {
      //send error embed
      console.log(err)
    } else {
      channel.send(
        new discord.MessageEmbed()
          .setColor('#00ff00')
          .setThumbnail(data.avatar)
          .addFields({ name: user, value: `Rating is ${data.rating}` })
      )
    }
  })
}

export const contestEmbed = (type, message): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#ff0000')
    .addFields({ name: type, value: message })
}
