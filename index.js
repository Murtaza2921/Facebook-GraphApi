const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

const PAGE_ACCESS_TOKEN =
  "EAATp2HINZCjMBO0ZBpDrC4ZCyiZCxF2vFjWTvTiQ8ZA9fl4fDw9EbmaTy4Q5Gvs08UhqkBIIAYftaCiA0qqbtSVEyVGeohVEivGPcDMZCIZCsbq4Fx1x5oSMrubHuPgnZAHGzaS10PZCpwtA1dfdR1j5q4iZCnGSIFGVTZCtue4ZBAgOrn7V3yLT9AhAcM8pli7xUkp1KHAo48th";

app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === "sdfsrrssystis?.'pl'fsdfsrf") {
    const hubChallenge = req.query["hub.challenge"];
    res.status(200).send(hubChallenge);
    console.log("deployed");
  } else {
    res.send("Error, wrong validation token");
  }
});

app.post("/webhook", (req, res) => {
  const data = req.body;
  if (data.object === "page") {
    data.entry.forEach((entry) => {
      const pageID = entry.id;
      const timeOfEvent = entry.time;

      entry.messaging.forEach((event) => {
        if (event.message) {
          receivedMessage(event);
        }
      });
    });
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  const senderID = event.sender.id;
  const message = event.message;

  // Handle the message received, and you can reply using sendAPI
  sendTextMessage(senderID, "Hello, I received your message!");
}

function sendTextMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
    },
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request(
    {
      uri: "https://graph.facebook.com/v13.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: messageData,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log("Message sent successfully");
      } else {
        console.error("Unable to send message:", error);
      }
    }
  );
}

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
