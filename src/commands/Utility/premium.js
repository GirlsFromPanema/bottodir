"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");
const moment = require("moment");

// Datbase queries
const User = require("../../models/Premium/User");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 90000,
    users: new Set(),
};

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async(interaction) => {
    try {

        let user = User;

        if (user && user.isPremium) {
            return message.channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor('GREEN')
                  .setDescription(
                    `**Name:** ${
                      interaction.user.username
                    }\n**Subscription:** Available\n**Ends in:** ${moment(
                      Number(user.premium.expiresAt),
                    ).toNow(true)}`,
                  ),
              ],
            })
          } else {
            return interaction.reply({ content: `${emojis.error} | You don't have any premium subscription active.`, ephemeral: true });
          }
        
    } catch (error) {
        console.log(error);
    }
};

module.exports.data = new SlashCommandBuilder()
    .setName("premium")
    .setDescription("Check the status of your premium code")
