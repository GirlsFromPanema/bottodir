"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database queries
const economySchema = require("../../models/Economy/usereconomy");
const Guild = require("../../models/Economy/guildeconomy");

// Configs
const config = require("../../../Controller/owners.json");
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
        const masterLogger = interaction.client.channels.cache.get(config.channel);
        
         // Check if the Guild has enabled economy, if not, return an error.
        const isSetup = await Guild.findOne({ id: interaction.guildId })
        if(!isSetup) return interaction.reply({ content: `${emojis.error} | Economy System is **disabled**, make sure to enable it before running this Command.\n\nSimply run \`/manageeconomy <enable/disable>\` and then rerun this Command.`, ephemeral: true})
 
        const user = interaction.options.getUser("user") || interaction.user;
        if(!user) return interaction.reply({ content: ":x: | This is not a valid user.", ephemeral: true });

        // Find the user in the database, if he isn't registered, return an error.
        const isRegistered = await economySchema.findOne({ userID: user.id });
        if(!isRegistered) return interaction.reply({ content: `${user} is not registered.`, ephemeral: true });

        const wallet = isRegistered.wallet ? isRegistered.wallet : 0;
        const bank =  isRegistered.bank ? isRegistered.bank : 0;

        const balance = new MessageEmbed()
        .setTitle(`${user.username}'s Balance`)
        .setDescription(`
        **Wallet**: ${isRegistered.wallet.toLocaleString()}
        **Bank**: ${isRegistered.bank.toLocaleString()}/${isRegistered.bankSpace} \`${(isRegistered.bank / isRegistered.bankSpace * 100).toFixed(1)}%\`
        **Net worth**: ${wallet + bank}
        `)
        .setFooter({ text: `From: ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()
        .setColor("RANDOM")

        const logs = new MessageEmbed()
        .setTitle(`${emojis.notify} Balance`)
        .setDescription(`
        **Actioned by**: \`${interaction.user.tag}\`
        **User**: \`${user.tag  || "Author"}\`
        `)
        .setColor("GREEN")
        .setTimestamp()

        /*
        if(masterLogger) {
            masterLogger.send({ embeds: [logs] })
        }
        */

        if(isRegistered) {
            interaction.reply({ embeds: [balance], ephemeral: true })
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
    .setName("balance")
    .setDescription("View the Balance of a User")
    .addUserOption((option) => option.setName("user").setDescription("Provide the User").setRequired(false))
