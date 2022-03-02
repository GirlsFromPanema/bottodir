"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, WebhookClient } = require("discord.js");

// Users database profile
const warnModel = require("../../models/Moderation/warning");

// Server logging
const Guild = require("../../models/Logging/logs");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {

    // Fetch the user 
    const target = interaction.options.getUser("target");

    const embed = new MessageEmbed()
    .setDescription(`✅ | Successfully deleted ${target}'s warning`)
    .setColor("GREEN")
    .setTimestamp()

    // Find the data of the user and delete one warning, if there isn't any warning saved, return an error.
    const data = await warnModel.findOne({ 
      userId: target.id 
    })
    if(!data) return interaction.reply({ content: `${target.tag} has no warnings`, ephemeral: true })
    
    data.delete();

    interaction.reply({ embeds: [embed], ephemeral: true });
    
    // Embed structure
    const user = interaction.guild.members.cache.get(target.userId)
    
    const logs = new MessageEmbed()
    .setTitle(`✅ | Removed warning`)
    .setDescription(`User: ${target}\nModerator: ${interaction.user.tag}`)
    .setTimestamp()
    .setColor("GREEN")

    // Fetch the Guilds Log channel in the database and send the action into it, if none, return.
    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    if (!guildQuery) return;
    
    if (guildQuery) {
      const webhookid = guildQuery.webhookid;
      const webhooktoken = guildQuery.webhooktoken;

      const webhookClient = new WebhookClient({ id: webhookid, token: webhooktoken });

      webhookClient.send({ embeds: [logs]})
    } 
    // Send the Update to the target (user)
    const userlogs = new MessageEmbed()
    .setTitle("✅ | Removed warning")
    .setDescription(`Hey ${target}!\nYour warn got removed from by ${interaction.user.tag}.\nServer:${interaction.guild.name}`)
    .setColor("GREEN")
    .setTimestamp()
        
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("removewarning")
  .setDescription("Remove the warning of a User")
  .addUserOption((option) => option.setName("target").setDescription("Provide the User to remove the warn").setRequired(true))
