"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const Guild = require("../../models/logs")

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

/**
 * Runs ping command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        const target = interaction.options.getMember("target")
        const reason = interaction.options.getString('reason') || "No reason provided";

        if(!target) return interaction.reply({ content: "This User is invalid"})

        let bandm = new MessageEmbed()
        .setColor("RED")
        .setDescription(`You have been banned from **${interaction.guild.name}**\nModerator: ${interaction.user.tag}\nReason: ${reason}`)
        await target.send({ embeds: [bandm] });

           target.ban({ target });

        let banmsg = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`${target.user.tag} Banned`)
        .setDescription(`Banned ${target.user.tag} from ${interaction.guild.name}\nModerator: ${interaction.user.tag}\nReason: ${reason}`)
        .setTimestamp()
        .setColor("GREEN")
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setImage(interaction.guild.iconURL({ dynamic: true }))

        const logs = new MessageEmbed()
        .setTitle("✅ | User banned")
        .setDescription(`User: ${target.user.tag}\nModerator: ${interaction.user.tag}\nReason: ${reason}`)
        .setTimestamp()
        .setColor("GREEN")
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setImage(interaction.guild.iconURL({ dynamic: true }))

        // Log Channel
        const guildQuery = await Guild.findOne({ id: interaction.guild.id })

        if(!guildQuery) return;
        if(guildQuery) {
            const guild = interaction.client.guilds.cache.get(interaction.guild.id)
            const logging = guild.channels.cache.get(guildQuery.channel)
            logging.send({ embeds: [logs] })
        } 

        await interaction.reply({ embeds: [banmsg], ephemeral: true });
        return;
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.ADMINISTRATOR],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user")
    .addUserOption(option => option.setName("target").setDescription("Select the User to ban").setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription("Provide a Reason to Ban").setRequired(true))