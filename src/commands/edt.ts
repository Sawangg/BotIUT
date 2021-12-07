import { ApplicationCommandData, Formatters, MessageEmbed, Permissions } from "discord.js";
import { RunInterface } from "../interfaces/commands";
import fetch from "node-fetch";

export const run: RunInterface = (_client, interaction) => {
    if (!interaction.guild || !interaction.member) return;

    if (!interaction.guild.members.cache.get(interaction.member.user.id)?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        const repEmbed = new MessageEmbed()
            .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            .setColor("RED");
        return interaction.reply({ embeds: [repEmbed], ephemeral: true });
    }

    const year = interaction.options.getString("annee")!;
    const week = interaction.options.getInteger("semaine")!.toString();
    const isMentioned = interaction.options.getBoolean("mention")!;
    const url = `http://${process.env.BACKURL}/${year}/${year}_S${week}.png`;

    fetch(url).then(rep => {
        if (rep.status === 200) {
            let content = "";
            if (isMentioned) {
                switch (year) {
                    case "A1":
                        content = Formatters.roleMention(process.env.A1!);
                        break;
                    case "A2":
                        content = Formatters.roleMention(process.env.A2!);
                        break;
                    case "A3":
                        content = Formatters.roleMention(process.env.A3!);
                        break;
                    default:
                        content = "@everyone";
                        break;
                }
            }
            const repEmbed = new MessageEmbed()
                .setTitle(`✨ EDT pour la semaine **${week}** !`)
                .setDescription(`L'EDT peut changer en cours de semaine, veuillez vous référez à l'emploi du temps de cette semaine sur le site officiel : [ici](http://edt-iut-info.unilim.fr/edt/${year}/${year}_S${week}.pdf)`)
                .setImage(url)
                .setColor("WHITE");
            return isMentioned ? interaction.reply({ content, embeds: [repEmbed], allowedMentions: { parse: ["roles"] } }) : interaction.reply({ embeds: [repEmbed] });
        } else {
            const repEmbed = new MessageEmbed()
                .setDescription("Une erreur est survenue lors de l'obtention de l'EDT !")
                .setColor("RED");
            interaction.reply({ embeds: [repEmbed], ephemeral: true });
        }
    }).catch(() => {
        const repEmbed = new MessageEmbed()
            .setDescription("Une erreur est survenue lors de l'obtention de l'EDT !")
            .setColor("RED");
        interaction.reply({ embeds: [repEmbed], ephemeral: true });
    });
};

export const interaction: ApplicationCommandData = {
    name: "edt",
    description: "Obtiens l'EDT",
    options: [
        {
            name: "annee",
            type: "STRING",
            description: "L'annee de l'edt",
            required: true,
            choices: [
                {
                    name: "A1",
                    value: "A1",
                },
                {
                    name: "A2",
                    value: "A2",
                },
                {
                    name: "A3",
                    value: "A3",
                },
            ],
        },
        {
            name: "semaine",
            type: "INTEGER",
            description: "La semaine voulu pour l'edt (ex: 6)",
            required: true,
        },
        {
            name: "mention",
            type: "BOOLEAN",
            description: "Mentionner le groupe",
            required: true,
        },
    ],
};
