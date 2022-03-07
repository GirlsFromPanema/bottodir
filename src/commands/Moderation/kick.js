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
        const target = interaction.options.getMember("target");
        const reason =
            interaction.options.getString("reason") || "No reason provided";

        if (!target) return interaction.reply({ content: "This User is invalid" });

        let kickdm = new MessageEmbed()
            .setColor("RED")
            .setDescription(
                `You have been kicked from **${interaction.guild.name}**.\nReason: ${reason}`
            );

        try {
            await target.send({ embeds: [kickdm] });
        } catch (error) {
            interaction.reply({
                content: `${emojis.success} | Successfully kicked ${target.user.tag}.\n\nFailed to send DMs due to closed direct messages.`,
                ephemeral: true,
            });
            console.log(error);
            return target.kick({ target });
        }

        let kickmsg = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`${target.user.tag} Kicked`)
            .setDescription(
                `Kicked ${target.user.tag} from ${interaction.guild.name}.\nReason: ${reason}`
            );

        const logs = new MessageEmbed()
            .setTitle("✅ | Member kicked")
            .setDescription(
                `Kicked ${target.user.tag}\nModerator: ${interaction.user.tag}\nReason: ${reason}`
            )
            .setColor("GREEN")
            .setTimestamp();

        const guildQuery = await Guild.findOne({ id: interaction.guild.id });
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

        await interaction.reply({ embeds: [kickmsg], ephemeral: true });
        return;
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.ADMINISTRATOR],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user")
    .addUserOption((option) =>
        option
        .setName("target")
        .setDescription("Select the User to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
        option
        .setName("reason")
        .setDescription("Provide a Reason to kick")
        .setRequired(true)
    );