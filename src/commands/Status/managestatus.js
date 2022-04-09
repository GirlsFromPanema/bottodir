"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions  } = require("discord.js");

// Database queries
const Guild = require("../../models/Status/status");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 90000,
  users: new Set(),
};

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
  await interaction.deferReply();
  const sub = interaction.options.getSubcommand();

  if (sub === "create") {
   
    const role = interaction.options.getRole("role");
    const statusmessage = interaction.options.getString("status");

    const hasSetup = await Guild.findOne({ id: interaction.guild.id });
    if(!hasSetup) {
         const newSetup = new Guild({
             id: interaction.guild.id,
             role: role.id,
             statusmessage: statusmessage
         })
         newSetup.save();

     interaction.followUp({ content: `${emojis.success} | Successfully finished the setup.\nSaved as: ${role} + ${statusmessage}`, ephemeral: true });
    } else {
        await Guild.findOneAndUpdate({
         id: interaction.guild.id,
         role: role.id,
         status: statusmessage
        })
        interaction.followUp({ content: `Successfully updated setup`, ephemeral: true });
    }
    
  } else if (sub === "delete") {
    const hasSetup = await Guild.findOne({ id: interaction.guild.id });
      
    if(!hasSetup) return interaction.followUp({ content: `${emojis.error} | No setup found, could not delete anything.`, ephemeral: true });

    hasSetup.delete();
    interaction.followUp({ content: `${emojis.success} | Successfully deleted the setup`, ephemeral: true });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("managestatus")
  .setDescription("Create/Delete Status roles")
  .addSubcommand((sub) =>
    sub.setName("create").setDescription("Enable status roles")
    .addRoleOption((option) => option.setName("role").setDescription("The role that will be given to the user.").setRequired(true))
    .addStringOption((option) => option.setName("status").setDescription("The status message the user should have.").setRequired(true))
  )
  .addSubcommand((sub) =>
    sub.setName("delete").setDescription("Remove the status setup")
  );
