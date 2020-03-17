const Discord = require("discord.js");
const botconfig = require("../../util/config.json");
const errorX = botconfig.errorX;

module.exports.run = async (bot, message, args, prefix) => {

  function generateHex() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  let guild = message.guild;
  let roleProf = guild.roles.cache.find(role => role.id === "687757475365126154");
  //if(roleProf == undefined) return;
  //if((!message.member.roles.cache.has(roleProf.id)) || (!message.member.hasPermission("MANAGE_MESSAGES"))) return message.channel.send(`${errorX} Vous n'avez pas la permission d'utiliser \`poll\` !`);
  if(!args[0]) return message.channel.send(`${errorX} Vous devez ajouter une question !`);
  let pollEmbed = new Discord.MessageEmbed()
  .setAuthor(message.member.nickname, message.author.avatarURL({dynamic: true}))
  .setDescription(message.content.slice(prefix.length + 5))
  .setColor(generateHex())
  .setFooter("Répondez en cliquant sur les réactions ci-dessous")
  message.channel.send({embed : pollEmbed}).then(m => {
    m.react("613040238461190186");
    m.react("622794615069736980");
  });
}

module.exports.conf = {
  name: "poll",
  aliases: ["sondage"]
}