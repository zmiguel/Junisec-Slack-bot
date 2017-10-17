const Bot = require('slackbot-api');
var request = require('request');
var MailListener = require("mail-listener2");
const fs = require('fs')
const Random = require("random-js");
const random = new Random(Random.engines.mt19937().autoSeed());
var qs = require('querystring');

const config = require("./config.json");
const datafile = './data.json';

const bot = new Bot({token: config.token});
const botAdmin = new Bot({token: config.adminToken});

const drmoreira = "drmoreira";
var contador = 0;
var lastJoke = 0;
//mail stuff
var geralmail = new MailListener({
    username: config.mails.geral.user,
    password: config.mails.geral.pass,
    host: "mail.junisec.pt",
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    //debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: {rejectUnauthorized: false},
    mailbox: "Inbox", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: {directory: "attachments/"} // specify a download directory for attachments
});
var recmail = new MailListener({
    username: config.mails.recrutamento.user,
    password: config.mails.recrutamento.pass,
    host: "mail.junisec.pt",
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    //debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: {rejectUnauthorized: false},
    mailbox: "Inbox", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: {directory: "attachments/"} // specify a download directory for attachments
});
var hrmail = new MailListener({
    username: config.mails.hr.user,
    password: config.mails.hr.pass,
    host: "mail.junisec.pt",
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    //debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: {rejectUnauthorized: false},
    mailbox: "Inbox", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: {directory: "attachments/"} // specify a download directory for attachments
});
var moodlemail = new MailListener({
    username: config.mails.moodle.user,
    password: config.mails.moodle.pass,
    host: "mail.junisec.pt",
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    //debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: {rejectUnauthorized: false},
    mailbox: "Inbox", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: {directory: "attachments/"} // specify a download directory for attachments
});
var pocmail = new MailListener({
    username: config.mails.poc.user,
    password: config.mails.poc.pass,
    host: "mail.junisec.pt",
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    //debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: {rejectUnauthorized: false},
    mailbox: "Inbox", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: {directory: "attachments/"} // specify a download directory for attachments
});
var adminmail = new MailListener({
    username: config.mails.admin.user,
    password: config.mails.admin.pass,
    host: "mail.junisec.pt",
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    //debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: {rejectUnauthorized: false},
    mailbox: "Inbox", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: {directory: "attachments/"} // specify a download directory for attachments
});
geralmail.start(); // start listening
recmail.start(); // start listening
hrmail.start(); // start listening
moodlemail.start(); // start listening
pocmail.start(); // start listening
adminmail.start(); // start listening

var cursos = ["Civil", "EGI", "Electromecânica", "Electrotécnica", "Informática", "Mecânica", "Química", "Biomédica", "Biológica", "Bioengenharia"];
var userArray;
var ChannelArray;


function callback(error, response, body) {
    if (!error && response.statusCode === 200) {
        //console.log(body);
    }
}

geralmail.on("server:connected", function () {
    console.log("[GERAL@junisec.pt] imapConnected");
});
geralmail.on("error", function (err) {
    console.log(err);
});
geralmail.on("mail", function (mail, seqno, attributes) {
    // do something with mail object including attachments
    bot.sendMessage('email', `*Novo email de:* ${mail.headers.from}\n*Enviado para:* ${mail.to[0].address}\n*Recebido a:* ${mail.receivedDate}\n*Assunto:* ${mail.subject}\n*Conteudo:* ${mail.text}`)
    console.log(`Novo email de: ${mail.headers.from} para ${mail.to[0].address}`);
    // mail processing code goes here
});

recmail.on("server:connected", function () {
    console.log("[RECRUTAMENTO@junisec.pt] imapConnected");
});
recmail.on("error", function (err) {
    console.log(err);
});
recmail.on("mail", function (mail, seqno, attributes) {
    // do something with mail object including attachments
    bot.sendMessage('email', `*Novo email de:* ${mail.headers.from}\n*Enviado para:* ${mail.to[0].address}\n*Recebido a:* ${mail.receivedDate}\n*Assunto:* ${mail.subject}\n*Conteudo:* ${mail.text}`)
    console.log(`Novo email de: ${mail.headers.from} para ${mail.to[0].address}`);
    // mail processing code goes here
});

