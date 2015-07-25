

var TelegramBot = require('node-telegram-bot-api');

var telegram_token = '113320513:AAEGXK4B4p8p1Fb6MMPJkl_6A-lcVeXSej4';
// Setup polling way

var users = [];

var bot = new TelegramBot(telegram_token, {"polling":{"timeout": 1}});
var form = require('./forms/test_form1.json');
console.log(form);

bot.on('message', function (msg) {
	console.log(msg.text);
	if (msg.text == "/start") {
		users.push({"id":msg.chat.id, "form": form, "indexOfQuestion": 0});
		var user = findUser(msg.chat.id);
		console.log(user);
		sendQuestion(user);
	} else {
	
		var user = findUser(msg.chat.id);
	
		var correct = parsingAnswer(user, msg.text);
		console.log(correct);
		if (correct) {
			user.indexOfQuestion++;
			console.log(user.indexOfQuestion);
			if (user.indexOfQuestion == user.form.fields.length) {
				// Go to the next form
				user.indexOfQuestion = 0;
			}
			sendQuestion(user);
		} 
	}
	console.log(users);

});

function findUser(id) {
	console.log(id)
	for (i = 0; i < users.length; i++) {
		if (users[i].id == id)  {
			console.log(users[i])
			return users[i];
		}
	}

} 

function sendQuestion(user) {
	question = user.form.fields[user.indexOfQuestion];
	console.log(question);
	switch(question.type){
		case "statement":
			bot.sendMessage(user.id, question.question).then(function () {
				user.indexOfQuestion++;
				setTimeout(sendQuestion(user), 1000);
			});
			
			// sendQuestion(user);
			break;
		case "multiple_choice":
			choices = [];
			for (i=0; i<question.choices.length; i++) {
				choices.push([question.choices[i].label]);
			}
			console.log(choices);
			var opts = {reply_markup: JSON.stringify({
        		keyboard: choices, one_time_keyboard: true})}
			console.log(opts);
			bot.sendMessage(user.id, question.question, opts);
			break;
		case "dropdown":
			choices = [];
			for (i=0; i<question.choices.length; i++) {
				choices.push([question.choices[i].label]);
			}
			console.log(choices);
			var opts = {reply_markup: JSON.stringify({
        		keyboard: choices, one_time_keyboard: true})}
			console.log(opts);
			bot.sendMessage(user.id, question.question, opts);
			break;
		case "short_text":
			console.log(question.description);
			bot.sendMessage(user.id, question.question);
			break;
		case "long_text":
			console.log(question.description);
			bot.sendMessage(user.id, question.question);
			if(question.description)
				bot.sendMessage(user.id, question.description);
			break;
		case "rating":
			choices = [['⭐️','⭐️⭐️','⭐️⭐️⭐️'],['⭐️⭐️⭐️⭐️','⭐️⭐️⭐️⭐️⭐️']];
			console.log(choices);
			var opts = {reply_markup: JSON.stringify({
        		keyboard: choices, one_time_keyboard: true})}
			console.log(opts);
			bot.sendMessage(user.id, question.question, opts);
			break;
		case "yes_no":
			choices = [['Yes', 'No']];
			console.log(choices);
			var opts = {reply_markup: JSON.stringify({
        		keyboard: choices, one_time_keyboard: true})}
			console.log(opts);
			bot.sendMessage(user.id, question.question, opts);
			break;

		default:
			break;
	}

}

function parsingAnswer(user, text) {
	question = user.form.fields[user.indexOfQuestion];
	var correct = false;

	switch(question.type){
		case "multiple_choice":
			for (i=0; i<question.choices.length; i++) {
				if(question.choices[i].label == text)
					correct = true;
			}
			break;
		case "dropdown":
			for (i=0; i<question.choices.length; i++) {
				if (question.choices[i].label == text)
					correct = true;
			}
			break;
		case "short_text":
			if (text != '')
				correct = true;
			break;
		case "long_text":
			if (text != '')
				correct = true;
			break;
		case "rating":
			choices = ['⭐️','⭐️⭐️','⭐️⭐️⭐️','⭐️⭐️⭐️⭐️','⭐️⭐️⭐️⭐️⭐️'];
			for(i=0; i<choices.length; i++) {
				if(text == choices[i])
					correct = true;
			}
			break;
		case "yes_no":
			choices = ['Yes', 'No'];
			for(i=0; i<choices.length; i++) {
				if(text == choices[i])
					correct = true;
			}			console.log(choices);
			break;

		default:
			break;
	}
	if(!correct) {
		bot.sendSticker(user.id, "BQADBAADFQADyIsGAAEO_vKI0MR5bAI").then(function () {
			setTimeout(function () {
				bot.sendMessage(user.id, "Please choose one option!")
			}, 1000);
		})
	}

	return correct;
}

