<p align="center">
  <a href="https://discord.gg/3eNaWPhWZE" target="blank"><img src="https://media.discordapp.net/attachments/937035004108742657/939450995228954625/42b8f1ff89a307e6d969bb13726b9a45.webp" width="120" alt="Bottodir Logo" /></a>
</p>

<p align="center">A high quality <a href="http://discord.gg" target="_blank">Discord</a> Bot to grow your Server.</p>
<p align="center">

# Bottodir - Utility Discord
Nothing can go wrong with someone like Bottodir, what are you waiting for?
  
## Guild Setup
> Click [here to invite Bottodir](https://discord.com/api/oauth2/authorize?client_id=838730162283216968&permissions=1644972474359&scope=bot%20applications.commands).
* Make sure to add the highest role/permissions possible to be able to use all commands.

> Features && Commands
* View all the commands and features [here]()

## Index
- [D] = Deprecated.
- [DEV] = Only avaiable on Dev branch.
- [MB] = Maintenance break. 
- [RM] = Removed from main + dev branch.
- [LTV] = Latest version.
- [P] = Premium only.
- [TP] = Temporary feature.

## Local Setup
> 1. Download && Install
```
$ git clone https://github.com/GirlsFromPanema/bottodir
$ cd bottodir
$ npm install
$ npm start
```
> 2. Update Token
- rename `.envexample` to `.env`
- fill out `bot token`, `mongodb`, `BOT_ID`, `GUILD_ID`
 
`Controller/owners.json`
owner IDs, channel ID (for master logger)
`Controller/dashboard.json [D]`
for the website
  
> 3. Starting the Bot
```
$ npm run deploy
$ npm run dev
```
The bot should be online now. 
  
## Deployment
Read this [warning](https://github.com/GirlsFromPanema/bottodir/blob/main/source.md) before you do anything.

* I'm using Ubuntu Version 20.4 and [PM2](https://pm2.keymetrics.io/) in this example. 

Make sure NodeJS v16+ and PM2 is installed.
  
> 1. Upload project to server
```
Upload your files through a SFT(P) (Save File Transport)
```
  
> 2. Installing dependencies
```
$ npm install
```

> 3. Final deployment
```
$ pm2 start index.js --name discordbot

[ a table should be here now ]
```

> 4. List all system
```
$ pm2 ls
``` 

> 5. Views the terminal logs

```
$ pm2 logs
```
Current logs (errors, warnings etc.) are displayed here.
  
🎉 Your bot should run 24/7 now.

## Features
  
* Moderation
* Utility
* Economy
* Fun
* NSFW
* Utility

and much more!

## Tech Stack
* [Language](https://www.javascript.com/)
* [Runtime](https://nodejs.org/en/)
* [API](https://www.npmjs.com/package/discord.js?source=post_page-----7b5fe27cb6fa----------------------)
* [Database](https://www.mongodb.com/) 
* [Ecosystem](https://pm2.keymetrics.io/docs/usage/application-declaration/)
* ~~[Testing](https://jestjs.io/)~~ [D] [RM]
* ~~[Tasks](https://gruntjs.com/getting-started)~~ [D] [RM]
* ~~[Automation](https://gulpjs.com/)~~ [D] [RM]


## Collaborate
- Fork the Repository 
- Submit a Pull request.


> #### [Click here for support](https://discord.gg/SMzefFJN7x)


## Privacy Policy

Privacy Policy for Bottodir.

At Bottodir, accessible from Bottodir or this source, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Bottodir and how we use it.

If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.

This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Bottodir. This policy is not applicable to any information collected offline or via channels other than this website. Our Privacy Policy was created with the help of the Free Privacy Policy Generator.

### Consent

By using Bottodir, you hereby consent to our Privacy Policy and agree to its terms.

### Information we collect


The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.

If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.

When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.

### How we use your information
We use the information we collect in various ways, including to:

Provide, operate, and maintain our website
Improve, personalize, and expand our website
Understand and analyze how you use our website
Develop new products, services, features, and functionality
Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes
Send you emails
Find and prevent fraud
Log Files
Bottodir follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.

### Cookies and Web Beacons
Like any other website, Bottodir uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.

For more general information on cookies, please read the Cookies article on Bottodir's Articles.

### Advertising Partners Privacy Policies
You may consult this list to find the Privacy Policy for each of the advertising partners of Bottodir.

Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Bottodir, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.

Note that Bottodir has no access to or control over these cookies that are used by third-party advertisers.

### Third Party Privacy Policies
Bottodir's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.

You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.

### CCPA Privacy Rights (Do Not Sell My Personal Information)
Under the CCPA, among other rights, California consumers have the right to:

Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.

Request that a business delete any personal data about the consumer that a business has collected.

Request that a business that sells a consumer's personal data, not sell the consumer's personal data.

If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.

### GDPR Data Protection Rights
We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:

The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.

The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.

The right to erasure – You have the right to request that we erase your personal data, under certain conditions.

The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.

The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.

The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.

If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.

### Children's Information:
Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.

Bottodir does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website or API, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
  
## Website Terms and Conditions of Use:
1. Terms


By accessing this Website, accessible from Bottodir, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.

2. Use License


Permission is granted to temporarily download one copy of the materials on Bottodir's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

modify or copy the materials;
use the materials for any commercial purpose or for any public display;
attempt to reverse engineer any software contained on Bottodir's Website;
remove any copyright or other proprietary notations from the materials; or
transferring the materials to another person or "mirror" the materials on any other server.
This will let Bottodir to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format. These Terms of Service has been created with the help of the Terms Of Service Generator.

3. Disclaimer


All the materials on Bottodir’s Website are provided "as is". Bottodir makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Bottodir does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.

4. Limitations


Bottodir or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Bottodir’s Website, even if Bottodir or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.

5. Revisions and Errata


The materials appearing on Bottodir’s Website may include technical, typographical, or photographic errors. Bottodir will not promise that any of the materials in this Website are accurate, complete, or current. Bottodir may change the materials contained on its Website at any time without notice. Bottodir does not make any commitment to update the materials.

6. Links


Bottodir has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by Bottodir of the site. The use of any linked website is at the user’s own risk.

7. Site Terms of Use Modifications


Bottodir may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.

8. Your Privacy.


Please read our Privacy Policy [here](https://github.com/GirlsFromPanema/bottodir/blob/main/privacy.md).

9. Governing Law


Any claim related to Bottodir's Website shall be governed by the laws of at without regards to its conflict of law provisions.

## Copyright && License

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

**Last update: 03/09/2022**
