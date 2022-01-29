"use strict";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");
const Guild = require("../../models/guilds.js");
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

/**
 * Sets up the bot for first use.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        await interaction.deferReply({ ephemeral: true });

        const isSetup = await Guild.findOne({ id: interaction.guildId });
        if (!isSetup)
        {
            const role = interaction.options.getRole("role", true);
            const channel = interaction.options.getChannel("channel", true);
            if (channel.type != "GUILD_TEXT")
            {
                interaction.editReply({ content: "Expected a text channel.", ephemeral: true });
                return;
            }
            const newGuild = new Guild({
                id: interaction.guildId,
                role: role.id,
                channel: channel.id
            });
            newGuild.save();
            interaction.editReply({ content: `${emojis.success} | successfully set tracking to ${channel}`, ephemeral: true });
        }
        else {
            const role = interaction.options.getRole("role", true);
            const channel = interaction.options.getChannel("channel", true);

            await Guild.findOneAndUpdate({
                id: interaction.guildId,
                role: role.id,
                channel: channel.id
            })
            interaction.editReply({ content: `🌀 | Successfully changed tracking to ${channel} with ${role}`, ephemeral: true });
        }
        return;
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
    .setName("settracker")
    .setDescription("Setup Bot Status Tracking")
    .addRoleOption(option => option.setName("role").setDescription("The role you wish to be pinged on a bot status change.").setRequired(true))
    .addChannelOption(option => option.setName("channel").setDescription("The channel you wish to be notified in about bot status updates.").setRequired(true));