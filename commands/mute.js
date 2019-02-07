const fs = module.require("fs");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  timedelemsg = 2000;

  message.delete(3000);

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("ليسة لديك صلاحية").then(d_msg => {d_msg.delete(timedelemsg);});

  let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
  if(!toMute) return message.channel.send("You did put user name").then(d_msg => {d_msg.delete(timedelemsg);});

  if(toMute.id === message.author.id) return message.channel.send("you cannot mute yourself.").then(d_msg => {d_msg.delete(timedelemsg);});
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("ليسة لديك صلاحية").then(d_msg => {d_msg.delete(timedelemsg);});

  let role = message.guild.roles.find(r => r.name === "muted");
  if(!role) {
    try {
      role = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions: []
      });
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(role, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch(e) {
      console.log(e.stack);
    }
   }

   if(toMute.roles.has(role.id)) return message.channel.send("This user is already muted").then(d_msg => {d_msg.delete(timedelemsg);});

   bot.mutes[toMute.id] = {
    guild: message.guild.id,
     time: Date.now() + parseInt(args[1]) * 1000 * 60
   }

   await toMute.addRole(role);
   
   fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4),err => {
     if(err) throw err;
     message.channel.send(`[${args[1]}]المدة ${message.member.user.tag} - تم اعطاء ميوت`).then(d_msg => {d_msg.delete(timedelemsg);})
     let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
     let reportEmbed = new Discord.RichEmbed()
     .addField("Muted User", `${rUser} with ID: ${rUser.id}`)
     .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
     .addField("المدة", `[ ${args[1]} ]`)
     .addField("Channel", message.channel)
     .addField("الوقت", message.createdAt);
     //.addField("Reason", rreason);
 
     let reportschannel = message.guild.channels.find(`name`, "reports");
     if(!reportschannel) return message.channel.send("Couldn't find reports channel.");

     reportschannel.send(reportEmbed);
   });
//${args[1]}
   await toMute.addRole(role);
}


module.exports.help = {
  name: "ميوت"
}