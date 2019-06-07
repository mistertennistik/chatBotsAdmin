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
//updateTokens(chatbots.getChatBot(1));

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
        var chatbot = updateChatbot(req.body);
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
  console.log("!*!*!*!*!*! updating token : ")
  updateTokens(chatbots.getChatBot(parseInt(req.params.id)));
  let id = chatbots.deleteChatBot(parseInt(req.params.id));
	console.log("delete "+id+" "+req.params.id+" hop");
    if(undefined!=id){
        res.setHeader('Content-Type', 'application/json');
	res.send(200,'OK');
    }else{
	res.send(404, 'Page introuvable !');
	}
});



app.put('/connect/:id', cors(corsOptions), function(req,res){

  res.setHeader('Content-Type', 'application/json');
    if(req.is('json')) //on devrait toujours tester le type et aussi la taille!
    {
        let cB = chatbots.getChatBot(req.body.id);
        connect(cB);
        if(undefined==chatbot){
          res.send(404, 'Page introuvable !');
        }else{
          res.json(chatbot);
          console.log("Done updating "+JSON.stringify(chatbot) );
  }
    }else{
      res.send(400, 'Bad Request !');
    }


}

);

app.put('/disconnect/:id', cors(corsOptions), function(req,res){

  res.setHeader('Content-Type', 'application/json');
    if(req.is('json')) //on devrait toujours tester le type et aussi la taille!
    {

        let cB = chatbots.getChatBot(req.body.id);
        disconnect(cB);
        if(undefined==chatbot){
          res.send(404, 'Page introuvable !');
        }else{
          res.json(chatbot);
          console.log("Done updating "+JSON.stringify(chatbot) );
  }
    }else{
      res.send(400, 'Bad Request !');
    }


}

);

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

function updateTokens(chatbot){
  console.log("\nEtat actuel des listes");
  console.log(usedToken);
  console.log(availabletoken);
  let tokenTmp;
  chatbot.interfaces.forEach(function(element){
    if (element instanceof IntDiscord){
      tokenTmp = element.token;
      console.log("=======>>> This is the token"+tokenTmp);  
      fromUsedToAvailable(tokenTmp);    
    }
  });
  console.log("\nEtat des listes en fin de procédure");
  console.log(usedToken);
  console.log(availabletoken);

}

function fromUsedToAvailable(usedTok){
  if (usedToken.length == 1){
    usedToken = []
  }
  else{
    for (var i=usedToken.length-1; i>=0; i--) {
      if (usedToken[i] === usedTok) {
        usedToken.splice(i, 1);
      }
    }
  }
  availabletoken.push(usedTok);
}


function arrayRemove(arr, value) {
   return arr.filter(function(ele){
       return ele != value;
   });
}



async function initChatBotAndInterfaces(chatBotDatas){
  let listInterface = chatBotDatas.interfaces;
  let listInterfacesToPush=[];

  let cerv = getBrainPath(chatBotDatas.cerveau);

  chatBotDatas.cerveau = cerv;



  await listInterface.forEach( async function(item, index, array) {
    //il y aura autant d'embranchements que d'interfaces disponibles
    if(item == "Discord"){
      let tok = nextAvailableToken();
      let discInt = await new IntDiscord(tok, cerv) // ne pas oublier nom
      discInt.init();
      await listInterfacesToPush.push(discInt);
    }
    if(item == "OwnUX"){
      console.log('Je vais vers notre OWN UX')
      listInterfacesToPush.push('OwnUX');
    }
  });

  chatBotDatas.interfaces = listInterfacesToPush;
  chatbot = chatbots.addChatBot(chatBotDatas);
  console.log(chatbot);

}


async function updateChatbot(chatBotDatas){

  // est ce que la version précédente du bot avait (Discord, OwnUX..  ?)
  let hasPreviousDiscord = false;
  let hasPreviousOwnUX = false;

  // est ce que la nouvelle version du bot souhaite (Discord, OwnUX..  ?)
  let wantDiscord = false;
  let wantOwnUX = false;

  //on récupère le chatbot du mock
  let cB = chatbots.getChatBot(chatBotDatas.id);
  console.log("voici le id du chatbot récupéré : "+chatBotDatas.id);
  console.log("\n");
  console.log(cB);

  //est-ce que le brain a changé ?
  let hasBrainChanged = false;

  //est ce que le nom du bot a changé ? 
  let hasNameChanged = false;
  // on vérifie quelles intefaces possède déjà le bot
  cB.interfaces.forEach(function (item2, index,array){
      if(item2 instanceof IntDiscord){
        hasPreviousDiscord=true;
      }else if(item2 == 'OwnUX'){
        hasPreviousOwnUX = true;
      }
    });

  if (chatBotDatas.cerveau != cB.cerveau){
    // on change éventuellement son cerveau
    cB.cerveau = getBrainPath(chatBotDatas.cerveau);
    hasBrainChanged = true;
  }

  // on change éventuellement son cerveau

  if(cB.nom != chatBotDatas.nom){
    hasNameChanged = true;
    cB.nom = chatBotDatas.nom
  }
  

  //on remet à jour les interfaces
  await chatBotDatas.interfaces.forEach( async function(item, index, array) {

    //il y aura autant d'embranchements que d'interfaces disponibles
    if(item == "Discord"){
      wantDiscord = true;
      if(!hasPreviousDiscord){
        let tokTmp = nextAvailableToken(); //on estime qu'il y a assez de token libre
        let discInt = await new IntDiscord(tokTmp, cB.cerveau) // ne pas oublier nom
        discInt.init();
        await cB.interfaces.push(discInt);
      }
      else{
        if(hasBrainChanged){
          cB.interfaces.forEach((item, index, array)=>{
            if(item instanceof IntDiscord){
              item.changerBrain(cB.cerveau);
            }
          })
        }
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
      if(!hasPreviousOwnUX){
        console.log('Je vais vers notre OWN UX')
        await cB.interfaces.push('OwnUX');
      }
      
    }

  });

  if(hasPreviousDiscord && !wantDiscord){
    let indToDelete;
    updateTokens(cB);//on libere le token
    cB.interfaces.forEach((item, index, array)=>{
      if (item instanceof IntDiscord){
        indToDelete = index;
      }
    })
    cB.interfaces.splice(indToDelete,1);
    //on supprime l'interface Discord
  }
  if(hasPreviousOwnUX && !wantOwnUX){
    //on supprime l'interface OwnUX
    let ind;
    cB.interfaces.forEach((item, index, array)=>{
      if (item =='OwnUX'){
        ind = index;
      }
    })
    cB.interfaces.splice(ind,1);
  }


  return chatbots.updateChatBot(cB);
  //on update finalement le chatBot dans chatBots

}


function connect(cB){
  cB.interfaces.forEach((item, index, array)=>{
      if(item instanceof IntDiscord){
        item.ouvrir();
      }
      if(item=='OwnUX'){
        console.log(" On ouvre la connection pour OwnUX");
      }
  });
}

function disconnect(){
  cB.interfaces.forEach((item, index, array)=>{
      if(item instanceof IntDiscord){
        item.fermer();
      }
      if(item=='OwnUX'){
        console.log(" On ferme la connection pour OwnUX");
      }
  });
}
    
    
