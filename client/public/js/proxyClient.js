/***
* Définition des URLS
***/

//Pour les tâches (serviceTODO)
const getBotsURL="http://localhost:8080/chatbots";
const getBotURL="http://localhost:8080/chatbot/";
const postBotURL="http://localhost:8080/chatbot";
const putBotURL="http://localhost:8080/chatbot/";
const deleteBotURL="http://localhost:8080/chatbot/";





/***
*Gestion des tâches --> serviceTODO
***/

let botToPost = {
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
    invocation.onreadystatechange = handler;
    invocation.send(null);
  }else{
    console.error("No Invocation TookPlace At All");
  }
}

function postBot(){

  console.log("on est dans le post $$$$$$$$$$$$$")

  if(invocation){
    invocation.open('POST', postBotURL, true);
    invocation.setRequestHeader('Content-Type', 'application/json');
    invocation.onreadystatechange = handler;
    invocation.send(JSON.stringify(botToPost));
  }else{
    console.error("No Invocation TookPlace At All");
  }
}
function putBot(id){ // A faire
  if(invocation){
    invocation.open('PUT', putBotURL+id, true);
    invocation.setRequestHeader('Content-Type', 'application/json');
    invocation.onreadystatechange = handler;
    invocation.send(JSON.stringify(botToPut));
  }else{
    console.error("No Invocation TookPlace At All");
  }
}
function deleteTask(id){
  if(invocation){
    invocation.open('DELETE', deleteBotURL+id, true);
    invocation.onreadystatechange = handler;
    invocation.send(null);
  }else{
    console.error("No Invocation TookPlace At All");
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




document.getElementById('createMyBot').addEventListener('click',initialiseBot);
//document.getElementById('updateMyBot').addEventListener('click',updateBot);
document.getElementById('input_getAllBots').addEventListener('click', getAllBots);

function updateBot(){

}



function initialiseBot(){
  //récupère le nom du bot
  botToPost.nom = document.getElementById("name").value;

  //récupère le cerveau
  botToPost.cerveau = document.getElementById("personnality").value;

  //récupère les interfaces
  let interface1 = document.getElementById("OwnUX");
  let interface2 = document.getElementById("Discord");
  if (interface1.checked) {
      botToPost.interfaces.push("OwnUX")
      //console.log("La case OwnUX est cochée");
    }

    if(interface2.checked){
      botToPost.interfaces.push("Discord");
      //console.log("La case Discord est cochée");

    }

    console.log("<<<<<<<<< BOT INITIALISÉ >>>>>>>>>>>");
    console.log(botToPost);

    postBot();
    
}