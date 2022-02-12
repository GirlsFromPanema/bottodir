"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, Interaction } = require("discord.js");

// Database queries
const economyUser = require("../../models/Economy/usereconomy");
const Guild = require("../../models/Economy/guildeconomy");

// Configs
const emojis = require("../../../Controller/emojis/emojis");
const config = require("../../../Controller/owners.json");

module.exports.cooldown = {
    length: 10000, /* 1h Cooldown */
    users: new Set()
};

module.exports.ownerOnly = {
    ownerOnly: true
};

// Update the Users profile => add money to his wallet.
const addMoney = async (userID, wallet = 0) => {
	await economyUser.updateOne({ userID }, { $set: { userID }, $inc: { wallet: -wallet } }, { upsert: true });
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

        const amount = interaction.options.getInteger("amount");

        // Find the user in the database, if he isn't registered, return an error.
        const isRegistered = await economyUser.findOne({ userID: user.id });
        if(!isRegistered) return interaction.reply({ content: `${emojis.error} | This User is not registered.`, ephemeral: true })

        const bal = Number(amount)
        await addMoney(user.id, bal)

        const embed = new MessageEmbed()
        .setDescription(`${emojis.success} Successfully removed \`${amount}$\` to ${user.tag}`)
        .setColor("GREEN")
        .setFooter({ text: `Dev: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()

        const logs = new MessageEmbed()
        .setTitle(`${emojis.success} Removed Money`)
        .setDescription(`
        **Actioned by**: \`${interaction.user.tag}\`
        **User**: \`${user.tag}\`
        **Amount**: \`${amount}$\`
        `)
        .setColor("GREEN")
        .setFooter({ text: `By: ${interaction.user.username}`, displayAvatarURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()

        /*
        if(masterLogger) {
            masterLogger.send({ embeds: [logs] })
        }
        */

        const userlogs = new MessageEmbed()
        .setTitle(`${emojis.notify} Economy Profile Update`)
        .setDescription(`
        Your Balance has changed because someone added you Money!
        **Actioned by**: \`${interaction.user.tag}\`
        **Recipient**: \`${user.tag}\`
        **Guild**: \`${interaction.guild.name}\`
        **Amount**: \`${amount}$\`
        `)
        .setColor("GREEN")
        .setFooter({ text: `Guild: ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true })})
        .setTimestamp()

            user.send({ embeds: [userlogs] })

        return interaction.reply({ embeds: [embed], ephemeral: true })
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
    .setName("removemoney")
    .setDescription("Remove Money from a User.")
    .addIntegerOption((option) => option.setName("amount").setDescription("How much money would you like to remove?").setRequired(true))
    .addUserOption((option) => option.setName("user").setDescription("What user would you like to remove money from?").setRequired(false))

