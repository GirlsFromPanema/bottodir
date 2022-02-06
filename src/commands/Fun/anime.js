"use strict"

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

module.exports.cooldown = {
    length: 10000,
    users: new Set()
};

/**
 * @param {CommandInteraction}
 * @param {any}
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        const embed = new MessageEmbed()
        .setTitle("Get Trolled Loser!!!")
        .setImage("https://media.giphy.com/media/g7GKcSzwQfugw/giphy.gif")

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
    .setName("anime")
    .setDescription("Gives you random anime gifs")