const {Client} = require("discord.js");
const client = new Client({intents: ["Guilds"]});

client.config = require("./config.json");

client.login(client.config.token).then(() => {
    console.log(`${client.user.username} logged in successfully!`);
    client.user.setActivity(`with ${client.guilds.cache.size} guilds`);
}).catch((err) => console.log(err));