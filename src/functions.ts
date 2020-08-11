import * as codeforces from 'codeforces-api'
import * as discord from 'discord.js'

import { success, info, warn } from './logger'

export const getRating = (
  msg: discord.Message,
  channel: discord.TextChannel
): void => {
  const user = msg.content.substr(11, msg.content.length)
  info(`Getting CodeForces rating for user ${user}`)

  codeforces.user.rating({ handle: user }, (err, data) => {
    if (err) {
      warn(`Failed to get CodeForces rating for user ${user}`)
      channel.send(`Bad Username`)
    } else if (data.length > 0) {
      success(`Successfully got CodeForces rating for user ${user}`)
      channel.send(`${user}'s rating is ${data[data.length - 1].newRating}`)
    } else {
      info(`CodeForces user ${user} has a rating of 0`)
      channel.send(`${user}'s rating is 0`)
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
        success(`Contest #${contest} successfully queried`)
        let toSend = `There are ${res.problems.length} problems in contest #${contest}:\n`
        res.problems.forEach((problem) => {
          toSend += ` - ${problem.name}: ${problem.points} points\n`
        })

        channel.send(toSend)
      }
    }
  )
}
