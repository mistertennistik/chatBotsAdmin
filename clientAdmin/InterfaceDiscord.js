const Discord = require('discord.io');
//var talkback = new RiveScript();
var InterfaceRiveScript = require('./InterfaceRiveScript.js');


class InterfaceDiscord {


		constructor(token,cerveau){
		
		

		

		this.brainInterface = new InterfaceRiveScript(cerveau);

		this.lol();
		this.ecouter();



	}

	async lol(){
		
		this.discordBot = new Discord.Client({
 							token: "NTgxNDA3NjA5MDI2NzcyOTkz.XPZwdQ.nmgaItBgewkuli0rpXgmr3biFRA",
 							autorun: true
						});

		await console.log("________ ON EST DANS LE INIT _________")
		 await this.discordBot.on('ready', async function (evt) {
    									await console.log('Connected');
    									await console.log('Logged in as: '+this.discordBot.username + ' - (' + this.discordBot.id + ')');
    								});
		 await console.log("________ ON A FINI LE INIT _________")
	}

	ecouter(){
		this.discordBot.on('message', function (user, userID, channelID, message, evt) {
			this.brainInterface.answer(user,message).then((mes)=>{
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