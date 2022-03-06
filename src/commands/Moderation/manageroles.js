"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../models/Logging/logs");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 180000,
    users: new Set(),
};

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async(interaction) => {
    await interaction.deferReply();
    const sub = interaction.options.getSubcommand();

    const role = interaction.options.getRole("role");
    const allmembers = interaction.guild.members.cache.filter((m) => !m.user.bot).size

    if (sub === "add") {
        // Security checks
        if (!role) interaction.followUp({ content: `${emojis.error} | This is not a valid Role`, ephemeral: true })

        // If the role is higher than the bots role
        if (interaction.guild.me.roles.highest.id === role.id) {
            return interaction.followUp({ content: `${emojis.error} | This Role is higher than me, I cannot do that!`, ephemeral: true })
        }

        // Adding role to the user
        try {
            interaction.guild.roles.cache.get(role)
            interaction.guild.members.cache.forEach(member => member.roles.add(role))
        } catch (error) {
            console.log(error);
            return;
        }

        const logs = new MessageEmbed()
            .setTitle(`${emojis.success} Added Roles`)
            .setDescription(`By: ${interaction.user.username}\nSuccessfully added ${role} to ${allmembers}.`)
            .setAuthor({ name: `By: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor("GREEN")
            .setTimestamp()

        interaction.followUp({ content: `${emojis.success} | Successfully added roles!`, ephemeral: true });

        const guildQuery = await Guild.findOne({ id: interaction.guild.id });
        if (!guildQuery) return;

        if (guildQuery) {
            const webhookid = guildQuery.webhookid;
            const webhooktoken = guildQuery.webhooktoken;

            const webhookClient = new WebhookClient({ id: webhookid, token: webhooktoken });

            webhookClient.send({ embeds: [logs] })
        }
    } else if (sub === "remove") {


        // If the role is higher than the bots role
        if (interaction.guild.me.roles.highest.id === role.id) {
            return interaction.followUp({ content: `${emojis.error} | This Role is higher than me, I cannot do that!`, ephemeral: true });
        }

        // Removed role from the users
        try {
            interaction.guild.roles.cache.get(role)
            interaction.guild.members.cache.forEach(member => member.roles.remove(role))
        } catch (error) {
            console.log(error);
            return;
        }

        const logs = new MessageEmbed()
            .setTitle(`${emojis.success} Removed Roles`)
            .setDescription(`By: ${interaction.user.username}\nSuccessfully removed ${role} from ${allmembers}.`)
            .setAuthor({ name: `By: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor("GREEN")
            .setTimestamp()

        interaction.followUp({ content: `${emojis.success} | Successfully removed roles!`, ephemeral: true });

        const guildQuery = await Guild.findOne({ id: interaction.guild.id });
        if (!guildQuery) return;

        if (guildQuery) {
            const webhookid = guildQuery.webhookid;
            const webhooktoken = guildQuery.webhooktoken;

            const webhookClient = new WebhookClient({ id: webhookid, token: webhooktoken });

            webhookClient.send({ embeds: [logs] })
        }
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
    userPermissions: [Permissions.FLAGS.MANAGE_ROLES]
};

module.exports.data = new SlashCommandBuilder()
    .setName("manageroles")
    .setDescription("Mass add/remove roles")
    .addSubcommand((sub) =>
        sub.setName("add").setDescription("Mass add roles to all users")
        .addRoleOption(option => option.setName("role").setDescription("Role to add").setRequired(true))
    )
    .addSubcommand((sub) =>
        sub.setName("remove").setDescription("Mass remove roles from all users")
        .addRoleOption(option => option.setName("role").setDescription("Role to remove").setRequired(true))
    );