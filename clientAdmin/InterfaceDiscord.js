/////// NOTE : arrow notation are very important to use "this" in a callback. 
//Otherwise it will refers to the function itself


const Discord = require('discord.io');
const InterfaceRiveScript = require('./InterfaceRiveScript.js');


class InterfaceDiscord {


	constructor(token,cerveau,name){
		
		this.token = token;
		this.name = name;
		this.discordBot= new Discord.Client({
			token: this.token,
			autorun: true
		});

		this.brainInterface = new InterfaceRiveScript(cerveau);

	}

	init(){

		
		this.discordBot.on('ready',   (evt)=> {
			console.log('Connected');
			console.log('Logged in as: '+this.discordBot.username + ' - (' + this.discordBot.id + ')');
    		/*this.discordBot.editUserInfo({
                username: this.name,
            });*/
        });
		this.ecouter();
		
	}

	ecouter(){
		this.discordBot.on('message', (user, userID, channelID, message, evt) =>{
			console.log("VOIci le message :::");
			console.log(message);
			this.brainInterface.answer(user,message).then((mes)=>{
				if(userID != this.discordBot.id){
					this.parler(mes,channelID);
				}
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