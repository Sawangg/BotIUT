const Discord = require("discord.js");
const botconfig = require("../../util/config.json");
const moment = require("moment");
const bleuFonce = botconfig.bleuFonce;
const version = botconfig.version;
require("moment-duration-format");

module.exports.run = async (bot, message, args) => {

    const client = new Discord.ShardClientUtil(bot);
            
    let start = Date.now();
    const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    
    const promises = [
        bot.shard.fetchClientValues('guilds.cache.size'),
        bot.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
    ];

    Promise.all(promises).then(results => {
        const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
        const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

        let statsEmbed = new Discord.MessageEmbed()
        .setAuthor(`BotIUT's stats :`, bot.user.avatarURL())
        .setDescription(`• **Memory Usage**  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n• **Uptime**  :: ${duration}\n• **Latency**  :: ${Date.now() - start}ms\n• **Shards**  :: ${client.count}\n• **Users**  :: ${totalMembers.toLocaleString()}\n• **Servers**  :: ${totalGuilds.toLocaleString()}`)
        .setThumbnail(bot.user.avatarURL())
        .setFooter(`BotIUT version v${version} par Léo Mercier`)
        .setColor(bleuFonce);
        message.channel.send({embed : statsEmbed});
    });
}

module.exports.conf = {
    name: "stats",
    aliases: ["stat", "botstats", "botstat", "info", "api", "uptime"],
}