hrmail.on("server:connected", function () {
    console.log("[HR@junisec.pt] imapConnected");
});
hrmail.on("error", function (err) {
    console.log(err);
});
hrmail.on("mail", function (mail, seqno, attributes) {
    // do something with mail object including attachments
    bot.sendMessage('email', `*Novo email de:* ${mail.headers.from}\n*Enviado para:* ${mail.to[0].address}\n*Recebido a:* ${mail.receivedDate}\n*Assunto:* ${mail.subject}\n*Conteudo:* ${mail.text}`)
    console.log(`Novo email de: ${mail.headers.from} para ${mail.to[0].address}`);
    // mail processing code goes here
});

moodlemail.on("server:connected", function () {
    console.log("[MOODLE@junisec.pt] imapConnected");
});
moodlemail.on("error", function (err) {
    console.log(err);
});
moodlemail.on("mail", function (mail, seqno, attributes) {
    // do something with mail object including attachments
    bot.sendMessage('email', `*Novo email de:* ${mail.headers.from}\n*Enviado para:* ${mail.to[0].address}\n*Recebido a:* ${mail.receivedDate}\n*Assunto:* ${mail.subject}\n*Conteudo:* ${mail.text}`)
    console.log(`Novo email de: ${mail.headers.from} para ${mail.to[0].address}`);
    // mail processing code goes here
});

pocmail.on("server:connected", function () {
    console.log("[POC@junisec.pt] imapConnected");
});
pocmail.on("error", function (err) {
    console.log(err);
});
pocmail.on("mail", function (mail, seqno, attributes) {
    // do something with mail object including attachments
    bot.sendMessage('email', `*Novo email de:* ${mail.headers.from}\n*Enviado para:* ${mail.to[0].address}\n*Recebido a:* ${mail.receivedDate}\n*Assunto:* ${mail.subject}\n*Conteudo:* ${mail.text}`)
    console.log(`Novo email de: ${mail.headers.from} para ${mail.to[0].address}`);
    // mail processing code goes here
});

adminmail.on("server:connected", function () {
    console.log("[ADMIN@junisec.pt] imapConnected");
});
adminmail.on("error", function (err) {
    console.log(err);
});
adminmail.on("mail", function (mail, seqno, attributes) {
    // do something with mail object including attachments
    bot.sendMessage('email', `*Novo email de:* ${mail.headers.from}\n*Enviado para:* ${mail.to[0].address}\n*Recebido a:* ${mail.receivedDate}\n*Assunto:* ${mail.subject}\n*Conteudo:* ${mail.text}`)
    console.log(`Novo email de: ${mail.headers.from} para ${mail.to[0].address}`);
    // mail processing code goes here
});

bot.on('message', message => {
    if (message.type === "message") {
        if (!message.text) return;
        if (!message.text.startsWith(config.prefix)) {
            processMessage(message);
            return;
        }
        let command = message.text.split(" ")[0];
        command = command.slice(config.prefix.length);
        let args = message.text.split(" ").slice(1);
        let argc = args.length;
        let username = bot.find(message.user).name;

        if (command == "quote") {
            sendAQuote(username,message.channel);
        }
        else if (command === "joke") {
            sendAJoke(username,message.channel);
        }
        else if (command === "ping") {
            if (username === "sergio.ramos") {
                message.reply("🍺🍺🍺 ALL HAIL THE fucking PRESIDENT 🍺🍺🍺");
            } else if (username === "jcurado") {
                message.reply("Roda esse mano!");
            } else {
                message.reply("PONG!");
            }
        }
        else if (command === "register") {
            if (argc === 2) {
                let email = args[0] + "@junisec.pt"
                let userString = "email=" + email + "&password=" + args[1];
                var addUserOptions = {
                    headers: {'content-type': 'application/x-www-form-urlencoded'},
                    url: 'https://mail.junisec.pt/admin/mail/users/add',
                    method: 'POST',
                    body: userString,
                    auth: {
                        'user': config.user,
                        'pass': config.pass
                    }
                };
                request(addUserOptions, callback);
                bot.sendMessage(username, `Adiciona conta ${email}, com a password: *${args[1]}*`);
            } else {
                bot.sendMessage(username, "Regista um novo email [username]@junisec.pt\nFormato: `!register [username] [password]`");
            }
        }
        else if (command === "help") {
            bot.sendMessage(username, `\n"${config.prefix}quote"     -> recebes uma random quote\n"${config.prefix}joke"      -> recebes uma random joke\n"${config.prefix}ping"      -> é fácil perceber qual a resposta :)\n"${config.prefix}register"  -> para criares um email`);
        }
        else {
            bot.sendMessage(username, `Não conheço o comando: "${command}"\nUsa o comando "${config.prefix}help" para veres a lista de comandos.`);
        }
    }
});

