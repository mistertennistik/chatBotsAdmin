var Discord = require('discord.io');
var talkback = new RiveScript();
var InterfaceRiveScript = require(////\\\\\\\)


class InterfaceDiscord {


	constructor(token,cerveau){
		this.discordBot = new Discord.Client({
 							token: token,
 							autorun: false
						});
		//ouvrir();

		this.discordBot.on('ready', function (evt) {
    									console.log('Connected');
    									console.log('Logged in as: '+this.discordBot.username + ' - (' + this.discordBot.id + ')');
    								});

		this.brainInterface = new InterfaceRiveScript(cerveau);



	}
	ecouter(){
		this.discordBot.on('message', function (user, userID, channelID, message, evt) {
			this.brainInterface.answer(user,message).then((mes){
				parler(mes,channelID);
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