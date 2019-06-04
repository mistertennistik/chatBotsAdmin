// Accès aux données ////////////////////////////////////

const Chatbots = require('./ChatBots.js');
const Chatbot = require('./ChatBot.js')

const Discord = require('discord.io');


var InterfaceRiveScript = require('./clientAdmin/InterfaceRiveScript.js');

//var IntDiscord = require('./clientAdmin/InterfaceDiscord.js');
//var IntRive = require('./clientAdmin/InterfaceRiveScript.js');

var chatbots = new Chatbots();
var chatbot=new Chatbot({});

let discordInterface = {};
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
async function initChatbotAndInterfaces(infoChatbot){
  let listInterface = infoChatbot.interfaces;
  let listInterfacesToPush = [];
  //mettre dans l'objet chatbot le bon chemin vers son cerveau correspondant à sa personnalité 
  let cerv = "./bot/brain1.rive";

  infoChatbot.cerveau = cerv;
  //token que l'on va récupérer avec notre fonction ProchainTokenLibre()
  let tok = "NTgxNDA3NjA5MDI2NzcyOTkz.XPZwdQ.nmgaItBgewkuli0rpXgmr3biFRA";


    await listInterface.forEach(async function(item, index, array) {
    //il y aura autant d'embranchements que d'interfaces disponibles
    if(item == "Discord"){
      await constructeur(cerv, tok);
    }
    if(item == "OwnUX"){
      console.log('Je vais vers notre OWN UX')
      listInterfacesToPush.push('OwnUX');
    }
  });
  
infoChatbot.interfaces = discordInterface;
console.log(infoChatbot.interfaces);

 chatbot = chatbots.addChatBot(infoChatbot);

   //chatbot.interfaces
  console.log(chatbot);

  
  //console.log(chatbot.interfaces[0]);
  //chatbot.interfaces[0].ecouter();
}






async function constructeur(cerveau,token){
discordInterface.brainInterface =  new InterfaceRiveScript(cerveau);

    discordInterface.discordBot = await new Discord.Client({
              token: token,
              autorun: true
            });

    await discordInterface.discordBot.on('ready', function (evt) {
                      console.log('Connected');
                      console.log('Logged in as: '+discordInterface.discordBot.username + ' - (' + discordInterface.discordBot.id + ')');
                    });

    await discordInterface.discordBot.on('message', function (user, userID, channelID, message, evt) {
      discordInterface.brainInterface.answer(user,message).then((mes)=>{

        if(userID != discordInterface.discordBot.id){
        parler(mes,channelID);}
      }
  
        );
    });
    

}


function parler(mes,channelID){
  discordInterface.discordBot.sendMessage({
            to: channelID,
            message: mes
        }); 
}


    
    

    


    

/*  async lol(){
    
  

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
  }*/