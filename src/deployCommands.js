"use strict";

                                                                                                                                                                                                                                                                                                                            /*

                                        ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION 

                                                                            THIS IS THE COMMAND SYSTEM OF THE BOT.
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
                                                                                    
                                                                                    
                                                                                    
                                                                        --      last update: 22/2/2022         --                                                                                                                                                                                                       */



const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { getAllFiles } = require("./util/util.js");
const { green } = require("colors/safe");

const local = true; /* Change to false to deploy commands globally. */

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const commands = [];

const commandFiles = getAllFiles(path.join(__dirname, "./commands"));
for (const file of commandFiles)
{
    const command = require(`${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);
(async () =>
{
    try
    {
        console.log(green("Started refreshing application (/) commands."));
        await rest.put(
            (local ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId)),
            { body: commands },
        ).then((c) =>
        {
            console.log(green("Successfully reloaded application (/) commands."));
            return Promise.resolve(commands);
        });
    } catch (err)
    {
        console.error(err);
        return Promise.reject(err);
    }
})();
