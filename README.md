# typeformHack
Application to run a Telegram Bot which asks a form to the user who are talking with. The forms are based on TypeForm I/O API.

The Telegram bot accepts all kind of questions defined at the Typeform API and also take advantatge of the multiple key layout available on the Telegram API.

### Usage
At the form folder you'll found the forms ready to be registered at Typeform API, and then be asked by the bot.

To get ready to use it, it would be necessary to have a token key for the TypeForm API and put it on the ```typeform_api_key``` variable. To create the key you can visit: http://typeform.io/

Also it would be necessary to have a Telegram Bot created with its corresponding token key. To create a new Bot you can use the Telegram Bot: @BotFather. Once you have the key you should place it on the ```telegram_token``` variable.

### Future Development
This code was made for the Typeform I/O Summer Hackathon and also was design to adapt the form dinamically depending on previous answers. This dinamic forms are not supperted by Typeform API, so my idea should be to make this Telegram Bot able to ask for every form. So for start a form, with a command giving the form id it should be necessary to make the form on this bot. This have applications to whoever wants to ask its forms by Telegram, so give a deeplink to the user with the id of the form and the command to start it.

Also it should be solved how the answers by the users are given back to the form creator.
