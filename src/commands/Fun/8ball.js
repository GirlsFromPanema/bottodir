"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

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

        const question = interaction.options.getString('string', true);
        const replies = [
            "Yes.",
            "No.",
            "Never.",
            "Definitely.",
            "Ask again later.",
            "Imagine", 
            "Of course not",
            "Absolutely",
            "Ask mum"
        ];
        const result = Math.floor(Math.random() * replies.length); 

        const embed = new MessageEmbed()
        .setAuthor({ name: "🎱 The 8 Ball says..." })
            .setColor("ORANGE")
            .addField("Question:", question)
            .addField("Answer:", replies[result]);

        await interaction.reply({ embeds: [embed], ephemeral: false });
        return;
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
    .setName("8ball")
    .setDescription("Randomize a Question")
    .addStringOption(option => option.setName('string').setDescription('Enter a Question').setRequired(true))
