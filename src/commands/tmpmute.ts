import { GuildChannel, MessageEmbed, Permissions, TextChannel, User } from "discord.js";
import { RunInterface } from "../interfaces/commands";
import { version } from "../config.json";

export const run: RunInterface = async (client, interaction) => {

	const mutedUser: User = interaction.options.getUser("user")!;
	if (!interaction.guild || !interaction.member) return;
	const guild = interaction.guild;

	if (!guild.members.cache.get(interaction.member.user.id)?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
		const repEmbed = new MessageEmbed()
			.setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	const mutedMember = guild.members.cache.get(mutedUser.id);
	if (!mutedMember || mutedMember?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || interaction.member.user.id === mutedUser.id || client.user!.id === mutedUser.id) {
		const repEmbed = new MessageEmbed()
			.setDescription("Cette utilisateur ne peut pas être tmpmute !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	const channels = await interaction.guild.channels.fetch();
	channels.forEach(async (channel: GuildChannel) => {
		if (channel.type === "GUILD_TEXT") await channel.permissionOverwrites.create(mutedMember, { SEND_MESSAGES: false });
	});

	const repEmbed = new MessageEmbed()
		.setDescription("La personne a bien été tmpmute !")
		.setColor("GREEN");
	interaction.reply({ embeds: [repEmbed], ephemeral: true });

	const logs = interaction.guild.channels.cache.find(channel => channel.id === process.env.LOGS);
	const channelId = interaction.channelId;
	const time = interaction.options.getInteger("secondes")!;
	const raison = interaction.options.getString("raison");

	const muteLogsEmbed = new MessageEmbed()
		.setDescription(`**Action :** Tmpmute\n**Modérateur :** <@${interaction.member.user.id}> (${interaction.member.user.id})\n**Membre :** <@${mutedUser.id}> (${mutedUser.id})\n**Channel :** <#${interaction.channelId}>\n**Secondes : ** ${time}\n**Raison :** ${raison}`)
		.setFooter(`BotIUT v${version}`)
		.setColor("#ADD8E6")
		.setTimestamp();
	(logs as TextChannel)?.send({ embeds: [muteLogsEmbed] });

	setTimeout(async () => {
		const channels = await guild.channels.fetch();
		channels.forEach(async (channel: GuildChannel) => {
			if (channel.type === "GUILD_TEXT") await channel.permissionOverwrites.delete(mutedMember);
		});

		const unmuteLogsEmbed = new MessageEmbed()
			.setDescription(`**Action :** Unmute automatique\n**Modérateur :** <@${client.user?.id}> (${client.user?.id})\n**Membre :** <@${mutedUser.id}> (${mutedUser.id})\n**Channel :** <#${channelId}>\n**Secondes : ** ${time}\n**Raison :** ${raison}`)
			.setFooter(`BotIUT v${version}`)
			.setTimestamp();
		(logs as TextChannel)?.send({ embeds: [unmuteLogsEmbed] });
	}, time * 1000);
}

export const interaction: Object = {
	name: "tmpmute",
	usage: "tmpmute <user> <raison>",
	description: "Mute un membre du serveur",
	/*permissions: [
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
			description: "Le membre que tu veux muter",
			required: true,
		},
		{
			name: "secondes",
			type: "INTEGER",
			description: "Le nombre de secondes (ex: 3600 pour une heure)",
			required: true,
		},
		{
			name: "raison",
			type: "STRING",
			description: "La raison du tmpmute",
			required: true,
		},
	],
};