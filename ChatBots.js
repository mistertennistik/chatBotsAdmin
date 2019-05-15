const ChatBot = require("./ChatBot.js");
const data = require("./data.json");


class ChatBots{
  constructor(){
    this.chatbots = new Map();
    data.forEach((item, index, array) => {
      let newChatBot = new ChatBot(item);
      this.chatbots.set(newChatBot.id,newChatBot);
    });
  }
  get size(){
    return this.chatbots.size;
  }
  addChatBot(chatbot){
    let newChatBot = new ChatBot(chatbot);
    console.log("addChatBot :"+JSON.stringify(newChatBot));
    this.chatbots.set(newChatBot.id,newChatBot);
    return this.getChatBot(newChatBot.id);
  }
  getChatBot(id){
    this.chatbots.forEach(logMapElements);
    console.log(typeof id);
    console.log("getting chatbots with id "+id+" : "+JSON.stringify(this.chatbots.get(id)));
    return this.chatbots.get(id);
  }
  deleteChatBot(id){
    this.chatbots.forEach(logMapElements);
    let chatbot = this.chatbots.get(id);
	console.log("chatbot :"+JSON.stringify(chatbot));
    if(undefined!=chatbot){
      this.chatbots.delete(id);
      return id;
    } else {
      return undefined;
    }
  }
  updateChatBot(updatedChatBot){
    const hasChatBot = this.chatbots.has(updatedChatBot.id);
    if(hasChatBot){
      this.chatbots.set(updatedChatBot.id,updatedChatBot);
      return updatedChatBot;
    } else {
      return undefined;
    }
  }
  getChatBots(){
    let tabChatBots = [];
    for (const v of this.chatbots.values()) {
      tabChatBots.push(v);
    }
    return tabChatBots;
  }
  deleteChatBots(){
    this.chatbots.clear();
  }

}

function logMapElements(value, key, map) {
  console.log("m["+key+"] = "+JSON.stringify(value));
}


module.exports = ChatBots;