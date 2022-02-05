"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, Discord } = require("discord.js");

const { stripIndents } = require('common-tags');
const moment = require("moment");

const emojis = require("../../../Controller/emojis/emojis");

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
        const owner = await interaction.guild.fetchOwner()

        const embed = new MessageEmbed()
		.addFields({
            name: `**Server Information**`,
            value: `Status: ${emojis.online} Online\n• Owner: ${
             owner.user.tag
            }\n• Created: ${moment.utc(interaction.guild.createdAt).format('MMMM D, YYYY')}
            \n• Members: ${
                interaction.guild.members.cache.filter(m => !m.user.bot).size
            }\n• Bots: ${interaction.guild.members.cache.filter(m => m.user.bot).size}\n• Roles: ${interaction.guild.roles.cache.size}\n• Emojis: ${interaction.guild.emojis.cache.size}\n• Channels: ${interaction.guild.channels.cache.filter(ch => ch.type === 'text').size}`,
            inline: true,
          })
          .setFooter({ text: `Name: ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true})})
          .setImage(interaction.guild.iconURL({ dynamic: true}))
          .setAuthor({ name: `By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
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
    .setName("serverinfo")
    .setDescription("Check the Servers information");
