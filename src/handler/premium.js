"use strict";
                                                                                                                                                                                                                                                                                                                            /*

                                        ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION 

                                                                            THIS IS THE PREMIUM SYSTEM OF THE DEV  BOT.
                                                                                    MODIFY AT YOUR OWN RISK.

                                                                - THIS FILE IS ONLY NEEDED FOR INIT. THE USERS PREMIUM QUERIES.

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
                                                                                    
                                                                                    
                                                                                    
                                                                        --      last update: 5/3/2022         --                                                                                                                                                                                                       */

const User = require("../models/Premium/User");
const cron = require("node-cron");

// set the schedule, find the user in the database.
module.exports = async (client) => {
  cron.schedule("*/60 * * * * *", async () => {
    await User.find({ isPremium: true }, async (err, users) => {
      if (users && users.length) {
        // Set the expire Date and Time for our User + Code
        for (let user of users) {
          if (Date.now() >= user.premium.expiresAt) {
            // Default: The user is not a premium User
            user.isPremium = false;
            user.premium.redeemedBy = [];
            user.premium.redeemedAt = null;
            user.premium.expiresAt = null;
            user.premium.plan = null;

            // Save the updated user within the usersSettings.
            const newUser = await user.save({ new: true }).catch((error) => { console.log(error) });
            client.usersSettings.set(newUser.userID, newUser);
          }
        }
      }
    });
  });
};