const {Client} = require("discord.js");
const client = new client({intents: ["Guilds"]});

client.config = require("./config.json");

client.login(client.config.token).then(() => {
    console.log(`${client.user.username} logged in successfully!`);
    client.user.setActivity(`with ${client.guilds.cahce.size} guilds`);
}).catch((err) => console.log(err));