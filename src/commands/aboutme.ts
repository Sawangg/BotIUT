import { ApplicationCommandData, MessageEmbed } from "discord.js";
import { RunInterface } from "../interfaces/commands";

export const run: RunInterface = (_client, interaction) => {
	const abtmeEmbed = new MessageEmbed()
		.setDescription("💗 Dev par Léo Mercier • [Github](https://github.com/Sawangg/BotIUT)")
		.setColor("WHITE");
	return interaction.reply({ embeds: [abtmeEmbed], ephemeral: true });
};

export const interaction: ApplicationCommandData = {
	name: "aboutme",
	description: "Obtiens les informations sur le bot",
};
