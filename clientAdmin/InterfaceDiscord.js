const Discord = require('discord.io');
//var talkback = new RiveScript();
var InterfaceRiveScript = require('./InterfaceRiveScript.js');


class InterfaceDiscord {


		constructor(token,cerveau){
		
		this.token = token;
		
		this.discordBot= new Discord.Client({
              token: this.token,
              autorun: true
            });

		console.log("c'est la brainInterface :::: ")
		console.log(this.brainInterface);

		
		this.brainInterface = new InterfaceRiveScript(cerveau);

		//this.ecouter();



	}

	async init(){

		
		 this.discordBot.on('ready',   (evt)=> {
    									console.log('Connected');
    								  console.log('Logged in as: '+this.discordBot.username + ' - (' + this.discordBot.id + ')');
    								});
		 this.ecouter();
		
	}

	ecouter(){
		this.discordBot.on('message', (user, userID, channelID, message, evt) =>{
			console.log("VOIci le message :::");
			console.log(message);
			this.brainInterface.answer(user,message).then((mes)=>{
				this.parler(mes,channelID);
			}
	
				);
		});
	}

	parler(mes,channelID){
		this.discordBot.sendMessage({
            to: channelID,
            message: mes
        }); 
	}

	ouvrir(){
		this.discordBot.connect();

		console.log(this.discordBot.username + ' - (' + this.discordBot.id + ')'+"bot is connected");
	}

	fermer(){
		this.discordBot.disconnect();
		console.log(this.discordBot.username + ' - (' + this.discordBot.id + ')'+"bot has been disconnected");
	}
	
}

module.exports = InterfaceDiscord;