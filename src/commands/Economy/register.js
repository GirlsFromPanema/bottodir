"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const economySchema = require("../../models/Economy/usereconomy");
const emojis = require("../../../Controller/emojis/emojis");
const moment = require("moment");

const config = require("../../../Controller/owners.json");

module.exports.cooldown = {
    length: 10000, /* in ms */
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
        const masterLogger = interaction.client.channels.cache.get(config.channel);
        const isRegistered = await economySchema.findOne({ userID: interaction.user.id });
        if(isRegistered) return interaction.reply({ content: `You are already registered to the economic system.\nDate Registered: \`${moment(isRegistered.createdAt).fromNow()}\``, ephemeral: true })

        const registered = new MessageEmbed()
            .setTitle("Registered")
            .setDescription(`${emojis.success} \`${interaction.user.tag}\` successfully registered!\n\nDate and Time: \`${moment((Date.now() * 1000) / 1000).fromNow()}\`` )
            .setColor("RANDOM")
            .setTimestamp()

        if(!isRegistered) {
            const newUser = new economySchema({
                userID: interaction.user.id,
                createdAt: (Date.now() * 1000) / 1000,
                wallet: + 5000
            }).save();
        }

        const logs = new MessageEmbed()
        .setTitle(`${emojis.success} Registered`)
        .setDescription(`
        **Actioned by**: \`${interaction.user.tag}\`
        **Date**: \`${moment((Date.now() * 1000) / 1000).fromNow()}\`
        `)
        .setColor("GREEN")
        .setTimestamp()

        /*
        if(masterLogger) {
            masterLogger.send({ embeds: [logs] })
        }
        */

        interaction.reply({ embeds: [registered], ephemeral: true })
       
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
    .setName("register")
    .setDescription("Register your Account to be able to use the Economy System");
