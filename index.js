const {Client, GatewayIntentBits, Partials, Collection, EmbedBuilder} = require('discord.js');
const {Guilds, GuildMembers, GuildMessages, GuildVoiceStates, MessageContent} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember, Channel} = Partials;
const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');
const {handleLogs} = require('./Handlers/handleLogs')
const logs = require("discord-logs");
const {DisTube} = require('distube')
const {SpotifyPlugin} = require('@distube/spotify')
const {SoundCloudPlugin} = require('@distube/soundcloud')
const {YtDlpPlugin} = require('@distube/yt-dlp')

const client = new Client({
    intents: [Object.keys(GatewayIntentBits), Object.keys(GatewayIntentBits.GuildMembers)],
    partials: [Object.keys(Partials)],
});

logs(client, {
    debug: true
});

client.config = require('./config.json');
client.commands = new Collection();
client.giveawayConfig = require("./config.js");

['giveawaysEventsHandler', 'giveawaysManager'].forEach((x) => {
    require(`./Utils/${x}`)(client);
});

module.exports = client;

client.distube = new DisTube(client, {
    searchSongs: 5,
	searchCooldown: 30,
	leaveOnEmpty: true,
	leaveOnFinish: true,
	leaveOnStop: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,

    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true,
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin({
            update: true,
        }),
    ]
});

// DisTube Events
client.distube.on('playSong', (queue, song) => queue.textChannel.send({embeds: [new EmbedBuilder()
    .setColor("Green")
    .setDescription(`🎶 Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`)
    .setTimestamp()
    .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'})
]}))

.on('addSong', (queue, song) =>queue.textChannel.send({embeds: [new EmbedBuilder()
    .setColor("Green")
    .setDescription(`✅ Added \`${song.name}\` - \`${song.formattedDuration}\` to the queue. \nRequested by: ${song.user}`)
    .setTimestamp()
    .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'})
]}))

.on('addList', (queue, playlist) => queue.textChannel.send({embeds: [new EmbedBuilder()
    .setColor("Green")
    .setDescription(`✅ Added playlist \`${playlist.name}\` - \`(${playlist.songs.length} songs total)\` - to the queue. \nRequested by: ${playlist.user}`)
    .setTimestamp()
    .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'})
]}))

.on('error', (channel, e) => {
    if (channel) channel.send({embeds: [new EmbedBuilder()
    .setColor("Red")
    .setDescription(`❗️ Error: ${e.toString().slice(0, 1974)}`)
    .setTimestamp()
    .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'})
    ]})

    else console.error(e)
})

.on('empty', channel => channel.send({embeds: [new EmbedBuilder()
    .setColor("Red")
    .setDescription('❗️ Voice channel is empty! Leaving the channel...')
    .setTimestamp()
    .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'})
]}))

.on('searchNoResult', (message, query) => message.channel.send({embeds: [new EmbedBuilder()
    .setColor("Red")
    .setDescription(`❗️ No result found for \`${query}\`!`)
    .setTimestamp()
    .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'})
]}))

.on('finish', queue => queue.textChannel.send({embeds: [new EmbedBuilder()
    .setColor("Green")
    .setDescription('✅ Queue finished, leaving voice channel.')
    .setTimestamp()
    .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'})
]}))

.on('searchResult', (message, result) => {
	let i = 0;
	message.channel.send(
		`**Choose an option from below**\n${result
			.map(
				song =>
					`**${++i}**. ${song.name} - \`${
						song.formattedDuration
					}\``,
			)
		.join(
			'\n',
		)}\n*Enter anything else or wait 30 seconds to cancel*`,
	);
})

.on('searchCancel', message => message.channel.send({embeds: [new EmbedBuilder()
    .setColor("Red")
    .setDescription('❗️ Search has been canceled.')
    .setTimestamp()
    .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'})
]}))

.on('searchInvalidAnswer', message => message.channel.send({embeds: [new EmbedBuilder()
    .setColor("Red")
    .setDescription('❗️ Invalid number of results.')
    .setTimestamp()
    .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'})
]}))

.on('searchDone', () => {});

client.login(client.config.token).then(() => {
    handleLogs(client);
    loadEvents(client);
    loadCommands(client);
});