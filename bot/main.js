var Discord = require('discord.io');
var auth = require('./auth.json');
var RiveScript = require('rivescript');
var talkback = new RiveScript();


let response; // stocke la réponse du bot pour l'affichage dans le terminal


talkback.loadFile("brain1.rive").then(loading_done).catch(loading_error);

function loading_done (batch_num) {
    console.log("RIVE: Batch #" + batch_num + " has finished loading!");

    talkback.sortReplies();

    talkback.reply("local-user", "hello").then((msg)=>{
        console.log("The bot says: " + msg);
    });
    

}

function loading_error (error) {
    console.log("Error when loading files: " + error);
}

// Initialize Discord Bot
var bot = new Discord.Client({
 token: auth.token,
 autorun: true
});
bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: '+bot.username + ' - (' + bot.id + ')');

});
bot.on('message', function (user, userID, channelID, message, evt) {

    function riveMsg(triggr) { 
    // A function I wrote to make calling triggers easier
    // usage: riveMsg("hello", 0) will print a message using the +hello rive trigger

    if(userID != bot.id){
     talkback.reply(user, triggr).then((mes)=>{

        response = mes;
        bot.sendMessage({
            to: channelID,
            message: mes
        }); 

        console.log('-- I said :: '+ response);
    });

     console.log('-- Hey, someone talked to me! They said: ' + message);

 }


}



    riveMsg(message); // proccess

}


);