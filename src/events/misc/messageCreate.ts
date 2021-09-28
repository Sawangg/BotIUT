import { ApplicationCommandData, Message, MessageEmbed, Permissions, TextChannel } from "discord.js";
import { RunInterface } from "../../interfaces/events";
import { version } from "../../config.json";
import { Command } from "../../interfaces/commands";

export const run: RunInterface = async (client, message: Message) => {
    if ((!message.guild) || (message.author.bot)) return;

    const logs = message.guild.channels.cache.find(channel => channel.id === process.env.LOGS);
    if(!logs) return;

    if(message.content.toLowerCase().includes("nitro") && message.content.toLowerCase().includes("free")) {
        if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(message.content)) {
            const freeNitroEmb = new MessageEmbed()
			    .setDescription(`**Action :** Suppression d'un message\n**Membre :** ${message.author.username} (${message.author.id})\n**Raison :** Suspicion de message dangereux (phishing)\n**Contenu :** ${message.content}`)
                .setFooter(`BotIUT v${version}`)
                .setColor("#FF3232")
                .setTimestamp();
            (logs as TextChannel)?.send({ embeds: [freeNitroEmb] });
            return message.delete();
        }
    }

    if(!message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        if(/(?:https?:\/)?discord(?:app.com\/invite|.gg)/gi.test(message.content)) {
            const delInvEmb = new MessageEmbed()
                .setDescription(`**Action :** Suppression d'un message\n**Membre :** ${message.author.username} (${message.author.id})\n**Raison :** Invitation discord\n**Contenu :** ${message.content}`)
                .setFooter(`BotIUT v${version}`)
                .setColor("#FF3232")
                .setTimestamp();
            (logs as TextChannel)?.send({ embeds: [delInvEmb] });
            return message.delete();
        }
    }

    if(message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && message.content.toLowerCase() === "!register") {
        const commandsData: Array<ApplicationCommandData> = [];

        client.commands.forEach((value: Command) => {
            commandsData.push(value.interaction);
        });
    
        const fetchedGuild = await client.guilds.fetch(message.guild.id);
        fetchedGuild.commands.set(commandsData); 
        return message.channel.send("Commandes enregistrées !");
    }
}

export const name: string = "messageCreate";