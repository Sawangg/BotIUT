const Discord = require("discord.js");
const botconfig = require("../../util/config.json");
const moment = require("moment");
const bleuFonce = botconfig.bleuFonce;
const version = botconfig.version;

const filter = (newMsg, originalMsg) => {
    const isSameAuthor = newMsg.author.id === originalMsg.author.id;
};

module.exports.run = async (bot, message, args) => {

    if(args[1]) {
        console.log("Trop d'argument");
    } else {
        try {
            const fetchedMessage = await message.channel.messages.fetch(args);
            if(fetchedMessage) {
                const collector = new Discord.MessageCollector(message.channel, filter.bind(null, message));
                collector.on("collect", msg => {
                    console.log(`${msg.content} collected`);
                });
            }
        } catch(err) {
            console.log(err);
        }
    }

    // let choixEmbed = new Discord.MessageEmbed()
    // .setAuthor(`Bienvenue :`, bot.user.avatarURL())
    // .setDescription(`Choisissez votre groupe en cliquant sur la réaction correspondante pour pouvoir accéder au serveur !\n💚 pour G1 `)
    // .setThumbnail(bot.user.avatarURL())
    // .setFooter(`BotIUT version v${version} par Léo Mercier`)
    // .setColor(bleuFonce);
    // message.channel.send({embed : choixEmbed}).then(async function (message) {
    //     await message.react("💚");
    // });
};

module.exports.conf = {
    name: "addreactions",
    aliases: [],
};