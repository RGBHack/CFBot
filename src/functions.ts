import * as codeforces from 'codeforces-api'
import * as discord from 'discord.js'
import * as QuickChart from 'quickchart-js'

import { failEmbed, warnEmbed } from './utils'
import { success, info, warn } from './logger'

export const getRating = (
  msg: discord.Message,
  channel: discord.TextChannel
): void => {
  const user = msg.content.split(' ')[2]
  info(`Getting CodeForces rating for user ${user}`)
  ratingEmbed(user, channel)
}

export const getGraph = (
  msg: discord.Message,
  channel: discord.TextChannel
): void => {
  const user = msg.content.split(' ')[2]
  info(`Getting CodeForces graph for user ${user}`)

  codeforces.user.rating({ handle: user }, async (err, data) => {
    if (err) {
      warn(`Failed to get CodeForces rating for user ${user}`)
      channel.send(`Bad Username`)
    } else if (data.length == 0) {
      warn(`User ${user} does not have any contests`)
      channel.send(`User ${user} does not have any contests`)
    } else {
      const chart = new QuickChart()
      const rand = Math.round(Math.random())

      const config = {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: user,
              backgroundColor: rand
                ? ['rgba(54, 162, 235, 0.5)']
                : ['rgba(255, 99, 132, 0.5)'],
              borderColor: rand
                ? ['rgba(54, 162, 235, 1.0)']
                : ['rgba(255, 99, 132, 1.0)'],
              data: [],
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          elements: {
            point: {
              radius: 0,
            },
          },
          layout: {
            padding: {
              left: 30,
              right: 30,
              top: 30,
              bottom: 30,
            },
          },
          scales: {
            xAxes: [
              {
                display: false,
              },
            ],
          },
        },
      }

      data.forEach((d) => {
        const date = new Date(d.ratingUpdateTimeSeconds * 1000)
        const rating = d.newRating

        config.data.labels.push(date)
        config.data.datasets[0].data.push(rating)
      })

      chart
        .setConfig(config)
        .setWidth('450px')
        .setHeight('340px')
        .setBackgroundColor('#fff')

      channel.send(await chart.getShortUrl())
    }
  })
}

export const getContest = (
  msg: discord.Message,
  channel: discord.TextChannel
): void => {
  const contest = msg.content.split(' ')[2]
  codeforces.contest.standings({ contestId: parseInt(contest) }, (err, res) => {
    if (err) {
      warn(`Invalid contest ID: ${err}`)
      channel.send(
        failEmbed(`.cf contest {contest}`, `Invalid contest ID: ${contest}`)
      )
    } else {
      success(`Contest #${contest} successfully queried`)
      const main = `There are ${res.problems.length} problems in contest #${contest}:\n`
      let toSend = ''
      res.problems.forEach((problem) => {
        if (problem.points === undefined) {
          toSend += ` ${problem.index}: [${problem.name}](<https://codeforces.com/contest/${contest}/problem/${problem.index}>)\n`
        } else {
          toSend += ` ${problem.index} (${problem.points}): [${problem.name}](<https://codeforces.com/contest/${contest}/problem/${problem.index}>)\n`
        }
      })
      channel.send(contestEmbed(main, toSend))
    }
  })
}

export const ratingEmbed = (
  user: string,
  channel: discord.TextChannel
): void => {
  codeforces.user.info({ handles: user }, function (err, data) {
    if (err) {
      warn(`Error getting rating for ${user}`)
      channel.send(
        failEmbed(`.cf rating {user}`, `Error getting rating for ${user}`)
      )
    } else if (data[0].rating === undefined) {
      warn(`User ${user} does not have a rating`)
      channel.send(
        new discord.MessageEmbed()
          .setColor('#ffff00')
          .setThumbnail(`https:${data[0].avatar}`)
          .addFields({
            name: user,
            value: `User ${user} does not have a rating`,
          })
      )
    } else {
      warn(data[0].avatar)
      channel.send(
        new discord.MessageEmbed()
          .setColor('#00ff00')
          .setThumbnail(`https:${data[0].avatar}`)
          .addFields({ name: user, value: `Rating is ${data[0].rating}` })
      )
    }
  })
}

export const contestEmbed = (
  type: string,
  message: string
): discord.MessageEmbed => {
  return new discord.MessageEmbed()
    .setColor('#00ff00')
    .addFields({ name: type, value: message })
}
