class ChatBot{

	constructor(nom, cerveau){
		this.nom = nom;
		this.cerveau = cerveau;
		this.interfaces = new Map();
	}

	addInterfaces(interface){
		this.interfaces.push(interface);
	}

	delInterface(interface){
		let ind = this.interfaces.indexOf(interface);
	}

}