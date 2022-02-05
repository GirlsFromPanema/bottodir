"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, Message } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

const Guild = require("../../models/logs");

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils, guild, member) =>
{
    try
    {

        let channel = interaction.channel;

        channel.permissionOverwrites.create(channel.guild.roles.everyone, { SEND_MESSAGES: false, ADD_REACTIONS: false });

        await interaction.reply({ content: `${emojis.success} locked ${channel}`, ephemeral: true });

        const embed = new MessageEmbed()
        .setTitle(`${emojis.staff} Channel Update`)
        .setDescription(`Channel: ${channel}\nModerator: ${interaction.user.tag}\nAction: **Locked Channel**`)
        .setTimestamp()
        .setColor("GREEN")
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `From: ${interaction.guild.name}`, iconURL: String })
        
        const guildQuery = await Guild.findOne({ id: interaction.guild.id })
        if(!guildQuery) return;

        if(guildQuery) {
            const guild = interaction.client.guilds.cache.get(interaction.guild.id)
            const logging = guild.channels.cache.get(guildQuery.channel)
            logging.send({ embeds: [embed] })
        } 
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
    userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS]
};

module.exports.data = new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock the Channel for everyone, nobody can write messages anymore.");
