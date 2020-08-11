import * as codeforces from 'codeforces-api'
import * as discord from 'discord.js'
import * as QuickChart from 'quickchart-js'

import {
  failEmbed,
  successEmbed,
  ratingSuccessEmbed,
  contestEmbed,
} from './utils'
import { success, info, warn } from './logger'

export const getRating = (
  msg: discord.Message,
  channel: discord.TextChannel
): void => {
  const user = msg.content.substr(11, msg.content.length)
  info(`Getting CodeForces rating for user ${user}`)
  ratingSuccessEmbed(user, channel)
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
  codeforces.contest.standings(
    { contestId: parseInt(msg.content.substr(12, msg.content.length)) },
    (err, res) => {
      if (err) {
        warn(`Invalid contest ID: ${err}`)
        channel.send(
          `Invalid contest ID: ${msg.content.substr(12, msg.content.length)}`
        )
      } else {
        const contest = msg.content.substr(12, msg.content.length)
        channel.send(`Fetching info for contest #${contest}`)
        success(`Contest #${contest} successfully queried`)
        let toSend = `There are ${res.problems.length} problems in contest #${contest}:\n`
        res.problems.forEach((problem) => {
          if (problem.points === undefined) {
            toSend += ` ${problem.index}: ${problem.name} (<https://codeforces.com/contest/${contest}/problem/${problem.index}>)\n`
          } else {
            toSend += ` ${problem.index}: ${problem.name} - ${problem.points} points (<https://codeforces.com/contest/${contest}/problem/${problem.index}>)\n`
          }
        })
        channel.send(toSend)
        //contestEmbed()
      }
    }
  )
}
