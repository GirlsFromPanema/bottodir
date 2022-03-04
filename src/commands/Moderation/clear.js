"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, WebhookClient } = require("discord.js");
const ms = require("ms");

// Database queries
const Guild = require("../../models/Logging/logs");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

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
        const amount = interaction.options.getInteger("amount")
        const channel = interaction.channel.name
        
        if(isNaN(amount) === true || amount < 0) return interaction.reply({ content: `${emojis.error} | Please specify the amount of the messages to be deleted.`})
        if(amount > 150) return interaction.reply({ content: `${emojis.error} | The maximal amount is **150**.`})

        const messages = await interaction.channel.messages.fetch({ limit: amount + 1})

        const filtered = messages.filter((msg) => Date.now() - msg.createdTimestamp <ms("14 days"))

        await interaction.channel.bulkDelete(filtered)

        const embed = new MessageEmbed()
        .setDescription(`Successfully deleted **${filtered.size - 1}** messages`)
        .setColor("GREEN")
        .setTimestamp()

        const logs = new MessageEmbed()
        .setTitle("✅ | Deleted Messages")
        .setDescription(`Deleted Messages: **${filtered.size - 1}**\nChannel: ${channel}\nModerator: ${interaction.user.tag}`)
        .setColor("GREEN")
        .setTimestamp()

        const guildQuery = await Guild.findOne({ id: interaction.guild.id });
        if (!guildQuery)
        
        if (guildQuery) {
            const webhookid = guildQuery.webhookid;
            const webhooktoken = guildQuery.webhooktoken;

            const webhookClient = new WebhookClient({ id: webhookid, token: webhooktoken });
    
            webhookClient.send({ embeds: [logs]})
        } 
        
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
    userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES]
};

module.exports.data = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear Messages from a Channel")
    .addIntegerOption(option => option.setName("amount").setDescription("Delete messages from the Channel").setRequired(true))
    .addChannelOption(option => option.setName("channel").setDescription("Select the Channel").setRequired(false))
