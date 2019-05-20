// Accès aux données //

const Chatbots = require('./Chatbots.js');


const Discord = require('discord.js');
const client = new Discord.Client();



var chatbots = new Chatbots();

console.log("<<<<< chatbots issus de la BDD >>>>>>");
console.log(chatbots);
console.log("<<<<<<<<<<<-------------->>>>>>>>>>>>")
console.log(chatbots.getChatBot(1));