// This is used to log user information to a channel within the developers guild.

const config = require("../../../Controller/owners.json");
const masterLogger = interaction.client.channels.cache.get(config.channel);

if(!masterLogger) return;
const logs = new MessageEmbed()
  .setTitle(`${emojis.success} ACTION`)
  .setDescription(
    `
        **Actioned by**: \`${interaction.user.tag}\`\n
        **User**: \`${user.tag} || "Author"\`
        `
  )
  .setColor("GREEN")
  .setTimestamp();

  masterLogger.send({ embeds: [logs] });

