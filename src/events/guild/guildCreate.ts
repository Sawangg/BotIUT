import { ApplicationCommandData, Guild } from "discord.js";
import { Command } from "../../interfaces/commands";
import { RunInterface } from "../../interfaces/events";

export const run: RunInterface = async (client, guild: Guild) => {
    if (!guild.available) return;

    // Register Slash commands to the guild
    const commandsData: Array<ApplicationCommandData> = [];
    client.commands.forEach((value: Command) => commandsData.push(value.interaction));
    const fetchedGuild = await client.guilds.fetch(guild.id);
    fetchedGuild.commands.set(commandsData);
};

export const name = "guildCreate";
