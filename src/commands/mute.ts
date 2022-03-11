import { ApplicationCommandData, MessageEmbed, Permissions, TextChannel } from "discord.js";
import type { RunInterface } from "../interfaces/commands";
import { version } from "../index";

export const run: RunInterface = async (client, interaction) => {
	if (!interaction.guild || !interaction.member) return;
	const member = await client.guilds.cache.get(interaction.guildId!)!.members.fetch(interaction.options.getUser("user")!);
	const reason = interaction.options.getString("reason")! ?? "Aucune raison";
	const msTime = interaction.options.getInteger("time")! * 60000;

	if (!interaction.guild.members.cache.get(interaction.member.user.id)?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
		const repEmbed = new MessageEmbed()
			.setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	if (!member || member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
		const repEmbed = new MessageEmbed()
			.setDescription("Cette utilisateur ne peut pas être mute !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	}

	member.timeout(msTime, reason).then(() => {
		const repEmbed = new MessageEmbed()
			.setDescription("La personne a bien été mute !")
			.setColor("GREEN");
		interaction.reply({ embeds: [repEmbed], ephemeral: true });

		const logs = interaction.guild!.channels.cache.find(channel => channel.id === process.env.LOGS);

		const muteLogsEmbed = new MessageEmbed()
			.setDescription(`**Action :** Mute\n**Modérateur :** ${interaction.member} (${interaction.member!.user.id})\n**Membre :** ${member.toString()} (${member.id})\n**Channel :** ${interaction.guild!.channels.cache.get(interaction.channelId)?.toString()}\n**Raison :** ${interaction.options.getString("reason")}`)
			.setFooter(`BotIUT v${version}`)
			.setColor("#B19CD9")
			.setTimestamp();
		(logs as TextChannel)?.send({ embeds: [muteLogsEmbed] });
	}).catch(() => {
		const repEmbed = new MessageEmbed()
			.setDescription("Une erreur fatale est survenue !")
			.setColor("RED");
		return interaction.reply({ embeds: [repEmbed], ephemeral: true });
	});
};

export const interaction: ApplicationCommandData = {
	name: "mute",
	description: "Mute un membre du serveur",
	options: [
		{
			name: "user",
			type: "USER",
			description: "Le membre que tu veux muter",
			required: true,
		},
		{
            name: "time",
            type: "INTEGER",
            description: "Le timeout en minute (0 pour unmute)",
            required: true,
        },
		{
			name: "reason",
			type: "STRING",
			description: "La raison du mute",
			required: true,
		},
	],
};
