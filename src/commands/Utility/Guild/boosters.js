"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Configs
const emojis = require("../../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 90000, /* in ms */
    users: new Set()
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        const boosters = await interaction.guild.members.cache.filter(member => member.premiumSince);
		let index = 0;

		let description;
		if (boosters.length <= 0) {
			description = 'This server does not have any server boosters!';
		} else {
			description = `${boosters.map(member => {
				index += 1;
				return `**${index}.** \`${member.user.tag}\``;
			}).join('\n')}`;
		}

		const embed = new MessageEmbed()
        .setTitle(`${interaction.guild.name} Booster's`)
        .setDescription(description)
        .setColor('#FF84F0')

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.SEND_MESSAGES]
};

module.exports.data = new SlashCommandBuilder()
    .setName("boosters")
    .setDescription("Displays all the Boosters on the Server");
