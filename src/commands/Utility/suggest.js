"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const Guild = require("../../models/suggestions")
const emojis = require("../../../Controller/emojis/emojis")

module.exports.cooldown = {
    length: 320000, /* in ms */
    users: new Set()
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction) =>
{
    try
    {
        const suggestion = interaction.options.getString("suggestion")

        const guildQuery = await Guild.findOne({ id: interaction.guild.id })
        if(!guildQuery) {
            return interaction.reply({ content: `${emojis.error} | This guild has no Suggestion System setup.`, ephemeral: true })
        }

        const embed = new MessageEmbed()
        .setTitle(`${emojis.notify} New Suggestion`)
        .setDescription(`${suggestion}`)
        .setTimestamp()
        .setFooter({ text: `From: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setColor("#36393F")

        if(guildQuery) {
            const guild = interaction.client.guilds.cache.get(interaction.guild.id);
            const suggestionchannel = guild.channels.cache.get(guildQuery.channel);
            const message = await suggestionchannel.send({ embeds: [embed] }) 

            await message.react(`${emojis.success}`)
            await message.react(`${emojis.error}`)

            interaction.reply({ content: `${emojis.success} | Successfully sent suggestion.`, ephemeral: true, fetchReply: true });
        }
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
    .setName("suggest")
    .setDescription("Suggest some Ideas for the Server.")
    .addStringOption(option => option.setName("suggestion").setDescription("Provide the reason for the ban, add proofs via Imgur.").setRequired(true))
