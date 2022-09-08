import { ApplicationCommandData, EmbedBuilder } from "discord.js";
import type { RunInterface } from "../interfaces/commands";

export const run: RunInterface = (_client, interaction) => {
    const abtmeEmbed = new EmbedBuilder()
        .setDescription("💗 Dev par Léo Mercier • [Github](https://github.com/Sawangg/BotIUT)")
        .setColor("White");
    return interaction.reply({ embeds: [abtmeEmbed], ephemeral: true });
};

export const interaction: ApplicationCommandData = {
    name: "aboutme",
    description: "Obtiens les informations sur le bot",
};
