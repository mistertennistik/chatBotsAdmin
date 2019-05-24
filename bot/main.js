var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var talkback = new RiveScript();


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

talkback.loadFile("brain1.rive").then(loading_done).catch(loading_error);

function loading_done (batch_num) {
    console.log("RIVE: Batch #" + batch_num + " has finished loading!");

    talkback.sortReplies();

    var reply = talkback.reply("local-user", "hello");
    console.log("The bot says: " + reply);

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
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {

    function riveMsg(triggr) { 
    // A function I wrote to make calling triggers easier
    // usage: riveMsg("hello", 0) will print a message using the +hello rive trigger
        this.msg = talkback.reply(user, triggr)
        bot.sendMessage({
                    to: channelID,
                    message: this.msg
                }); 
    }
    
    
    
    riveMsg(message); // proccess

    // for debugging
    console.log('-- Hey, someone talked to me! They said: ' + message);
    console.log('-- I said: ' + riveMsg.msg);

    }


    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    /*if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
         }
     }*/

);