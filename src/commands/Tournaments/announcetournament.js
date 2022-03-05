"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database queries
const Guild = require("../../models/Tournaments/tournaments");

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
module.exports.run = async (interaction, utils) =>
{
    try
    {

        // Check if the guild is signed up with any tournament
        const isSetup = await Guild.find({ id: interaction.guild.id });

        const channel = interaction.options.getChannel("channel") || interaction.channel;
        const role = interaction.options.getRole("role");
        
        // If there is no tournament, return an error.
        if(!isSetup) return interaction.reply({ content: `${emojis.error} | There is no Tournament going on.`, ephemeral: true })
        

        const tournaments = isSetup 
            .map((tournament) => {
                return [
                    [`**Name:** ${tournament.name}\n**Date:** ${tournament.date}\n**Price:** ${tournament.price}`].join("\n")
                ]
            }).join("\n");

        channel.send({
            content: `${role}`,
            embeds: [{
                title: `${emojis.notify} New Tournament!`,
                description: `There is a new Tournament going on!\n\n${tournaments}`,
                color: "GREEN",
                thumbnail: {
                    url: interaction.guild.iconURL({ format: "png", size: 1024 }),
                },
                timestamp: new Date()
            }]
        });

        interaction.reply({ content: "Notification sent!", ephemeral: true })
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
    .setName("announcetournament")
    .setDescription("Announce the tournament on your Server")
    .addRoleOption((option) => option.setName("role").setDescription("What role should be pinged?").setRequired(true))
    .addChannelOption((option) => option.setName("channel").setDescription("Where should the announcement be sent to?").setRequired(false));
    
    
