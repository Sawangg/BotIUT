const Discord = require("discord.js");
const { bleuFonce } = require("../../util/config.json");

module.exports.run = async (_bot, message) => {

    const dembed = new Discord.MessageEmbed()
    .setDescription(`📬 Je vous ai envoyé de l'aide en message privée <@${message.author.id}> !`)
    .setColor(bleuFonce);
    message.channel.send({ embed: dembed });

    return message.author.send("```Misc :\n\n!poll <question> :: créer un sondage\n!stats :: voir les statistiques du bot```");
};

module.exports.conf = {
    name: "help",
    aliases: ["101", "?"],
};