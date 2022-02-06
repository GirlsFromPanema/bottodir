"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

const Guild = require("../../models/Economy/guildeconomy");

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
        const option = interaction.options.getString("option")
        const plans = ["enable", "disable"]

        if(!plans.includes(option)) {
            return interaction.reply({ content: `Not a valid option, available option: ${plans.join(", ")}`, ephemeral: true })
        }
       
        if(option === "enable") {
            const newGuild = new Guild({
                id: interaction.guildId,
                option: option
            })
            newGuild.save()
            interaction.reply({ content: `${emojis.success} | Successfully **enabled** antiscam`, ephemeral: true})
        }

        if(option === "disable") {

            const newGuild = await Guild.findOne({ id: interaction.guildId })
            if(!newGuild) return interaction.reply({ content: `${emojis.error} | You first have to **enable** antiscam before disabling it.`, ephemeral: true })
            
            await Guild.findOneAndDelete({ id: interaction.guildId })
            interaction.reply({ content: `${emojis.success} | Successfully **disabled** antiscam`, ephemeral: true})
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
    .setName("manageantiscam")
    .setDescription("Enable or Disable Antiscam")
    .addStringOption(option => option.setName("option").setDescription("Enable with enable, disable with disable").setRequired(true))