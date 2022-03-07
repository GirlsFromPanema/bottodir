"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, WebhookClient } = require("discord.js");

// Users database profile
const warnModel = require("../../models/Moderation/warning");

// Server logging
const Guild = require("../../models/Logging/logs");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 10000 /* in ms */ ,
    users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async(interaction, utils) => {
    try {

        // ID
        const pin = interaction.options.getString("id");

        // Find the data of the user and delete one warning, if there isn't any warning saved, return an error.
        const data = await warnModel.findOne({
            pin: pin
        });

        // If there is no saved query with that ID, return an error
        if (!data) return interaction.reply({ content: `${emojis.error} | \`${pin}\` does not exist.`, ephemeral: true })

        data.delete();

        const embed = new MessageEmbed()
            .setDescription(`✅ | Successfully deleted warning`)
            .setColor("GREEN")
            .setTimestamp()

        interaction.reply({ embeds: [embed], ephemeral: true });

        // Embed structure
        const user = interaction.guild.members.cache.get(pin.userId)

        const logs = new MessageEmbed()
            .setTitle(`✅ | Removed warning`)
            .setDescription(`User: ${user}\nModerator: ${interaction.user.tag}`)
            .setTimestamp()
            .setColor("GREEN")

        // Fetch the Guilds Log channel in the database and send the action into it, if none, return.
        const guildQuery = await Guild.findOne({ id: interaction.guild.id });
        if (!guildQuery) return;

        if (guildQuery) {
            const webhookid = guildQuery.webhookid;
            const webhooktoken = guildQuery.webhooktoken;

            const webhookClient = new WebhookClient({ id: webhookid, token: webhooktoken });

            webhookClient.send({ embeds: [logs] })
        }
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
    .setName("removewarning")
    .setDescription("Remove the warning of a User")
    .addStringOption((option) =>
        option
        .setName("id")
        .setDescription("Enter the Warn ID you would like to remove")
        .setRequired(true)
    )