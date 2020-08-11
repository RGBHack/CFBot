import * as discord from "discord.js";
import { config } from "dotenv";
import * as codeforces from "codeforces-api";

config();
const bot = new discord.Client();
const TOKEN = process.env.TOKEN;
const CODEFORCES_API = process.env.CODEFORCES_API;
const CODEFORCES_SECRET = process.env.CODEFORCES_SECRET;
codeforces.setApis(CODEFORCES_API, CODEFORCES_SECRET);
bot.login(TOKEN);

bot.on("ready", () => {
  console.log(`ready`);
  bot.user.setActivity(`.cf help`);
});

const helpEmbed = new discord.MessageEmbed()
  .setColor("#0099ff")
  .setTitle("CFBot Help")
  .setAuthor(
    "CFBot Help",
    "https://i.imgur.com/wSTFkRM.png",
    "https://discord.js.org"
  )
  .setDescription("CodeForces Bot to Compete against Friends")
  .setThumbnail("https://i.imgur.com/wSTFkRM.png")
  .addFields(
    { name: "\u200B", value: "\u200B" },
    { name: ".cf rating {user}", value: "Gets codeforces rating for user" },
    { name: ".cf problem", value: "Some value here" }
  )
  .setImage("")
  .setTimestamp()
  .setFooter("Generated At", "https://i.imgur.com/wSTFkRM.png");

const infoEmbed = new discord.MessageEmbed()
  .setColor("#0099ff")
  .setTitle("Contest Info")
  .setAuthor("CP Peeps")
  .setDescription("CodeForces Bot to Compete against Friends");

bot.on("message", (msg) => {
  // get prefix
  const channel = msg.channel as discord.TextChannel;
  if (msg.content.startsWith(".cf rating ")) {
    const user = msg.content.substr(11, msg.content.length);
    console.log(user);
    codeforces.user.rating({ handle: user }, function (err, data) {
      // error handle if bad username
      if (err) {
        channel.send(`Bad Username`);
      }

      // send user contest rating
      else if (data.length > 0) {
        channel.send(`${user}'s rating is ${data[data.length - 1].newRating}`);
      }

      // if they did no competitions
      else {
        channel.send(`${user}'s rating is 0`);
      }
    });
  }

  // get contestID and return standings, problems, etc.
  else if (msg.content.startsWith(".cf contest ")) {
    // channel.send(`You asked about the contest #${msg.content.substr(12, msg.content.length)}`)
    codeforces.contest.standings(
      { contestId: parseInt(msg.content.substr(12, msg.content.length)) },
      (err, data) => {
        if (err) {
          console.log(err);
          channel.send("bad contest id");
          return;
        }
        var send_str = "";
        send_str += `There are ${
          data.problems.length
        } Problems in contest #${msg.content.substr(
          12,
          msg.content.length
        )}:\n`;
        data.problems.forEach((problem) => {
          send_str += problem.name + "\n";
        });
        channel.send(send_str);
      }
    );
  } else if (msg.content.startsWith(".cf help")) {
    channel.send(helpEmbed);
  }
});
