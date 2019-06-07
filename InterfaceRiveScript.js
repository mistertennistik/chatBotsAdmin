var RiveScript = require('rivescript');
var rs = new RiveScript();


class InterfaceRiveScript{
	

	constructor(brain){
		// brain est une string de la forme "./brain1.rive"
		// c'est le cerveau qui va être utilisé
		rs.loadFile(brain).then(loading_done).catch(loading_error);

		function loading_done (batch_num) {
			console.log("RIVE has finished loading!");
			rs.sortReplies();
		}

		function loading_error (error) {
			console.log("Error when loading files: " + error);
		}
	}


	answer(user, message){
		return rs.reply(user, message);
	}

	reinit(){
		rs = new RiveScript();
	}

}





module.exports = InterfaceRiveScript;