import { GuildChannel, MessageEmbed, Permissions, TextChannel, User } from "discord.js";
import { RunInterface } from "../interfaces/commands";
import { version } from "../config.json";

export const run: RunInterface = async (client, interaction) => {

	const mutedUser: User = interaction.options.getUser("user")!;
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
			.setDescription("Cette utilisateur ne peut pas être mute !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	const channels = await interaction.guild.channels.fetch();
	channels.forEach(async (channel : GuildChannel) => {
		if(channel.type === "GUILD_TEXT") await channel.permissionOverwrites.create(mutedMember, { SEND_MESSAGES: false } );
	});

	const repEmbed = new MessageEmbed()
		.setDescription("La personne a bien été mute !")
		.setColor("GREEN");
	interaction.reply({ embeds: [repEmbed], ephemeral: true });

	const logs = interaction.guild.channels.cache.find(channel => channel.id === process.env.LOGS);

	const muteLogsEmbed = new MessageEmbed()
		.setDescription(`**Action :** Mute\n**Modérateur :** <@${interaction.member.user.id}> (${interaction.member.user.id})\n**Membre :** <@${mutedUser.id}> (${mutedUser.id})\n**Channel :** <#${interaction.channelId}>\n**Raison :** ${interaction.options.getString("reason")}`)
		.setFooter(`BotIUT v${version}`)
		.setColor("#B19CD9")
		.setTimestamp();
	(logs as TextChannel)?.send({ embeds: [muteLogsEmbed] });
}

export const interaction: Object = {
	name: "mute",
	usage: "mute <user> <reason>",
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
			name: "reason",
			type: "STRING",
			description: "La raison du report",
			required: true,
		},
	],
};