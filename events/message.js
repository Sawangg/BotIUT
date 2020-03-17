const Discord = require("discord.js");
const botconfig = require("../util/config.json");

module.exports = (bot, message) => {

    if(message.channel.type === "dm") return;
    let guild = message.guild;
    if(!guild || message.author.bot) return;

    // Command Handler

    let messageArray = message.content.split(/ +/);
    for (let i = 0; i < messageArray.length; i++) {
        messageArray[i] = messageArray[i].toString().toLowerCase(); 
    }
    let args = messageArray.slice(1);
    let command;

    for(const prefix of [botconfig.prefix, `<@${bot.user.id}>`, `<@!${bot.user.id}>`]) {
        if(message.content.toLowerCase().startsWith(prefix)) {
            if(message.content.toLowerCase().startsWith("<@")) {
                command = args[0];
                messageArray = messageArray.splice(1);
                args = args.filter(item => item !== command);
            } else {
                command = messageArray[0].slice(prefix.length);
            }
            if(!command) return message.channel.send(``);
            if(bot.commands.has(command)) {
                return bot.commands.get(command).run(bot, message, args, prefix);
            } else if(bot.aliases.has(command)) {
                return bot.commands.get(bot.aliases.get(command)).run(bot, message, args, prefix);
            }
            return;
        }
    }
}