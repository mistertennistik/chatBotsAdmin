// Accès aux données ////////////////////////////////////

const Chatbots = require('./Chatbots.js');


const Discord = require('discord.js');
const client = new Discord.Client();

var IntDiscord = require('./clientAdmin/InterfaceDiscord.js');
var IntRive = require('./clientAdmin/InterfaceRiveScript.js');

var chatbots = new Chatbots();
var chatbot;
/*
console.log("<<<<< chatbots issus de la BDD >>>>>>");
console.log(chatbots);
console.log("<<<<<<<<<<<-------------->>>>>>>>>>>>")
console.log(chatbots.getChatBot(1));*/

////////////////////////////////////////////////////////


var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
//var dao = require('dummyTagsDAO'); // in the node_modules directory





var app = express();

//https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());
var corsOptions = {
  origin: 'http://localhost:3030',
  methods: 'GET,POST,PUT,DELETE',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/chatbots', cors(corsOptions),function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json(chatbots.getChatBots());
});

app.get('/chatbot/:id', cors(corsOptions),function(req, res) {

    let chatbot = chatbots.getChatBot(parseInt(req.params.id))
    if(undefined!=chatbot)
    {
        res.setHeader('Content-Type', 'application/json');
		    res.json(chatbot);
    }
    else
    {
		    res.send(404, 'Page introuvable !');
	  }
});

app.post('/chatbot', cors(corsOptions), function(req, res) {

    if(req.is('json')) //on devrait toujours tester le type et aussi la taille!
    {
      
		    //var chatbot = chatbots.addChatBot(req.body);
        initChatbotAndInterfaces(req.body);
        res.setHeader('Content-Type', 'application/json');
        res.json(chatbot);

        chatbot.interfaces[0].ecouter();

        console.log("Done adding "+JSON.stringify(chatbot) );
	  }else{
      res.send(400, 'Bad Request !');
    }

});
app.put('/chatbot/:id', cors(corsOptions), function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    if(req.is('json')) //on devrait toujours tester le type et aussi la taille!
    {
        console.log(req.body);
		    var chatbot = chatbots.updateChatBot(req.body);
        if(undefined==chatbot){
          res.send(404, 'Page introuvable !');
        }else{
        	res.json(chatbot);
        	console.log("Done updating "+JSON.stringify(chatbot) );
	}
    }else{
      res.send(400, 'Bad Request !');
    }

});

app.delete('/chatbot/:id', cors(corsOptions),function(req, res) {
    let id = chatbots.deleteChatBot(parseInt(req.params.id));
	console.log("delete "+id+" "+req.params.id+" hop");
    if(undefined!=id){
        res.setHeader('Content-Type', 'application/json');
	res.send(200,'OK');
    }else{
	res.send(404, 'Page introuvable !');
	}
});




app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(8080, (err,data) => {
	if(err==undefined){
		console.log(`app listening on port ${8080}!`);
	}else{
		console.log(`ERROR : ${err}`);
	}
    
  });



/*
var IntDiscord = require('./clientAdmin/InterfaceDiscord.js');
var IntRive = require('./clientAdmin/InterfaceRiveScript.js');
*/
function initChatbotAndInterfaces(infoChatbot){
  let listInterface = infoChatbot.interfaces;
  let listInterfacesToPush = [];
  //mettre dans l'objet chatbot le bon chemin vers son cerveau correspondant à sa personnalité 
  let cerv = "./bot/brain1.rive";

  infoChatbot.cerveau = cerv;
  //token que l'on va récupérer avec notre fonction ProchainTokenLibre()
  let tok = "NTgxNDA3NjA5MDI2NzcyOTkz.XPZwdQ.nmgaItBgewkuli0rpXgmr3biFRA";

  console.log("DANS initChatbotAndInterfaces");
  console.log(infoChatbot);

  listInterface.forEach(function(item, index, array) {
    //il y aura autant d'embranchements que d'interfaces disponibles
    if(item == "Discord"){
      listInterfacesToPush.push(new IntDiscord(tok, cerv));
    }
    if(item == "OwnUX"){
      console.log('Je vais vers notre OWN UX')
      listInterfacesToPush.push('OwnUX');
    }
  });
  
  infoChatbot.interfaces = listInterfacesToPush;
  console.log("Voici les infos du chatBot : ");
  console.log(infoChatbot);
  chatbots.addChatBot(infoChatbot).then(()=>{
    chatbot.interfaces[0].ouvrir();
  chatbot.interfaces[0].ecouter();
  console.log(chatbot);
});
  
  console.log(chatbot.interfaces[0]);
  //chatbot.interfaces[0].ecouter();
}