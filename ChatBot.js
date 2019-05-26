class ChatBot{
  constructor(data){ 
    if(undefined != data.id) {
      this.id = data.id;
    } else {
      this.id = parseInt(    Math.floor(Math.random() * Math.floor(100000))     );
    }
    if(undefined != data.nom) {
      this.nom= data.nom;
    } else {
      this.nom= "";
    }
    if(undefined != data.cerveau) {
      this.cerveau = data.cerveau;
    } else {
      this.cerveau = "";
    }
    if(undefined != data.interfaces) {
      this.interfaces = data.interfaces;
    } else {
      this.interfaces = [];
    }
  }
}

module.exports = ChatBot;