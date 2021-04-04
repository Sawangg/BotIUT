const Discord = require("discord.js");
const botconfig = require("../util/config.json");
const bleuFonce = botconfig.bleuFonce;

module.exports = (bot, message) => {

    if ((!message.guild) || (message.author.bot)) return;

    // Command Handler

    const messageArray = message.content.split(/ +/);
    let args = messageArray.slice(1);
    let command;

    for(const prefix of [botconfig.prefix, `<@${bot.user.id}>`, `<@!${bot.user.id}>`]) {
        if (message.content.toLowerCase().startsWith(prefix)) {
            if(message.content.toLowerCase().startsWith("<@")) {
                if (args[0]) {
                    command = args[0].toLowerCase();
                } else {
                    const commandEmbed = new Discord.MessageEmbed()
                    .setDescription("💗 Dev par Léo Mercier • [Github](https://github.com/Sawangg/BotIUT)")
                    .setColor(bleuFonce);
                    return message.channel.send({ embed : commandEmbed });
                }
                args = args.slice(1);
            } else {
                command = messageArray[0].slice(prefix.length).toLowerCase();
            }

            let cmd;
            if (bot.commands.has(command)) {
                cmd = bot.commands.get(command);
            } else if (bot.aliases.has(command)) {
                cmd = bot.commands.get(bot.aliases.get(command));
            }
            if (cmd != undefined) {
                return cmd.run(bot, message, args);
            }
            return;
        }
    }
};