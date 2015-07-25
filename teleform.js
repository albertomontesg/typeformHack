
var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var _ = require('underscore');

var telegram_token = '115389597:AAE279QG_TZGnIBk-wPXpcP1ouPZv_n6kDM';
var typeform_api_key = '0713948dae86d178178f7c495c96c2fe';

var users = [];

var forms = new Array(5);
create_form(require('./forms/form1.json'), function(response) {
	forms[0] = response;
})
create_form(require('./forms/form2_1.json'), function(response) {
	forms[1] = response;
})
create_form(require('./forms/form2_2.json'), function(response) {
	forms[2] = response;
})
create_form(require('./forms/form3_1.json'), function(response) {
	forms[3] = response;
})
create_form(require('./forms/form3_2.json'), function(response) {
	forms[4] = response;
})


var bot = new TelegramBot(telegram_token, {"polling":{"timeout": 1}});
// var form = require('./forms/test_form3.json');
// console.log(form);

bot.on('message', function (msg) {
	console.log(msg.text);
	if (msg.text == "/start") {
		users.push({"id":msg.chat.id, "form": [], "indexOfQuestion": 0, "indexOfForm": 0});
		user = findUser(msg.chat.id);
		user.form.push(forms[0]);
		console.log(user.form[0]);
		sendQuestion(user);

	} else {
	
		user = findUser(msg.chat.id);
		console.log(user);
		correct = parsingAnswer(user, msg.text);
		console.log(correct);
		if (correct) {
			user.indexOfQuestion++;
			console.log(user.indexOfQuestion);
			console.log(user.form[user.indexOfForm].fields.length)
			if (user.indexOfQuestion == user.form[user.indexOfForm].fields.length) {
				// Go to the next form
				console.log('end of form')
				console.log(user.form[user.indexOfForm].fields[user.indexOfQuestion-1])
				if(user.indexOfForm == 0 &&
					user.form[user.indexOfForm].fields[user.indexOfQuestion-1].answer == 'Yes')
					user.form.push(forms[1]);
				else if(user.indexOfForm == 0)
					user.form.push(forms[2]);
				else if (user.indexOfForm == 1 &&
					user.form[user.indexOfForm].fields[user.indexOfQuestion-1].answer >5 '')
					user.form.push(forms[3]);
				else if (user.indexOfForm == 2)
					user.form.push(forms[4]);
				else {
					user.isFinished = true;
					break;
				}

				user.indexOfForm++;
				user.indexOfQuestion = 0;
			}
			if (!user.isFinished) {
				console.log(user);
				sendQuestion(user);
			}
			
		} 
	}
});

function findUser(id) {
	// console.log(id)
	for (i = 0; i < users.length; i++) {
		if (users[i].id == id)  {
			console.log(users[i])
			return users[i];
		}
	}

} 

function sendQuestion(user) {
	var question = user.form[user.indexOfForm].fields[user.indexOfQuestion];
	console.log('sending question to user');
	
	console.log(question);

	switch(question.type){
		case "statement":
			bot.sendMessage(user.id, question.question).then(function () {
				user.indexOfQuestion++;
				if(!user.form[user.indexOfForm].fields[user.indexOfQuestion]) {
					bot.sendSticker(user.id, "BQADBAADQgADyIsGAAE6y1PcFdSaFQI");
				} else
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
		case "legal":
 			choices = [['I accept', 'I don\'t accept']];
 			console.log(choices);
 			var opts = {reply_markup: JSON.stringify({
 				keyboard: choices, one_time_keyboard: true})}
 			console.log(opts);
			bot.sendMessage(user.id, question.question, opts);
			break;

		case "website":
			console.log(question.description);
			bot.sendMessage(user.id, question.question);
			break;

		case "number":
			console.log(question.description);
			bot.sendMessage(user.id, question.question);
			break;

		case "email":
			console.log(question.description);
			bot.sendMessage(user.id, question.question);
			break;

		case "opinion_scale":
			choices = [['1','2','3','4','5'],['6','7','8','9','10']];
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
	question = user.form[user.indexOfForm].fields[user.indexOfQuestion];
	var correct = false;

	var choices = null;
	console.log(text);
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
			if (text == 'Yes' || text == 'No')
				correct = true;		
			break;

		case "legal":
			if (text == "I accept" || text == "I don\'t accept")
				correct = true;
			break;

		case "number":
			if (isFinite(text) && !isNaN(text))
				correct = true;
			break;

		case "email":
			if (text.indexOf("@") > -1)
				correct = true;
			break;

		case "website":
			if(text != '')
				correct = true;

		case "opinion_scale":
			if (text == "1" || text == "2" || text == "3" || text == "4" || text == "5" || 
				text == "6" || text == "7" || text == "8" || text == "9" || text == "10")
				correct = true;
			break;
		default:
			break;
	}
	console.log(correct);
	if (correct) {
		user.form[user.indexOfForm].fields[user.indexOfQuestion].answer = text;
	}
	if(!correct) {
		if (question.type == "number") {
			bot.sendSticker(user.id, "BQADBAADFQADyIsGAAEO_vKI0MR5bAI").then(function () {
				setTimeout(function () {
					bot.sendMessage(user.id, "Please introduce a number!");
				}, 1000);
			})
		} else if(question.type == "email") {
			bot.sendSticker(user.id, "BQADBAADFQADyIsGAAEO_vKI0MR5bAI").then(function () {
				setTimeout(function () {
					bot.sendMessage(user.id, "Please introduce an email!");
				}, 1000);
			})
		} else if(question.type == "email") {
			bot.sendSticker(user.id, "BQADBAADFQADyIsGAAEO_vKI0MR5bAI").then(function () {
				setTimeout(function () {
					bot.sendMessage(user.id, "Just say Yes or No!");
				}, 1000);
			})
		} else {
			bot.sendSticker(user.id, "BQADBAADFQADyIsGAAEO_vKI0MR5bAI").then(function () {
				setTimeout(function () {
					bot.sendMessage(user.id, "Please choose one option!")
				}, 1000);
			})
		}	
	}
	console.log(correct)
	return correct;
}

function create_form(form, success) {
	//The url of the API endpoint
	console.log('called create_form');
	request.post('https://api.typeform.io/v0.3/forms', {
			//Including the typeform as JSON
			json: form,
			headers: {
				//The API-key, is a secret, do not share
				'X-API-TOKEN': typeform_api_key
			}
		}, function(error, response, body) {
			console.log('got response');
			console.log(error);
			console.log(body);
			//When we receive an response from the API-call we make above,
			//call the success() callback with the data parsed from JSON
			success(body);
		});
}