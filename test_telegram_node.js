

var TelegramBot = require('node-telegram-bot-api');

var token = '122787136:AAHkWxINwx1Afh8j0X5-_MnF0ITRadeaf4A';
// Setup polling way

var history = [];


var bot = new TelegramBot(token, {"polling":{"timeout": 1}});
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  history.push({"id":msg.chat.id});
  console.log(msg.chat.id);
  console.log(msg.text);
  var opts = {
      reply_markup: JSON.stringify({
        keyboard: [
          ['Yes, you are the bot of my life ❤'],
          ['No, sorry there is another one...']]
      })
    };
  bot.sendMessage(chatId, "hola que ase?", opts);
});