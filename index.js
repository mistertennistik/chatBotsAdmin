// Accès aux données ////////////////////////////////////

const Chatbots = require('./ChatBots.js');
const Chatbot = require('./ChatBot.js');
const tokens = require('./auth.json');

//const Discord = require('discord.io');


const InterfaceRiveScript = require('./InterfaceRiveScript.js');
const IntDiscord = require('./InterfaceDiscord.js');


var chatbots = new Chatbots();
var chatbot=new Chatbot({});

var availabletoken = [];
var usedToken = [];
initializeTokens(); //initialisation de la liste 'availabletoken'


var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');



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
         initChatBotAndInterfaces(req.body);
        res.setHeader('Content-Type', 'application/json');
        res.json(chatbot);

        //chatbot.interfaces[0].ecouter();

        console.log("Done adding "+JSON.stringify(chatbot) );
	  }else{
      res.send(400, 'Bad Request !');
    }

});
app.put('/chatbot/:id', cors(corsOptions), function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    if(req.is('json')) //on devrait toujours tester le type et aussi la taille!
    {

        console.log('-------- On est dans le put ::: ------')
        console.log(req.body);
        updateChatbot(req.body);
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

function initializeTokens(){
  availabletoken = tokens;
}

function nextAvailableToken(){
  if (availabletoken.length > 0){
    let tokenTmp = availabletoken.shift(); // supprime le premier élément de la liste et le retourne
    usedToken.push(tokenTmp);

    return tokenTmp;
  }
  else{
    console.log('Plus de tokens valides');
  }
}

function getBrainPath(brainFromBody){
  if (brainFromBody == 'b1'){
    return "./brains/brain1.rive"
  }
  else if (brainFromBody == 'b2'){
    return "./brains/brain2.rive"  
  }
  else if (brainFromBody == 'b3'){
    return "./brains/brain3.rive"
  }
  else if (brainFromBody == 'b4'){
    return "./brains/brain4.rive"
  }
}




async function initChatBotAndInterfaces(chatBotDatas){
  let listInterface = chatBotDatas.interfaces;
  let listInterfacesToPush=[];

  let cerv = getBrainPath(chatBotDatas.cerveau);

  chatBotDatas.cerveau = cerv;
  let tok = nextAvailableToken();



  await listInterface.forEach( async function(item, index, array) {
    //il y aura autant d'embranchements que d'interfaces disponibles
    if(item == "Discord"){
      let discInt = await new IntDiscord(tok, cerv) // ne pas oublier nom
      await listInterfacesToPush.push(discInt);
    }
    if(item == "OwnUX"){
      console.log('Je vais vers notre OWN UX')
      listInterfacesToPush.push('OwnUX');
    }
  });

  chatBotDatas.interfaces = listInterfacesToPush;
  chatbot = chatbots.addChatBot(chatBotDatas);
  chatbot.interfaces[0].init();
  console.log(chatbot);

}


async function updateChatbot(chatBotDatas){

  // est ce que la version précédente du bot avait (Discord, OwnUX..  ?)
  let hasPreviousDiscord = false;
  let hasPreviousOwnUX = false;

  // est ce que la nouvelle version du bot souhaite (Discord, OwnUX..  ?)
  let wantDiscord = false;
  let wantOwnUX = false;


  //est ce que le nom du bot a changé ? 
  let hasNameChanged = false;
  // on vérifie quelles intefaces possède déjà le bot
  cB.interfaces.forEach(function (item2, index,array){
      if(item2 instanceof IntDiscord){
        hasDiscord=true;
      }else if(item2 == 'OwnUX'){
        hasOwnUX = true;
      }
    });

  //on récupère le chatbot du mock
  let cB = chatbots.getChatBot(chatBotDatas.id);

  // on change éventuellement son cerveau
  cB = getBrainPath(chatBotDatas.cerveau);

  // on change éventuellement son cerveau

  if(cB.nom != chatBotDatas.nom){
    hasNameChanged = true;
    cB.nom = chatBotDatas.nom
  }
  

  //on remet à jour les interfaces
  await listInterface.forEach( async function(item, index, array) {

    

    //il y aura autant d'embranchements que d'interfaces disponibles
    if(item == "Discord"){
      wantDiscord = true;
      if(!hasDiscord){
        let discInt = await new IntDiscord(tok, cerv) // ne pas oublier nom
        await cB.push(discInt);
      }
      if(hasNameChanged){
        cB.interfaces.forEach((item, index, array)=>{
            if(item instanceof IntDiscord){
              item.changerNom(cB.nom);
            }
        })
      }
    }

    if(item == "OwnUX"){
      wantOwnUX = true;
      if(!hasOwnUX){
        console.log('Je vais vers notre OWN UX')
        listInterfacesToPush.push('OwnUX');
      }
      
    }

  });

  if(hasPreviousDiscord and !wantDiscord){
    //on libere le token
    //on supprime l'interface Discord
  }
  if(hasPreviousOwnUX and !wantOwnUX){
    //on supprime l'interface OwnUX
  }


  //on update finalement le chatBot dans chatBots

}
    
    
