const Discord = require("discord.js");
const fs = require("fs").promises;
const path = require("path");
const bot = new Discord.Client({
    shards: "auto",
    shardCount: 1,
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.login(process.env.BOT_TOKEN);

// Event Handler

async function registerEvents(dir = "../events") {
    const files = await fs.readdir(path.join(__dirname, dir));
    for (const file of files) {
        const stat = await fs.lstat(path.join(__dirname, dir, file));
        if (stat.isDirectory()) {
            await registerEvents(path.join(dir, file));
        } else if (file.endsWith(".js")) {
            const eventName = file.substring(0, file.indexOf(".js"));
            try {
                const eventModule = require(path.join(__dirname, dir, file));
                bot.on(eventName, eventModule.bind(null, bot));
            } catch (err) {
                throw new Error(`[Error] ${err}`);
            }
        }
    }
}
registerEvents();

// Commands Handler

async function registerCommands(dir = "../commands") {
    const files = await fs.readdir(path.join(__dirname, dir));
    for (const file of files) {
        const stat = await fs.lstat(path.join(__dirname, dir, file));
        if (stat.isDirectory()) {
            await registerCommands(path.join(dir, file));
        } else if (file.endsWith(".js")) {
            try {
                const cmdModule = require(path.join(__dirname, dir, file));
                if (cmdModule.conf && cmdModule.conf.name) {
                    bot.commands.set(cmdModule.conf.name, cmdModule);
                    cmdModule.conf.aliases.forEach(alias => {
                        bot.aliases.set(alias, cmdModule.conf.name);
                    });
                }
            } catch (err) {
                throw new Error(`[Error] ${err}`);
            }
        }
    }
}
registerCommands();