import { MessageEmbed, TextChannel } from "discord.js";
import { RunInterface } from "../interfaces/commands";
import { version } from "../config.json";

export const run: RunInterface = async (client, interaction) => {

	const reportedUser = interaction.options.getUser("user");
    if(!interaction.guildId || !interaction.member || !reportedUser) return;

	const guild = client.guilds.cache.get(interaction.guildId);
	if(!guild) return;

	const reportMember = await guild.members.fetch(interaction.member.user.id);
	const reportedMember = await guild.members.fetch(reportedUser.id);

    const logs = guild.channels.cache.find(channel => channel.id === process.env.LOGS);
	if(!logs) return;

	const reportLogsEmbed = new MessageEmbed()
		.setDescription(`**Action :** Report\n**Membre :** ${reportMember?.nickname === null ? reportMember.user.username : reportMember?.nickname} (${reportMember?.id})\n**Reported :** ${reportedMember?.nickname === null ? reportedMember.user.username : reportedMember?.nickname} (${reportedMember?.id})\n**Raison :** ${interaction.options.getString("reason")}`)
		.setFooter(`BotIUT v${version}`)
		.setColor("#4752C4")
		.setTimestamp();
	(logs as TextChannel)?.send({ embeds: [reportLogsEmbed] });

	const repEmbed = new MessageEmbed()
		.setDescription("Ton report a bien été envoyé !")
		.setColor("WHITE");
	return interaction.reply({ embeds: [repEmbed], ephemeral: true });
}

export const interaction: Object = {
	name: "report",
	usage: "report <user> <reason>",
	description: "Report un membre à la modération",
	options: [
		{
			name: "user",
			type: "USER",
			description: "Le membre que tu veux report",
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