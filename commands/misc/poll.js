const Discord = require("discord.js");
const { errorX } = require("../../util/config.json");

module.exports.run = async (_bot, message, args, prefix) => {

	function generateHex() {
		return "#" + Math.floor(Math.random() * 16777215).toString(16);
	}

	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`${errorX} Vous n'avez pas la permission d'utiliser \`poll\` !`);
	let nom = message.member.nickname;
	if (nom == null) nom = message.author.tag;
	if (!args[0]) return message.channel.send(`${errorX} Vous devez ajouter une question !`);
	const pollEmbed = new Discord.MessageEmbed()
	.setAuthor(nom, message.author.avatarURL({ dynamic: true }))
	.setDescription(`**Question :** ${message.content.slice(prefix.length + 5)}`)
	.setColor(generateHex())
	.setFooter("Répondez en cliquant sur les réactions ci-dessous");
	return message.channel.send({ embed: pollEmbed }).then(m => {
		m.react("613040238461190186");
		m.react("622794615069736980");
	});
};

module.exports.conf = {
	name: "poll",
	aliases: ["sondage"],
};