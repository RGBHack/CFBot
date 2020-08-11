import * as discord from 'discord.js'

export const helpEmbed = new discord.MessageEmbed()
  .setColor('#00ff00')
  .setTitle('CFBot Help')
  .setAuthor('CFBot Help', 'https://i.ibb.co/K74FPGv/imgur.png')
  .setDescription('CodeForces Bot to Compete against Friends')
  .setThumbnail('https://i.ibb.co/K74FPGv/imgur.png')
  .addFields(
    { name: '\u200B', value: '\u200B' },
    { name: '.cf profile {user}', value: 'Gets CodeForces rating for user' },
    {
      name: '.cf contest {contest id}',
      value: 'Shows Problems for Contest Id',
    },
    { name: '.cf graph {user}', value: 'Shows CodeForces Rating Graph of User' }
  )
  .setImage('')
  .setTimestamp()
  .setFooter('Generated At', 'https://i.ibb.co/K74FPGv/imgur.png')
