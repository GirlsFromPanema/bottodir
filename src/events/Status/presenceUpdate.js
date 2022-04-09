"use strict";

// Database queries
const Guild = require("../../models/Status/status");

module.exports.data = {
  name: "presenceUpdate",
  once: false,
};

/**
 * Handle the clients event.
 * @param {Client} client The client that triggered the event.
 */
module.exports.run = async (oldPresence, newPresence) => {
  const hasSetup = await Guild.findOne({ id: newPresence.guild.id });
  if (hasSetup) {
    const role = hasSetup.role;
    const statusmessage = hasSetup.statusmessage;

    if (!role || !statusmessage) return;

    try {
      // check if the user has a custom status + the status saved in the db
      if (newPresence.activities[0]?.type === "CUSTOM") {
        if (newPresence.activities[0]?.state === statusmessage) {
          newPresence.member.roles.add(role); // add role if everything is true
          // if status is changed to something else
        } else {
          newPresence.member.roles.remove(role);
        }
        // if custom status is removed
      } else {
        newPresence.member.roles.remove(role);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }
}