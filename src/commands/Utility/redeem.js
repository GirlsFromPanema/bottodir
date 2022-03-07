"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");
const moment = require("moment");

// Datbase queries
const User = require("../../models/Premium/User");
const schema = require("../../models/Premium/Code");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 10000,
    users: new Set(),
};

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async(interaction) => {
    try {

        const code = interaction.options.getString("code");

        let user = await User.findOne({
            userID: interaction.member.user.id,
        });

        // Return an error if the User does not include any valid Premium Code
        if (!code) return interaction.reply({ content: `${emojis.error} | This code is invalid.`, ephemeral: true });

        if (user && user.isPremium) return interaction.reply({ content: `${emojis.error} | You already have an active premium subscription.`, ephemeral: true });

        const premium = await schema.findOne({
            code: code.toUpperCase(),
        });

        if (premium) {
            const expires = moment(premium.expiresAt).format(
                "dddd, MMMM Do YYYY HH:mm:ss");

            user.isPremium = true;
            user.premium.redeemedBy.push(interaction.user);
            user.premium.redeemedAt = Date.now();
            user.premium.expiresAt = premium.expiresAt;
            user.premium.plan = premium.plan;

            user = await user.save({ new: true });
            interaction.client.userSettings.set(interaction.user.id, user);
            await premium.deleteOne();

            interaction.reply({ content: `${emojis.success} | Successfully redeemed premium.\n\n\`Expires at: ${expires}\``, ephemeral: true });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports.data = new SlashCommandBuilder()
    .setName("redeem")
    .setDescription("Redeem a premium Code")
    .addStringOption(option => option.setName("code").setDescription("Redeem a premium code").setRequired(true))