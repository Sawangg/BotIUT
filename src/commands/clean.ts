import { ApplicationCommandData, Message, MessageEmbed, Permissions, TextChannel } from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import { version } from "../index";

export const run: RunInterface = async (_client, interaction) => {
	if (!interaction.guild || !interaction.member) return;

	if (!interaction.guild.members.cache.get(interaction.member.user.id)?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
		const repEmbed = new MessageEmbed()
			.setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	const channel = await interaction.channel?.fetch();
	(channel as TextChannel).messages.fetch(interaction.options.getString("msg")!).then((message: Message) => {
		if (!interaction.guild || !interaction.member) return;
		const logs = interaction.guild.channels.cache.find(c => c.id === process.env.LOGS);

		const muteLogsEmbed = new MessageEmbed()
			.setDescription(`**Action :** Suppression de message (Clean)\n**Modérateur :** ${interaction.member} (${interaction.member.user.id})\n**Membre :** ${message.author} (${message.author.id})\n**Channel :** ${interaction.guild.channels.cache.get(interaction.channelId)?.toString()} (${message.channelId})\n**Message :** ${message.content}\n**Raison :** ${interaction.options.getString("raison")}`)
			.setFooter(`BotIUT v${version}`)
			.setColor("#DB3E79")
			.setTimestamp();

		try {
			message.delete();
		} catch {
			const repEmbed = new MessageEmbed()
				.setDescription("Le message n'a pas pu être supprimé !")
				.setColor("RED");
			return interaction.reply({ embeds: [repEmbed], ephemeral: true });
		}
		(logs as TextChannel)?.send({ embeds: [muteLogsEmbed] });

		const repEmbed = new MessageEmbed()
			.setDescription("Le message a bien été supprimé !")
			.setColor("GREEN");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}).catch(() => {
		const repEmbed = new MessageEmbed()
			.setDescription("Le message n'a pas pu être trouvé !\nVérifies l'id et execute cette commande dans le même channel que le message que tu veux suppimer.")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	});
};

export const interaction: ApplicationCommandData = {
	name: "clean",
	description: "Supprime un message",
	options: [
		{
			name: "msg",
			type: "STRING",
			description: "L'id du message a supprimer",
			required: true,
		},
		{
			name: "raison",
			type: "STRING",
			description: "La raison du report",
			required: true,
		},
	],
};
