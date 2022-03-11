import type { Interaction } from "discord.js";
import type { RunInterface } from "../../interfaces/events";

export const run: RunInterface = (client, interaction: Interaction) => {
    if (!interaction.guildId || !interaction.isCommand()) return;
    if (client.commands.has(interaction.commandName)) client.commands.get(interaction.commandName)?.run(client, interaction);
};

export const name = "interactionCreate";
