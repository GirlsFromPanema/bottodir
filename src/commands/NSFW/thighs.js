"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const fetch = require("cross-fetch");

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

        let subreddits = [
            'thighs',
            'PerfectThighs',
            'thickthighs'
          ]
        
        let reddit = subreddits[Math.floor(Math.random() * (subreddits.length - 1))];
        
        const data = await fetch(`https://meme-api.herokuapp.com/gimme/${reddit}`).then(res => res.json());
        if(!data) return interaction.reply({ content: "The APi is currently under maintenance, please try again later."})

        const { title, postLink, url, subreddit } = data;

        const embed = new MessageEmbed()
        .setTitle(`${title}`)
        .setColor("RED")
        .setURL(`${postLink}`)
        .setImage(url)
        .setFooter({ text: `/reddit/${subreddit}` })


        await interaction.reply({ embeds: [embed], ephemeral: true });
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
    .setName("thighs")
    .setDescription("Sends you some nice pictures");
