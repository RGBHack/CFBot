import * as codeforces from 'codeforces-api'
import * as discord from 'discord.js'
import * as QuickChart from 'quickchart-js'
import { dbModel, dbDoc } from './models'

import { failEmbed, warnEmbed, successEmbed } from './utils'
import { success, info, warn, fail } from './logger'

interface problemArray {
  str: string
  contestId: number
  index: string
  points: number
}

let problems: dbDoc

dbModel
  .find()
  .then((data) => {
    problems = data[0]
    success(`Got problems from database!`)
  })
  .catch((err) => fail(`Failed to get problems from database. Error: ${err}`))

export const getProfile = (
  msg: discord.Message,
  channel: discord.TextChannel
): void => {
  const user = extractArg(msg)
  info(`Getting CodeForces profile for user ${user}`)
  codeforces.user.info({ handles: user }, function (err, data) {
    if (err) {
      warn(`Error getting profile for ${user}`)
      channel.send(
        failEmbed(`.cf profile {user}`, `Error getting profile for ${user}`)
      )
      return
    }
    if (data[0].rating === undefined) {
      data[0].rating = 0
    }
    if (data[0].rank === undefined) {
      data[0].rank = 'newbie'
    }
    channel.send(
      successEmbed(
        user,
        `Profile: [${user}](https://codeforces.com/profile/${user})\nRating: ${data[0].rating}\nRank: ${data[0].rank}`
      ).setThumbnail(`https:${data[0].avatar}`)
    )
  })
}

export const getGraph = (
  msg: discord.Message,
  channel: discord.TextChannel
): void => {
  const user = extractArg(msg)
  info(`Getting CodeForces graph for user ${user}`)

  codeforces.user.rating({ handle: user }, async (err, data) => {
    if (err) {
      warn(`Failed to get CodeForces profile for user ${user}`)
      channel.send(failEmbed(`.cf graph {user}`, `Bad username: ${user}`))
    } else if (data.length === 0) {
      warn(`User ${user} does not have any contests`)
      channel.send(warnEmbed(user, `User ${user} does not have any contests`))
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

      let maxRating = 0
      data.forEach((d) => {
        const date = new Date(d.ratingUpdateTimeSeconds * 1000)
        const rating = d.newRating

        config.data.labels.push(date)
        config.data.datasets[0].data.push(rating)

        if (rating > maxRating) {
          maxRating = rating
        }
      })

      chart
        .setConfig(config)
        .setWidth('450px')
        .setHeight('340px')
        .setBackgroundColor('#fff')

      const image = await chart.getShortUrl()

      channel.send(
        successEmbed(user, `Max Rating: ${maxRating}`).setImage(image)
      )
    }
  })
}

export const getContest = (
  msg: discord.Message,
  channel: discord.TextChannel
): void => {
  const contest = extractArg(msg)
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
      channel.send(successEmbed(main, toSend))
    }
  })
}

const extractArg = (msg: discord.Message) => {
  return msg.content.split(' ')[2]
}

export const startMatch = (
  msg: discord.Message,
  channel: discord.TextChannel
): void => {
  if (problems === undefined) {
    return
  }

  if (msg.content.split(' ').length < 4) {
    // adjust this for message
    channel.send(failEmbed(`.cf match {div} [users]`, `Invalid match command!`))
    return
  }

  const div = msg.content.split(' ')[2]
  // parse time in message
  const users = msg.content.slice(3, msg.content.split.length)

  let toSend: problemArray[]
  switch (div) {
    case '1':
      toSend = getDiv1()
      break
    case '2':
      toSend = getDiv2()
      break
    case '3':
      toSend = getDiv3()
      break
    default:
      channel.send(failEmbed(`.cf match {div} [users]`, 'Invalid division'))
      return
  }

  let toSendStr = ''
  toSend.forEach((element) => {
    toSendStr += element.str + '\n'
  })
  channel.send(successEmbed(`.cf match {div} [users]`, toSendStr))
  setTimeout(() => {
    //check the score
  }, 1000)
}

const getDiv1 = (): problemArray[] => {
  const div1Ratings = ['1600', '2000', '2400', '2800', '3200']
  const toSend: problemArray[] = []

  let points = 100
  div1Ratings.forEach((el) => {
    const random_index = Math.floor(Math.random() * problems[el].length)
    const problem = JSON.parse(JSON.stringify(problems[el][random_index]))
    toSend.push({
      str: `${points}: [${problem['name']}](<https://codeforces.com/contest/${problem['contestId']}/problem/${problem['index']}>) [${problem['rating']}]`,
      contestId: problem['contestId'] as number,
      index: problem['index'] as string,
      points: points,
    })
    points += 100
  })
  return toSend
}

const getDiv2 = (): problemArray[] => {
  const div2Ratings = ['800', '800', '1600', '2000', '2400']
  const toSend: problemArray[] = []

  let points = 100
  div2Ratings.forEach((el) => {
    const random_index = Math.floor(Math.random() * problems[el].length)
    const problem = JSON.parse(JSON.stringify(problems[el][random_index]))
    toSend.push({
      str: `${points}: [${problem['name']}](<https://codeforces.com/contest/${problem['contestId']}/problem/${problem['index']}>) [${problem['rating']}]`,
      contestId: problem['contestId'] as number,
      index: problem['index'] as string,
      points: points,
    })
    points += 100
  })
  return toSend
}
const getDiv3 = (): problemArray[] => {
  const div3Ratings = ['800', '800', '1200', '1200', '1600']
  const toSend: problemArray[] = []

  let points = 100
  div3Ratings.forEach((el) => {
    const random_index = Math.floor(Math.random() * problems[el].length)
    const problem = JSON.parse(JSON.stringify(problems[el][random_index]))
    toSend.push({
      str: `${points}: [${problem['name']}](<https://codeforces.com/contest/${problem['contestId']}/problem/${problem['index']}>) [${problem['rating']}]`,
      contestId: problem['contestId'] as number,
      index: problem['index'] as string,
      points: points,
    })
    points += 100
  })
  return toSend
}
