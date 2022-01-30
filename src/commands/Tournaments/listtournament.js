"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const Guild = require("../../models/Tournaments/tournaments");
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 90000, /* in ms */
    users: new Set()
};

/**
 * Runs ping command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {

        // Check if the guild is signed up with any tournament
        const isSetup = await Guild.find({ id: interaction.guild.id });
        
        // If there is no tournament, return an error.
        if(!isSetup) { 
            return interaction.reply({ content: `${emojis.error} | There is no Tournament going on.`, ephemeral: true })
        }

        const tournaments = isSetup 
            .map((tournament) => {
                return [
                    [`**Name:** ${tournament.name}\n**Date:** ${tournament.date}`].join("\n")
                ]
            }).join("\n");

        const embed = new MessageEmbed()
        .setTitle(`${interaction.guild.name} Tournament's`)
        .setDescription(`${tournaments}`)
        .setFooter({ text: `Server: ${interaction.guild.name}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
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
    .setName("listtournament")
    .setDescription("List the Tournament on your Server");
    
