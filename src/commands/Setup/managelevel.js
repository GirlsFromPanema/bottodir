"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, IntegrationApplication, NewsChannel } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

const GuildLevel = require("../../models/Levelling/guildlevel");

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
        const option = interaction.options.getString("option");
        const plans = ["enable", "disable"];

        if(!plans.includes(option)) {
            return interaction.reply({ content: `${emojis.error} | Not a valid option, available option: ${plans.join(", ")}`, ephemeral: true })
        }

        if(option === "enable") {
            const newGuild = new GuildLevel({
                id: interaction.guild.id,
                option: option
            })
            newGuild.save();
            interaction.reply({ content: `${emojis.success} | Successfully **enabled** levelling`, ephemeral: true })
        }

        if(option === "disable") {
            const isSetup = await GuildLevel.findOne({ id: interaction.guild.id })
            if(!isSetup) return interaction.reply({ content: `${emojis.error} | You first have to **enable** levelling before disabling it.`, ephemeral: true })

            await GuildLevel.findOneAndDelete({ id: interaction.guild.id })
            interaction.reply({ content: `${emojis.success} | Successfully **disabled** levelling`, ephemeral: true})
        }

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
    .setName("managelevel")
    .setDescription("Setup the levelling System in your Server")
    .addStringOption((option) => option.setName("option").setDescription("Enable or disable the levelling system").setRequired(true));
    
