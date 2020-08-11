import * as discord from 'discord.js'

export const helpEmbed = new discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('CFBot Help')
  .setAuthor(
    'CFBot Help',
    'https://i.imgur.com/wSTFkRM.png',
    'https://discord.js.org'
  )
  .setDescription('CodeForces Bot to Compete against Friends')
  .setThumbnail('https://i.imgur.com/wSTFkRM.png')
  .addFields(
    { name: '\u200B', value: '\u200B' },
    { name: '.cf rating {user}', value: 'Gets codeforces rating for user' },
    { name: '.cf problem', value: 'Some value here' }
  )
  .setImage('')
  .setTimestamp()
  .setFooter('Generated At', 'https://i.imgur.com/wSTFkRM.png')
