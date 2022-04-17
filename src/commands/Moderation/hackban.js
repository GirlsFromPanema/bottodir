"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    CommandInteraction,
    Permissions,
    MessageEmbed,
    WebhookClient,
} = require("discord.js");

// Database queries
const Guild = require("../../models/Logging/logs");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 90000 /* in ms */ ,
    users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async(interaction, utils) => {
    try {
        const target = interaction.options.getString("id");
        const reason = interaction.options.getString("reason") || "No reason provided";

        // ban the user if the ID is valid. 
        interaction.guild.members.ban(target).then((user) => {
            interaction.reply({ 
                content: `${emojis.success} | \`The user ${user.tag} has been hack-banned from this server!\`` 
        });
        }).catch(() => {
            interaction.reply({
                 content: `${emojis.error} | Please provide a valid member/user ID!`
                });
        });  

        const logs = new MessageEmbed()
            .setTitle("✅ | User hack-banned")
            .setDescription(
                `User: ${target}\nModerator: ${interaction.user.tag}\nReason: ${reason}`
            )
            .setTimestamp()
            .setColor("RED");

        // Log Channel
        const guildQuery = await Guild.findOne({ id: interaction.guild.id });

        // logging webhooks
        if (!guildQuery) return;
        if (guildQuery) {
            const webhookid = guildQuery.webhookid;
            const webhooktoken = guildQuery.webhooktoken;

            const webhookClient = new WebhookClient({
                id: webhookid,
                token: webhooktoken,
            });

            webhookClient.send({ embeds: [logs] });
        }

    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
    userPermissions: [Permissions.FLAGS.BAN_MEMBERS],
};

module.exports.data = new SlashCommandBuilder()
    .setName("hackban")
    .setDescription("Hackban a user")
    .addStringOption((option) =>
        option
        .setName("id")
        .setDescription("The ID of the user")
        .setRequired(true)
    )
    .addStringOption((option) =>
        option
        .setName("reason")
        .setDescription("Provide a Reason to hack-ban")
        .setRequired(false)
    );