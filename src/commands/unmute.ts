import { ApplicationCommandData, MessageEmbed, Permissions, TextChannel } from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import { version } from "../index";

export const run: RunInterface = async (client, interaction) => {
	const member = await client.guilds.cache.get(interaction.guildId!)!.members.fetch(interaction.options.getUser("user")!);
	const reason = interaction.options.getString("reason")! ?? "Aucune raison";
	if (!interaction.guild || !interaction.member) return;

	if (!interaction.guild.members.cache.get(interaction.member.user.id)?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
		const repEmbed = new MessageEmbed()
			.setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	const mutedMember = interaction.guild.members.cache.get(member.id);
	if (!mutedMember || mutedMember?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || interaction.member.user.id === member.id || client.user!.id === member.id) {
		const repEmbed = new MessageEmbed()
			.setDescription("Cette utilisateur ne peut pas être unmute !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	member.timeout(0, reason).then(() => {
		const repEmbed = new MessageEmbed()
			.setDescription("La personne a bien été unmute !")
			.setColor("GREEN");
		interaction.reply({ embeds: [repEmbed], ephemeral: true });

		const logs = interaction.guild!.channels.cache.find(channel => channel.id === process.env.LOGS);

		const unmuteLogsEmbed = new MessageEmbed()
			.setDescription(`**Action :** Unmute\n**Modérateur :** ${interaction.member} (${interaction.member!.user.id})\n**Membre :** ${member} (${member.id})\n**Channel :** ${interaction.guild!.channels.cache.get(interaction.channelId)?.toString()}\n**Raison :** ${interaction.options.getString("reason") ? interaction.options.getString("reason") : "Aucune raison spécifiée"}`)
			.setFooter(`BotIUT v${version}`)
			.setColor("#A3FF84")
			.setTimestamp();
		(logs as TextChannel)?.send({ embeds: [unmuteLogsEmbed] });
	}).catch(() => {
		const repEmbed = new MessageEmbed()
			.setDescription("Une erreur fatale est survenue !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	});
};

export const interaction: ApplicationCommandData = {
	name: "unmute",
	description: "Unmute un membre du serveur",
	options: [
		{
			name: "user",
			type: "USER",
			description: "Le membre que tu veux unmute",
			required: true,
		},
		{
			name: "reason",
			type: "STRING",
			description: "La raison de l'unmute",
			required: false,
		},
	],
};
