import { ApplicationCommandData, GuildChannel, MessageEmbed, Permissions, TextChannel } from "discord.js";
import { RunInterface } from "../interfaces/commands";
import { version } from "../config.json";

export const run: RunInterface = async (client, interaction) => {
	const mutedUser = interaction.options.getUser("user")!;
	if (!interaction.guild || !interaction.member) return;

	if (!interaction.guild.members.cache.get(interaction.member.user.id)?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
		const repEmbed = new MessageEmbed()
			.setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	const mutedMember = interaction.guild.members.cache.get(mutedUser.id);
	if (!mutedMember || mutedMember?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || interaction.member.user.id === mutedUser.id || client.user!.id === mutedUser.id) {
		const repEmbed = new MessageEmbed()
			.setDescription("Cette utilisateur ne peut pas être unmute !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	const channels = await interaction.guild.channels.fetch();
	channels.forEach(async (channel: GuildChannel) => {
		if (channel.type === "GUILD_TEXT") await channel.permissionOverwrites.delete(mutedMember);
	});

	const repEmbed = new MessageEmbed()
		.setDescription("La personne a bien été unmute !")
		.setColor("GREEN");
	interaction.reply({ embeds: [repEmbed], ephemeral: true });

	const logs = interaction.guild.channels.cache.find(channel => channel.id === process.env.LOGS);

	const unmuteLogsEmbed = new MessageEmbed()
		.setDescription(`**Action :** Unmute\n**Modérateur :** ${interaction.member} (${interaction.member.user.id})\n**Membre :** ${mutedUser} (${mutedUser.id})\n**Channel :** ${interaction.guild.channels.cache.get(interaction.channelId)?.toString()}\n**Raison :** ${interaction.options.getString("raison") ? interaction.options.getString("raison") : "Aucune raison spécifiée"}`)
		.setFooter(`BotIUT v${version}`)
		.setColor("#A3FF84")
		.setTimestamp();
	(logs as TextChannel)?.send({ embeds: [unmuteLogsEmbed] });
};

export const interaction: ApplicationCommandData = {
	name: "unmute",
	description: "Unmute un membre du serveur",
	/* Permissions: [
		{
			id: process.env.MODID,
			type: "ROLE",
			permission: true
		}
	],*/
	options: [
		{
			name: "user",
			type: "USER",
			description: "Le membre que tu veux unmute",
			required: true,
		},
		{
			name: "raison",
			type: "STRING",
			description: "La raison de l'unmute",
			required: false,
		},
	],
};
