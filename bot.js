/*
    SAGUSKYBOT VERSION 1.0
        Ellis Levine

  See meme.js for more details

*/

require("dotenv").config;

const Discord = require('discord.js')
const client = new Discord.Client();
const fs = require('fs');
const jim = require('jimp');
const cron = require('node-cron');
const fetch = require('node-fetch');
const { Client } = require('discord.js');

// Commands are ran by using the $ prefix.
const prefix = "$";

client.commands = new Discord.Collection();

const commandFiles= fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// API Keys, blurred out for GitHub
var tok = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
var tenortok = "xxxxxxxxxx";

client.on('ready', () => {
    console.log('${client.user} SaguskyBot is online');
});

// Sends the funny davey jones gif every day at 10pm. Requested by a friend.
cron.schedule("0 22 * * *", async function(message) {
    const channel = client.channels.cache.get('810544988932276277')
    let url = `https://g.tenor.com/v1/search?q=daveyjones&key=${tenortok}&limit=8`
    let response = await fetch(url);
    let json = await response.json();
    channel.send(json.results[0].url);
})

client.on('message', async message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'kick') {
        let url = `https://g.tenor.com/v1/search?q=jessepinkmangas&key=${tenortok}&limit=8`
        let response = await fetch(url);
        let json = await response.json();
        message.channel.send(json.results[0].url);
        client.commands.get('kick').execute(message,args);
    }
    else if (command === 'ban') {
        let url = `https://g.tenor.com/v1/search?q=dodgethis&key=${tenortok}&limit=8`
        let response = await fetch(url);
        let json = await response.json();
        message.channel.send(json.results[0].url);
        client.commands.get('ban').execute(message,args);
    }
    else if (command === 'meme') {
        client.commands.get('meme').execute(message,args);
    }
   

})

client.on('message', (message) => {
    console.log('[${message.author.tag}]: &{message.content}');
    if (message.content === 'ping') {
        message.reply('pong');
    }
});


client.login(tok);



