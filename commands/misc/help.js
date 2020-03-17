const Discord = require("discord.js");
const botconfig = require("../../util/config.json");
const bleuFonce = botconfig.bleuFonce;

module.exports.run = async (bot, message, args, prefix) => {

    let dembed = new Discord.MessageEmbed()
    .setDescription(`📬 Je vous ai envoyé de l'aide en message privée <@${message.author.id}> !`)
    .setColor(bleuFonce);
    message.channel.send({embed: dembed});

    return message.author.send(`\`\`\`Misc :\n\n${prefix}poll <question> :: créer un sondage\n${prefix}stats :: voir les statistiques du bot\`\`\``);
}

module.exports.conf = {
    name: "help",
    aliases: ["101", "?"]
}
