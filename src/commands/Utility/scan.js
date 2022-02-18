"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 190000, /* in ms */
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
        const tag = interaction.options.getString('tag');

        const embed = new MessageEmbed()
        .setTitle(`${emojis.success} Scan`)
        .setDescription(`U have successfully scanned \`${tag}\`\n\nMore info will be here soon`)
        .setTimestamp()

        interaction.reply({ content: `${emojis.loading}`, ephemeral: true });

        // Wait five seconds, then send the message.
        setTimeout(function() {
            interaction.followUp({ content: `${emojis.success} successfully scanned \`${tag}\`, check your DMs!`, ephemeral: true });
        }, 5000)

        setTimeout(function() {
            interaction.user.send({ embeds: [embed] });
        }, 5500)

    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
    .setName("scan")
    .setDescription("Scan a specific tag")
    .addStringOption((option => option.setName("tag").setDescription("Provide the tag you want to scan").setRequired(true)))
