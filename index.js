const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json");

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  //bot.user.setActivity("lockeer", {type: "WATCHING"});

        bot.setInterval(() => {
          for(let i in bot.mutes) {
            let time = bot.mutes[i].time;
            let guildId = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildId);
            let member = guild.members.get(i);
            let mutedRole = guild.roles.find(r => r.name === "muted")
            if(!mutedRole) continue;

            if(Date.now() > time) {
              console.log(`${i} is unmuted`)
              member.removeRole(mutedRole)
              //message.channel.reply("unmuted")
              delete bot.mutes[i];

              fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
                if(err) throw err;
                console.log(`i have unmuted ${member.user.tag}.`)
                //message.channel.send(`<@${i}> تم ازالة الميوت!`).then(d_msg => {d_msg.delete(timedelemsg);});
              });
            }
          }
        }, 5000)

});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));

  if(!cmd.startsWith(prefix)) return;
  if(commandfile) commandfile.run(bot,message,args);

});


bot.login(process.env.BOT_TOKEN);
