import { ApplicationCommandData, MessageEmbed, Permissions } from "discord.js";
import type { RunInterface } from "../interfaces/commands";

export const run: RunInterface = async (_client, interaction) => {
    if (!interaction.guild || !interaction.channel || !interaction.member) return;

    try {
        if (!interaction.guild!.members.cache.get(interaction.member.user.id)?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            if (!interaction.guild!.members.cache.get(interaction.member.user.id)?.roles.cache.has(process.env.DELEGUEID!)) {
                const repEmbed = new MessageEmbed()
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                    .setColor("RED");
                return interaction.reply({ embeds: [repEmbed], ephemeral: true });
            }
        }

        await interaction.channel.messages.pin(interaction.options.getString("msg")!);

        const repEmbed = new MessageEmbed()
            .setDescription(`Le message a été épinglé par ${interaction.member.toString()} !`)
            .setColor("GREEN");
        return interaction.reply({ embeds: [repEmbed] });
    } catch {
        const repEmbed = new MessageEmbed()
            .setDescription("Une erreur est survenue et le message n'a pas été épinglé !")
            .setColor("RED");
        return interaction.reply({ embeds: [repEmbed], ephemeral: true });
    }
};

export const interaction: ApplicationCommandData = {
    name: "pin",
    description: "Pin un message",
    options: [
        {
            name: "msg",
            type: "STRING",
            description: "L'id du message à pin",
            required: true,
        },
    ],
};