bot.on('hello', () => {
    console.log('Online!!');
});

botAdmin.on('hello', () => {
    console.log('BotAdmin Online!!!');
});

function processMessage(message) {
    let username = bot.find(message.user).name;
    let channel = bot.find(message.channel).name;
    if (channel === "reunioes" && username !== "jorge") {
        botAdmin.deleteMessage(message.channel, message.ts)
            .then(
                bot.sendMessage(username, `Não tens permissões para escrever no canal "${channel}", por isso a tua mensagem foi apagada!`)
            )
            .catch(error => {
                    console.log(`[ERRO] Apagar mensagem do canal "${channel}": `, error);
                    bot.sendMessage(drmoreira, `[ERRO] Apagar mensagem de "${username}" do canal "${channel}"`);
                }
            );
    }
    if (channel === "logs" && (username !== "jorge" || username !== "drmoreira" || username !== "sergio.ramos")) {
        botAdmin.deleteMessage(message.channel, message.ts)
            .then(
                bot.sendMessage(username, `Não tens permissões para escrever no canal "${channel}", por isso a tua mensagem foi apagada!`)
            )
            .catch(error => {
                    console.log('[ERRO] Apagar mensagem do canal "logs": ', error);
                    bot.sendMessage(drmoreira, `[ERRO] Apagar mensagem de "${username}" do canal "${channel}"`);
                }
            );
    }
}

function sendAJoke(username,channel) {
    if (username === "sergio.ramos") {
		let curr_timer = Date.now();
		let tdif = (curr_timer - lastJoke) / 1000;
		lastJoke = curr_timer;
		if(tdif <= 60){
			bot.sendMessage(channel, "Sérgio, sabemos que és rápido, mas ao menos deixa-me acabar (de contar a piada...)");
		}
        if(contador >= 1) {
            bot.sendMessage(channel, "Porra outra vez? Ainda à pouco tempo de contei uma piada.");
            contador = 0;
            return;
        } else {
            contador++;
        }
    }
    if (Math.random() >= 0.5) {
        request('http://api.icndb.com/jokes/random', function (error, response, body) {
            if (!error) {
                var bodyParsed = JSON.parse(response.body);
                bot.sendMessage(channel, bodyParsed.value.joke);
            }
        });
    } else {
        request('http://api.yomomma.info/', function (error, response, body) {
            if (!error) {
                var bodyParsed = JSON.parse(response.body);
                bot.sendMessage(channel, bodyParsed.joke);
            }
        });
    }
}

function sendAQuote(username,channel) {
    if (Math.random() >= 0.5) {
        request('https://talaikis.com/api/quotes/random/', function (error, response, body) {
            if (!error) {
                var bodyParsed = JSON.parse(response.body);
                bot.sendMessage(channel, `Quote: ${bodyParsed.quote}\n By: ${bodyParsed.author}`);
            }
        });
    } else {
        request('https://random-quote-generator.herokuapp.com/api/quotes/random', function (error, response, body) {
            if (!error) {
                var bodyParsed = JSON.parse(response.body);
                bot.sendMessage(channel, `Quote: ${bodyParsed.quote}\n By: ${bodyParsed.author}`);
            }
        });
    }
}
