const Discord = require("discord.js");
const tokenconf = require("../util/api/token.json");
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const token = tokenconf.token;
const bot = new Discord.Client({
    disableEveryone: true,
    shardCount: 1,
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.login(token);

const init = async () => {

    // Event Handler

    const evtFiles = await readdir("./events/");
    console.log(`[Events] Loaded a total of ${evtFiles.length} events !`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        const event = require(`../events/${file}`);
        bot.on(eventName, event.bind(null, bot));
        const mod = require.cache[require.resolve(`../events/${file}`)];
        delete require.cache[require.resolve(`../events/${file}`)];
        for (let i = 0; i < mod.parent.children.length; i++) {
            if(mod.parent.children[i] === mod) {
                mod.parent.children.splice(i, 1);
                break;
            }
        }
    });

    // Commands Loader

    const commands = ["misc"];
    const count = [];

    for(let i = 0; i < commands.length; i++) {
        fs.readdir(`./commands/${commands[i]}/`, (err, files) => {
            if(err) console.log(err);
            const jsfile = files.filter(f => f.split(".").pop() === "js");
            if(jsfile.length <= 0) {
                return console.log(`[Commands] No Commands in /${commands[i]}/ !`);
            }

            jsfile.forEach((f) =>{
            const props = require(`../commands/${commands[i]}/${f}`);
            if (props.conf && props.conf.name) {
                bot.commands.set(props.conf.name, props);
                props.conf.aliases.forEach(alias => {
                    bot.aliases.set(alias, props.conf.name);
                });
            } else {
                console.error(`[Error] ${f} doesn't have a valid .conf property !`);
            }
        });
            count.push(files.length);
        });
    }

    function buffer() {
        const result = count.reduce((a, b) => a + b, 0);
        console.log(`[Commands] Loaded a total of ${result} commands !`);
    } setTimeout(buffer, 5);
};

init();