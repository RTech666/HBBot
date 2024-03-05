const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Use music commands.")
    .addSubcommand(subCommand =>
        subCommand.setName("play")
        .setDescription("Play songs in your currently connected voice channel.")
        .addStringOption(option =>
            option.setName('url')
            .setDescription("Enter the URL of the song you want to play. Supports YouTube playlists and links.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("pause")
        .setDescription("Pauses whatever is currently playing.")
    )
    .addSubcommand(subcommand =>
        subcommand.setName("resume")
        .setDescription("Resumes whatever is currently paused.")
    )
    .addSubcommand(subcommand =>
        subcommand.setName("stop")
        .setDescription("Stops the music and the bot leaves the voice channel.")
    )
    .addSubcommand(subcommand =>
        subcommand.setName("skip")
        .setDescription("Skips whatever is currently playing.")
    )
    .addSubcommand(subcommand =>
        subcommand.setName("queue")
        .setDescription("View the music queue.")
    ),

    async execute(interaction, client) {
        const {options, member, guild, channel} = interaction;
        const sub = options.getSubcommand();
        const VoiceChannel = member.voice.channel;
        const queue = client.distube.getQueue(interaction);

        const errEmbed = new EmbedBuilder().setColor("Red");

        if (sub === "play") {
            const playEmbed = new EmbedBuilder().setColor("Blue");

            if (!VoiceChannel) {
                playEmbed.setDescription("❗️ You must be in a voice channel to use music commands.")
                playEmbed.setTimestamp()
                playEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

                return interaction.reply({embeds: [playEmbed], ephemeral: true});
            }
    
            if (interaction.member.voice.channel.id && VoiceChannel.id !== interaction.member.voice.channel.id) {
                playEmbed.setDescription(`❗️ I'm already playing music in <#${interaction.member.voice.channel.id}>.`)
                playEmbed.setTimestamp()
                playEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

                return interaction.reply({embeds: [playEmbed], ephemeral: true});
            }
    
            if (!queue) {
                client.distube.play(VoiceChannel, options.getString("url"), {textChannel: channel, member: member});

                playEmbed.setDescription("✅ Song(s) request recieved!")
                playEmbed.setTimestamp()
                playEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

                return interaction.reply({embeds: [playEmbed], ephemeral: false});
            }
    
            if (queue) {
                client.distube.play(VoiceChannel, options.getString("url"), {textChannel: channel, member: member});

                playEmbed.setDescription("✅ Song(s) added to queue!")
                playEmbed.setTimestamp()
                playEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

                return interaction.reply({embeds: [playEmbed], ephemeral: false});
            }
        }

        if (sub === "pause") {
            const pauseEmbed = new EmbedBuilder().setColor("Orange");

            if (!queue) {
                pauseEmbed.setDescription("❗️ There currently is no queue.")
                pauseEmbed.setTimestamp()
                pauseEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

                return interaction.reply({embeds: [pauseEmbed], ephemeral: true});
            }
    
            if (!VoiceChannel) {
                pauseEmbed.setDescription("❗️ You must be in a voice channel to use music commands.")
                pauseEmbed.setTimestamp()
                pauseEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

                return interaction.reply({embeds: [pauseEmbed], ephemeral: true});
            }
    
            queue.pause(VoiceChannel);

            pauseEmbed.setDescription("⏸️ Paused currently playing song.")
            pauseEmbed.setTimestamp()
            pauseEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

            return interaction.reply({embeds: [pauseEmbed], ephemeral: false});
        }

        if (sub === "resume") {
            const resumeEmbed = new EmbedBuilder().setColor("Green");

            if (!queue) {
                resumeEmbed.setDescription("❗️ There currently is no queue.")
                resumeEmbed.setTimestamp()
                resumeEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});
    
                return interaction.reply({embeds: [resumeEmbed], ephemeral: true});
            }
    
            if (!VoiceChannel) {
                resumeEmbed.setDescription("❗️ You must be in a voice channel to use music commands.")
                resumeEmbed.setTimestamp()
                resumeEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});
    
                return interaction.reply({embeds: [resumeEmbed], ephemeral: true});
            }
    
            queue.resume(VoiceChannel);

            resumeEmbed.setDescription("▶️ Resumed currently paused song.")
            resumeEmbed.setTimestamp()
            resumeEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

            return interaction.reply({embeds: [resumeEmbed], ephemeral: false});
        }

        if (sub === "stop") {
            const stopEmbed = new EmbedBuilder().setColor("Red");

            if (!queue) {
                stopEmbed.setDescription("❗️ There currently is no queue.")
                stopEmbed.setTimestamp()
                stopEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});
    
                return interaction.reply({embeds: [stopEmbed], ephemeral: true});
            }
    
            if (!VoiceChannel) {
                stopEmbed.setDescription("❗️ You must be in a voice channel to use music commands.")
                stopEmbed.setTimestamp()
                stopEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});
    
                return interaction.reply({embeds: [stopEmbed], ephemeral: true});
            }
    
            queue.stop(VoiceChannel);
            
            stopEmbed.setDescription("⏹️ Stopped currently playing song.")
            stopEmbed.setTimestamp()
            stopEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

            return interaction.reply({embeds: [stopEmbed], ephemeral: false});
        }

        if (sub === "skip") {
            const skipEmbed = new EmbedBuilder().setColor("Pink");

            if (!queue) {
                skipEmbed.setDescription("❗️ There currently is no queue.")
                skipEmbed.setTimestamp()
                skipEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});
    
                return interaction.reply({embeds: [skipEmbed], ephemeral: false});
            }
    
            if (!VoiceChannel) {
                skipEmbed.setDescription("❗️ You must be in a voice channel to use music commands.")
                skipEmbed.setTimestamp()
                skipEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});
    
                return interaction.reply({embeds: [skipEmbed], ephemeral: true});
            }
    
            queue.skip(VoiceChannel);
            
            skipEmbed.setDescription("⏭️ Skipped currently playing song.")
            skipEmbed.setTimestamp()
            skipEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

            return interaction.reply({embeds: [skipEmbed], ephemeral: false});
        }

        if (sub === "queue") {
            const queueEmbed = new EmbedBuilder().setColor("Purple");

            if (!queue) {
                queueEmbed.setDescription("❗️ There currently is no queue.")
                queueEmbed.setTimestamp()
                queueEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});
    
                return interaction.reply({embeds: [queueEmbed], ephemeral: true});
            }
    
            if (!VoiceChannel) {
                queueEmbed.setDescription("❗️ You must be in a voice channel to use music commands.")
                queueEmbed.setTimestamp()
                queueEmbed.setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});
    
                return interaction.reply({embeds: [queueEmbed], ephemeral: true});
            }
    
            return interaction.reply({embeds: [new EmbedBuilder()
                .setTitle("🎶 Queue 🎶")
                .setColor("Purple")
                .setDescription(`▶️ **Currently Playing: ${queue.songs[0].name}**\n
                **⏭️ Next In Queue:**${queue.songs.map((song, id) => `\n**${id}**. \`${song.name}\` - \`${song.formattedDuration}\``).slice(1, 50)}`)
                .setTimestamp()
                .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'})
            ]});
        }
    }
}