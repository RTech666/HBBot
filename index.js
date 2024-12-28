const {Client, GatewayIntentBits, Partials, Collection} = require("discord.js");
const {Guilds, GuildMembers, GuildMessages} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember} = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

const {loadEvents} = require("./Handlers/eventHandler");
loadEvents(client);

client.config = require("./config.json");
client.events = new Collection();

client.login(client.config.token).then(() => {
    console.log(`${client.user.username} logged in successfully!`);
    client.user.setActivity(`with ${client.guilds.cache.size} guilds`);
}).catch((err) => console.log(err));