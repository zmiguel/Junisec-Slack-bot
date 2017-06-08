var slackAPI = require('slackbotapi');
var request = require('request');
const fs = require('fs')
const Random = require("random-js");
const random = new Random(Random.engines.mt19937().autoSeed());

const config = require("./config.json");
const datafile = './data.json';

var cursos = ["Civil", "EGI", "Electromecânica", "Electrotécnica", "Informática", "Mecânica", "Química", "Biomédica", "Biológica", "Bioengenharia"];
var userArray;
var ChannelArray;

var bot = new slackAPI({
 	'token': config.token,
	'logging': true,
    'autoReconnect': true
});

function callback(error, response, body) {
	console.log(response.body);
    if (!error && response.statusCode == 200) {
        //console.log(body);
    }
}


bot.on('message', function(data) {
	if(data.type === "message"){
		if(data.previous_message) return;
		if (!data.text.startsWith(config.prefix)) return;
		let command = data.text.split(" ")[0];
		command = command.slice(config.prefix.length);

        var user = bot.getUser(data.user);
        var teamName = bot.slackData.team.name;
        var channel = bot.getChannel(data.channel);

        if(user) {
            data.username = user.name;
            data.iconUrl = user.profile.image_48;
        }

		let args = data.text.split(" ").slice(1);
		let argc = args.length;

		if (command === "ping"){
			if(data.user === "U4MPBP293"){
				bot.sendMsg(data.channel, "Fodasse pah! deixa-me em paz!");
			}else{
				bot.sendMsg(data.channel, "PONG CARALHO!");
			}
		}
		if (command === "register"){
			if(argc === 2){
				let email = args[0] + "@junisec.pt"
				let userString = "email=" + email + "&password=" + args[1];
				var addUserOptions = {
					headers: {'content-type' : 'application/x-www-form-urlencoded'},
				    url: 'https://mail.junisec.pt/admin/mail/users/add',
				    method: 'POST',
				    body: userString,
				    auth: {
				        'user': config.user,
				        'pass': config.pass
				    }
				};
				request(addUserOptions, callback);
				bot.sendPM(data.user, `Adiciona conta ${email}, com a password: *${args[1]}*`);
			}else{
				bot.sendPM(data.user, "Regista um novo email [username]@junisec.pt\nFormato: `!register [username] [password]`");
			}
		}

	}else return;
});

bot.on('team_join', function (data) {
    // Greet a new member that joins
    slack.sendPM(data.user.id, 'Bem-vindo!! :simple_smile: :beers:\n !register para te registares');
});

bot.on('hello', () => {
	var params = {
        icon_emoji: ':robot_face:'
    };
  console.log('Online!!');
});
