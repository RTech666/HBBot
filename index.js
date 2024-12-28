const {Client, GatewayIntentBits, Partials, Collection} = require("discord.js");
const {Guilds, GuildMembers, GuildMessages} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember} = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

const {loadEvents} = require("./Handlers/eventHandler");
loadEvents(client);

const {loadCommands} = require("./Handlers/commandHandler");
loadCommands(client);

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();

client.login(client.config.token).then(() => {
    console.log(`\nBot loaded successfully!\nLogged in as: ${client.user.username}`);
    client.user.setActivity(`with ${client.guilds.cache.size} guilds`);
}).catch((err) => console.log(err));