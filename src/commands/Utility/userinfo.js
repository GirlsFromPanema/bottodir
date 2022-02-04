"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const moment = require("moment")
const emojis = require("../../../Controller/emojis/emojis")

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
        const { options, guild } = interaction;
        const target = interaction.options.getMember("target")
        const owner = await guild.fetchOwner();

        const avpng = target.user.displayAvatarURL({ format: "png", dynamic: true })
        const joinedServerAt = `📅 ${moment(target.joinedTimestamp).format("DD/MM/YYYY")}`
        const isBot = target.user.bot ? `${emojis.success}` : `${emojis.error}`;
        
        const joinedDiscordAt = `📅 ${moment(target.user.createdTimestamp).format("DD/MM/YYYY")}`

        const flags = {
            DISCORD_EMPLOYEE: `${emojis.staff}`,
            DISCORD_PARTNER: `${emojis.partner}`,
            BUGHUNTER_LEVEL_1: `${emojis.bughunter}`,
            BUGHUNTER_LEVEL_2: `${emojis.bughunter2}`,
            HYPESQUAD_EVENTS: `${emojis.hypesquad}`,
            HOUSE_BRAVERY: `${emojis.habr}`,
            HOUSE_BRILLIANCE: `${emojis.brilliance}`,
            HOUSE_BALANCE: `${emojis.hob}`,
            EARLY_SUPPORTER: `${emojis.supporter}`,
            TEAM_USER: `${emojis.staff}`,
            SYSTEM: `${emojis.system}`,
            VERIFIED_BOT: `${emojis.verifiedbot}`,
            VERIFIED_DEVELOPER: `${emojis.developer}`
        };

        const userFlags = target.user.flags.toArray();
        const badges = userFlags.length ? userFlags.map(flag => flags[flag]).join(", ") : "None";
        const statuses = {
            "Online": `${emojis.online}`,
            "Idle": `${emojis.idle}`,
            "DND": `${emojis.dnd}`,
            "Offline": `${emojis.offline}`,
        };
        const status = `${statuses[target.presence?.status]} ${target.presence?.status}`
        const activity = target.presence?.activities[0];
        var userstatus = "None";

        if (activity) {
            if (activity.type === "CUSTOM_STATUS") {
                let emoji = `${activity.emoji ? activity.emoji.id ? `<${activity.emoji.animated ? "a" : ""}:${activity.emoji.name}:${activity.emoji.id}>` : activity.emoji.name : ""}`
                userstatus = `${emoji} \`${activity.state || 'None'}\``
            }
            else {
                userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``
            }
        };

        const totalRoles = await target.roles.cache.size;
        const roles = await target.roles;
        const highestRole = target.roles.highest.id === guild.id ? 'None' : target.roles.highest;
        function trimArray(arr, maxLen = 25) {
            if (Array.from(arr.values()).length > maxLen) {
                const len = Array.from(arr.values()).length - maxLen;
                arr = Array.from(arr.values()).sort((a, b) => b.rawPosition - a.rawPosition).slice(0, maxLen);
                arr.map(role => `<@&${role.id}>`)
                arr.push(`${len} more...`);
            }
            return arr.join(", ");
        }
        const Roles = await target.roles.cache.size < 25 ? Array.from(roles.cache.values()).sort((a, b) => b.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : roles.cache.size > 25 ? trimArray(roles.cache) : "None";

        const UserInfoEm = new MessageEmbed()
            .setColor("BLURPLE")
            .setAuthor({ name: `User: ${target.user.tag}`, iconURL: target.user.displayAvatarURL({ dynamic: true })})
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: `Avatar -`, value: `[PNG](${avpng})`, inline: true },
                { name: `Joined Server At -`, value: `${joinedServerAt}`, inline: true },
                { name: `Bot -`, value: `${isBot}`, inline: true },
                { name: `Badges -`, value: `${badges}`, inline: true },
                { name: `Status -`, value: `${status}`, inline: true },
                { name: `Activity -`, value: `${userstatus}`, inline: true },
                
                { name: `Highest Role -`, value: `${highestRole}`, inline: true },
                { name: `Role(s) :-`, value: `[${totalRoles}] -\n ${Roles}`, inline: true },
            )
            .setFooter({ text: `ID - ${target.user.id} | Joined Discord At - ${joinedDiscordAt}` })
        await interaction.reply({
            content: `${emojis.users} Information about **${target.user.tag}**`,
            embeds: [UserInfoEm]
        });
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
    .setName("userinfo")
    .setDescription("Userinfo about a User")
    .addUserOption(option => option.setName("target").setDescription("Select a User to check Info from").setRequired(true))
