"use strict";

                                                                                                                                                                                                                                                                                                                            /*

                                        ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION 

                                                                            THIS IS THE TIME SYSTEM OF THE BOT.
                                                                                    MODIFY AT YOUR OWN RISK.

                                                                - THIS FILE IS ONLY NEEDED FOR INIT. THE TIME UTIL QUERIES.

                                     - SUPPORT IS NOT PROVIDED IF THIS IS MODIFIED/CHANGED/MOVED IN ANY WAY THAT MAY BREAK COMMANDS/EVENTS/FUNCTIONS.




                                                                                                                                                                                                                                                                                                                    */



                                                                                                                                                                                                                                                                                                                                    /*



                                                                                %CopyrightBegin%


                                                                    Copyright Bottodir 2021. All Rights Reserved.

                                                            Licensed under the Apache License, Version 2.0 (the "License");
                                                            you may not use this file except in compliance with the License.

                                                                    You may obtain a copy of the License at

                                                                    http://www.apache.org/licenses/LICENSE-2.0

                                                            Unless required by applicable law or agreed to in writing, software
                                                            distributed under the License is distributed on an "AS IS" BASIS,
                                                        WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                        See the License for the specific language governing permissions and
                                                                            limitations under the License.


                                                                                    %CopyrightEnd%    
                                                                                    
                                                                                    
                                                                                    
                                                                        --      last update: 12/2/2022         --                                                                                                                                                                                                       */

const { Client } = require("discord.js");
const { red, green, blue, yellow, cyan } = require("chalk");

// Configs
const client = require("../util/bot");
const emojis = require("../../Controller/emojis/emojis");

// Database queries
const User = require("../models/Premium/User");

module.exports.data = {
  name: "ready",
  once: true,
};

/**
 * Handle the clients event.
 * @param {Client} client The client that triggered the event.
 */
module.exports.run = async (client) => {

  const arrayOfStatus = [
    `${client.guilds.cache.size} Guilds`,
    `${client.users.cache.size} Users`,
    `/help | ${client.guilds.cache.size} Guilds`,
]

  // Set the Bot status
  setInterval(() => {
    client.user.setPresence({ activities: [{ name: `${arrayOfStatus[Math.floor(Math.random() * arrayOfStatus.length)]}` }], status: 'online', type: "WATCHING" })
}, 8000)
  
  // Once the bot goes online, load all the settings of the users.
  const users = await User.find();
  for (let user of users) {
    client.userSettings.set(user.userID, user); 
    //                            ^^ 
    // make sure to have the same name as in the schema here. if userid, change to userid.
  }
  require('../handler/premium')

  const loading = String.raw`
                  __         ______   __    __  __    __   ______   __    __  ______  __    __   ______  
                 /  |       /      \ /  |  /  |/  \  /  | /      \ /  |  /  |/      |/  \  /  | /      \ 
                 $$ |      /$$$$$$  |$$ |  $$ |$$  \ $$ |/$$$$$$  |$$ |  $$ |$$$$$$/ $$  \ $$ |/$$$$$$  |
                 $$ |      $$ |__$$ |$$ |  $$ |$$$  \$$ |$$ |  $$/ $$ |__$$ |  $$ |  $$$  \$$ |$$ | _$$/ 
                 $$ |      $$    $$ |$$ |  $$ |$$$$  $$ |$$ |      $$    $$ |  $$ |  $$$$  $$ |$$ |/    |
                 $$ |      $$$$$$$$ |$$ |  $$ |$$ $$ $$ |$$ |   __ $$$$$$$$ |  $$ |  $$ $$ $$ |$$ |$$$$ |
                 $$ |_____ $$ |  $$ |$$ \__$$ |$$ |$$$$ |$$ \__/  |$$ |  $$ | _$$ |_ $$ |$$$$ |$$ \__$$ |
                 $$       |$$ |  $$ |$$    $$/ $$ | $$$ |$$    $$/ $$ |  $$ |/ $$   |$$ | $$$ |$$    $$/ 
                 $$$$$$$$/ $$/   $$/  $$$$$$/  $$/   $$/  $$$$$$/  $$/   $$/ $$$$$$/ $$/   $$/  $$$$$$/  
                                                                                                                                                                                                      
`;
  const prefix = "/";

  console.log(red(loading));
  console.log(``);
  console.log(
    green(`                                                     Konicord`)
  );
  console.log(``);
  console.log(``);
  console.log(
    yellow(
      "               + ================================================================================== +"
    )
  );
  console.log(
    cyan(
      `                                [i] :: ${prefix}help                :: Displays commands.                   `
    )
  );
  console.log(
    cyan(
      `                                [i] :: ${prefix}ping                :: Displays bots ping.                  `
    )
  );
  console.log(
    yellow(
      "               + ================================Commands========================================== +"
    )
  );
  console.log(
    cyan(
      `                       Author   [i] :: By [Koni#9521]    :: © 2021 Development                   `
    )
  );
  console.log(
    cyan(
      `                       Bot info [i] :: Status                       :: ✅ Online                           `
    )
  );
  console.log(
    cyan(
      `                       Users    [i] ::                              :: ${client.users.cache.size}  Users   `
    )
  );
  console.log(
    cyan(
      `                       Guilds   [i] ::                              :: ${client.guilds.cache.size} Guilds  `
    )
  );
  console.log(
    yellow(
      "               + ================================Website=========================================== +"
    )
  );
  console.log(
    cyan(
      `                       Link     [i] ::        [konicord.dev]        :: Our Website                          `
    )
  );

  console.log("Press [CTRL + C] to stop the Terminal ...");
};
