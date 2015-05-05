var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};

var rewards = [];
rewards.push("Eat a piece of candy.");
rewards.push("Listen to your favorite music.");
rewards.push("Do 10 math problems of Gary's choice.");
rewards.push("Take 5 dollars from the friend of your choice.");
rewards.push("Take a nap.");
rewards.push("Go home early.");

var punishments = [];
punishments.push("Do 5 push ups.");
punishments.push("Sit in the corner.");
punishments.push("Do 500 jumping jacks.");
punishments.push("Give your computer to Noah.");
punishments.push("Cut off one finger for each problem you get wrong on your last math test.");
punishments.push("Bow down to Gary.");
punishments.push("Run to Q F C and get me lunch.");


function getRandomReward() {
    return rewards[Math.floor(Math.random() * rewards.length)];
}

function getRandomPunishment() {
    return punishments[Math.floor(Math.random() * punishments.length)];
}


https.createServer(options, function(req, res) {
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            console.dir(jsonString, {
                depth: 5
            });
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};


            echoResponse.response.outputSpeech.type = "PlainText"
            echoResponse.response.outputSpeech.text = "Do you want a reward or a punishment?"
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            console.log('JSON', theRequest.request);
            if (typeof theRequest.request.intent !== 'undefined') {
                choice = theRequest.request.intent.slots.Choice.value;
                    if(choice === "reward"){
                    reward = getRandomReward();
                    echoResponse.response.outputSpeech.text = reward;
                    //echoResponse.response.outputSpeech.text = "you said " + choice;
                    // echoResponse.response.card = {}
                    // echoResponse.response.card.type = "PlainText";
                    // echoResponse.response.card.title = choice;
                    // echoResponse.response.card.subtitle = choice;
                    // echoResponse.response.card.content = choice;
                    echoResponse.response.shouldEndSession = "true";
                }

                    if(choice === "punishment"){
                    punishment = getRandomPunishment();
                    echoResponse.response.outputSpeech.text = punishment;
                    //echoResponse.response.outputSpeech.text = "you said " + choice;
                    // echoResponse.response.card = {}
                    // echoResponse.response.card.type = "PlainText";
                    // echoResponse.response.card.title = choice;
                    // echoResponse.response.card.subtitle = choice;
                    // echoResponse.response.card.content = choice;
                    echoResponse.response.shouldEndSession = "true";
                }
            }
            myResponse = JSON.stringify(echoResponse);
            res.setHeader('Content-Length', myResponse.length);
            res.writeHead(200);
            res.end(myResponse);
            console.log('from post', myResponse);

        });
    } else {
        myResponse = JSON.stringify(echoResponse);
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }
}).listen(3022); //Put number in the 3000 range for testing and 443 for production
