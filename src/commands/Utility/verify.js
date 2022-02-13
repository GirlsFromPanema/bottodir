"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database queries
const GuildVerification = require("../../models/Verification/verification");
const guildLogging = require("../../models/Logging/logs");

// Configs
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
module.exports.run = async (interaction, utils, user) =>
{
    try
    {

        const guildQuery = await GuildVerification.findOne({ id: interaction.guild.id });
        
        if(!guildQuery) return interaction.reply({ content: `${emojis.error} | Verification is currently not available.`, ephemeral: true })
        
        const embed = new MessageEmbed()
        .setTitle(`${emojis.success} Verified`)
        .setDescription(`<@${interaction.user.id}> you have successfully verified for ${interaction.guild.name}`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setImage(interaction.guild.iconURL({ dynamic: true }))
        .setFooter({ text: `Verified in: ${interaction.guild.name}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})

        const loggingembed = new MessageEmbed()
        .setTitle(`${emojis.notify} Verification`)
        .setDescription(`User: ${interaction.user.tag} | ${interaction.user.id}\nAction: Verified for Server`)
        .setTimestamp()
        
        const guild = interaction.client.guilds.cache.get(interaction.guild.id);
        const role = guild.roles.cache.find((role) => role.id == guildQuery.role);
    
        if(interaction.member.roles.cache.has(role.id)) {
            interaction.reply({ content: `${emojis.error} | You are already verified`, ephemeral: true})
        }

        if(guildQuery) {
            interaction.member.roles.add(role)
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const guildLogQuery = await guildLogging.findOne({ id: interaction.guild.id });
        if(!guildLogging) return;

        if(guildLogging) {
            const logging = guild.channels.cache.get(guildLogQuery.channel)
            logging.send({ embeds: [loggingembed ]})
        }
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.ADMINISTRATOR],
    userPermissions: [Permissions.FLAGS.SEND_MESSAGES]
};

module.exports.data = new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify yourself for the Server");
