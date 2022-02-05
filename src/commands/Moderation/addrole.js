"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const Guild = require("../../models/logs");

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils, guild) =>
{
    try
    {
        // Security checks
        const target = interaction.options.getMember("target");
        const role = interaction.options.getRole("role");
        
        if(!target) interaction.reply({ content: "This is not a valid User!", ephemeral: true })
        if(!role) interaction.reply({ content: "This is not a valid Role", ephemeral: true })
    
        if (interaction.guild.me.roles.highest.id === role.id) {
            return interaction.reply({ content: "This User has a higher Role than me, I cannot do that!"})
        }

        const added = new MessageEmbed()
        .setDescription(`Successfully added ${role} to ${target}`)
        .setColor("GREEN")
        .setTimestamp()

        const removed = new MessageEmbed()
        .setDescription(`Successfully removed ${role} from ${target}`)
        .setColor("GREEN")
        .setTimestamp()

        const userembed = new MessageEmbed()
        .setTitle("✅ Your profile got updated")
        .setDescription(`Dear ${target}, this is a notification that your profile got updated.\nServer: ${interaction.guild.name}\nRole: ${role}\nModerator: ${interaction.user.tag}`)
        .setTimestamp()

        // If the user has the role, remove it. Else add it.
        if(target.roles.cache.has(role.id)) {
            target.roles.remove(role.id)
            interaction.reply({ embeds: [removed], ephemeral: true})
        } else {
            target.roles.add(role.id)
            interaction.reply({ embeds: [added], ephemeral: true})
        }
        const logs = new MessageEmbed()
        .setTitle("✅ | User Updated")
        .setDescription(`User updated: ${target}\nRole updated: ${role}\nModerator: ${interaction.user.tag}`)
        .setColor("GREEN")
        .setTimestamp()
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setImage(interaction.guild.iconURL({ dynamic: true }))

        target.send({ embeds: [userembed]})

        if (!guildQuery) return;
        const guildQuery = await Guild.findOne({ id: interaction.guild.id });
        if (guildQuery) {
          const guild = interaction.client.guilds.cache.get(
            interaction.guild.id
          );
          const logging = guild.channels.cache.get(guildQuery.channel);
          logging.send({ embeds: [logs] });
        } 
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Add a Role to a User")
    .addUserOption(option => option.setName("target").setDescription("The User which you would like to add a Role to").setRequired(true))
    .addRoleOption(option => option.setName("role").setDescription("The role you wish to be pinged on a bot status change.").setRequired(true))
