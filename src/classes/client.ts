import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { Command } from "../interfaces/commands";
import type { Event } from "../interfaces/events";
import fs from "fs/promises";
import path from "path";

class Bot extends Client {
    public commands: Collection<string, Command> = new Collection();
    private events: Collection<string, Event> = new Collection();

    public constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
    }

    public async start(): Promise<void> {
        await this.registerEvents();
        await this.registerInteractions();
        await this.login(process.env.TOKEN);
    }

    public async registerEvents(dir = "../events") {
        const files = await fs.readdir(path.join(__dirname, dir));
        for (const file of files) {
            const stat = await fs.lstat(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                this.registerEvents(path.join(dir, file));
            } else if (file.endsWith(".js")) {
                try {
                    const eventModule: Event = await import(path.join(__dirname, dir, file));
                    this.events.set(eventModule.name, eventModule);
                    this.on(eventModule.name, eventModule.run.bind(null, this));
                } catch (err) {
                    throw new Error(`[Error] ${err}`);
                }
            }
        }
    }

    public async registerInteractions(dir = "../commands") {
        const files = await fs.readdir(path.join(__dirname, dir));
        for (const file of files) {
            const stat = await fs.lstat(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                this.registerInteractions(path.join(dir, file));
            } else if (file.endsWith(".js")) {
                try {
                    const cmdModule: Command = await import(path.join(__dirname, dir, file));
                    if (cmdModule.interaction) this.commands.set(cmdModule.interaction.name, cmdModule);
                } catch (err) {
                    throw new Error(`[Error] ${err}`);
                }
            }
        }
    }
}

export default Bot;
