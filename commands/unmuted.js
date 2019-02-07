const fs = require("fs");
const Discord = require("discord.js");
//const botconfig = require("./botconfig.json");

module.exports.run =  async (bot, message, args) => {
  timedelemsg = 10000;

  message.delete(3000);
  //if(!botconfig.prefix) return message.channel.send("gg");

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have manage msg").then(d_msg => {d_msg.delete(timedelemsg);});
  let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
  if(!toMute) return message.channel.send("You did put user name").then(d_msg => {d_msg.delete(timedelemsg);});

  let role = message.guild.roles.find(r => r.name === 'muted');

  if(!role || !toMute.roles.has(role.id)) return message.channel.send("This user is no't muted");

  await toMute.removeRole(role);

  delete bot.mutes[toMute]


  fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
    if(err) throw err;
    console.log(`i have unmuted ${toMute.user.tag}.`)
    message.channel.send(`${toMute.user.tag} تم ازالة ميوت عن`).then(d_msg => {d_msg.delete(timedelemsg);});
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let reportEmbed = new Discord.RichEmbed()
    .addField("unMuted User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt);
    //.addField("Reason", rreason);

    let reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("Couldn't find reports channel.");

    reportschannel.send(reportEmbed);
  });
}
 module.exports.help = {
    name: "unmute"
}