import { Interaction } from "discord.js";
import { RunInterface } from "../../interfaces/events";

export const run: RunInterface = async (client, interaction: Interaction) => {
    if (!interaction.guildId || !interaction.isCommand()) return;

    if (client.commands.has(interaction.commandName)) {
        const cmd = client.commands.get(interaction.commandName);
        return cmd?.run(client, interaction);
    }
}

export const name: string = "interactionCreate";