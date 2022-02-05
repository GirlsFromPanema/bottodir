"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

module.exports.cooldown = {
    length: 10000, /* in ms */
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
        const user = interaction.options.getUser("user") || interaction.user;
        const invites = await interaction.guild.invites.fetch();
		const filtered = invites.filter(inv => inv.inviter && inv.inviter.id === user.id);

		const embed = new MessageEmbed()
        .setDescription(`**${user.tag}** has **${filtered.size}** invites!`)
        .setColor("RANDOM")
        .setTimestamp()

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
    .setName("invites")
    .setDescription("Show someones total User Invites")
    .addUserOption((option) => option.setName("user").setDescription("From who would you like to display the Invites of?").setRequired(false));
