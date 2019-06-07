/***
* Définition des URLS
***/

//Pour les tâches (serviceTODO)
const getBotsURL="http://localhost:8080/chatbots";
const getBotURL="http://localhost:8080/chatbot/";
const postBotURL="http://localhost:8080/chatbot";
const putBotURL="http://localhost:8080/chatbot/";
const deleteBotURL="http://localhost:8080/chatbot/";
const connectBotURL="http://localhost:8080/connect/";
const disconnectBotURL="http://localhost:8080/disconnect/";





/***
*Gestion des tâches --> serviceTODO
***/

let botToPost = {
    "id" : null,
    "nom" : "",
    "cerveau" : "", 
    "interfaces" : []
};

let botToPut = {
    "nom" : "",
    "cerveau" : "", 
    "interfaces" : []
};





const invocation = new XMLHttpRequest();

function getBot(id){
  if(invocation){
    invocation.open('GET', getBotURL+id, true);
    invocation.onreadystatechange = handler;
    invocation.send(null);
  }else{
    console.error("No Invocation TookPlace At All");
  }
}


function getAllBots(){

  console.log("<<<< Juste avant de faire le getAllBots sur le service>>>>");

  if(invocation){
    invocation.open('GET', getBotsURL, true);
    invocation.onreadystatechange = getAllBotsHandler;
    invocation.send(null);
  }else{
    console.error("No Invocation TookPlace At All");
  }
}

function postBot(){

  console.log("******** on est dans le post $$$$$$$$$$$$$")

  if(invocation){
    invocation.open('POST', postBotURL, true);
    invocation.setRequestHeader('Content-Type', 'application/json');
    invocation.onreadystatechange = handler;
    invocation.send(JSON.stringify(botToPost));
  }else{
    console.error("No Invocation TookPlace At All");
  }
}
function putBot(id){
  if(invocation){
    invocation.open('PUT', putBotURL+id, true);
    invocation.setRequestHeader('Content-Type', 'application/json');
    invocation.onreadystatechange = handler;
    invocation.send(JSON.stringify(botToPost));
  }else{
    console.error("No Invocation TookPlace At All");
  }
}
function deleteBot(id){
  if(invocation){
    invocation.open('DELETE', deleteBotURL+id, true);
    invocation.onreadystatechange = handler;
    invocation.send(null);
  }else{
    console.error("No Invocation TookPlace At All");
  }
}



function getAllBotsHandler(evtXHR){
  if (invocation.readyState == 4){
    if (invocation.status == 200){
  
  try{
          let response = JSON.stringify(JSON.parse(invocation.responseText),null,4);
          showAllBots(response);



  }catch(err){
    console.log("invocation.responseText "+invocation.responseText);  
  }
      
    }else{
      console.error("Invocation Errors Occured " + invocation.readyState + " and the status is " + invocation.status);
    }
  }else{
    console.log("currently the application is at" + invocation.readyState);
  }
}

function handler(evtXHR){
  if (invocation.readyState == 4){
    if (invocation.status == 200){
	
	try{
      		let response = JSON.stringify(invocation.responseText);
          console.log("VOICI la réponse :::: ");
		      console.log(response);



	}catch(err){
		console.log("invocation.responseText "+invocation.responseText);	
	}
      
    }else{
      console.error("Invocation Errors Occured " + invocation.readyState + " and the status is " + invocation.status);
    }
  }else{
    console.log("currently the application is at" + invocation.readyState);
  }
}




document.getElementById('createMyBot').addEventListener('click',createBot);
document.getElementById('input_updateBot').addEventListener('click',updateBot);
document.getElementById('input_getAllBots').addEventListener('click', getAllBots);
document.getElementById('input_updateBot').addEventListener('click',updateBot);
document.getElementById('input_deleteBot').addEventListener('click',beforeDeleteBot);
document.getElementById('connect').addEventListener('click',connectBot);
document.getElementById('disconnect').addEventListener('click',disconnectBot);



function createBot(){
  initialiseBot("post");
}
function updateBot(){
  //document.getElementById('div_updateBot').innerHTML = "";
  let id = document.getElementById('input_botID').value;

  if(id==null){
    document.getElementById('div_updateBot').innerHTML = "ID required";
  }else{
    initialiseBot("put",id);
  }
}

function beforeDeleteBot(){
  let id = document.getElementById('input_botID').value;
  deleteBot(id);
}

function connectBot(){
  console.log('on connectBOt');
  let id = document.getElementById('input_botID').value;
  if(invocation){
    invocation.open('PUT', connectBotURL+id, true);
    invocation.setRequestHeader('Content-Type', 'application/json');
    invocation.onreadystatechange = handler;
    invocation.send(JSON.stringify(botToPost));
  }else{
    console.error("No Invocation TookPlace At All");
  }
}

function disconnectBot(){
   console.log('on dicconnectBOt');
  let id = document.getElementById('input_botID').value;
  if(invocation){
    invocation.open('PUT', disconnectBotURL+id, true);
    invocation.setRequestHeader('Content-Type', 'application/json');
    invocation.onreadystatechange = handler;
    invocation.send(JSON.stringify(botToPost));
  }else{
    console.error("No Invocation TookPlace At All");
  }
}

function showAllBots(jsonBots){
  console.log("$$$$$$$$$")
  document.getElementById('pre_allBots').innerHTML = jsonBots;
}

function initialiseBot(postOrPut,id=9999999999999){
  //récupère le nom du bot
  botToPost.nom = document.getElementById("name").value;

  //récupère le cerveau
  botToPost.cerveau = document.getElementById("personnality").value;

  //récupère les interfaces
  let interface1 = document.getElementById("OwnUX");
  let interface2 = document.getElementById("Discord");
  botToPost.interfaces = [];
  if (interface1.checked) {
      botToPost.interfaces.push("OwnUX")
      console.log("La case OwnUX est cochée");
    }

    if(interface2.checked){
      botToPost.interfaces.push("Discord");
      //console.log("La case Discord est cochée");

    }

    console.log("<<<<<<<<< BOT INITIALISÉ >>>>>>>>>>>");
    console.log(botToPost);

    if(postOrPut=="post"){
      postBot();
    }else{//on veut put
      botToPost.id=parseInt(id);
      putBot(id);
    }
    
    
}