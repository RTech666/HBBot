const {ButtonInteraction, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const {createTranscript} = require("discord-html-transcripts");
const {transcripts} = require("../../config.json");
const ticketSchema = require("../../Models/Ticket.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const {guild, member, customId, channel} = interaction;
        const {ManageChannels, SendMessages} = PermissionFlagsBits;

        if (!interaction.isButton()) return;

        if (!["close"].includes(customId)) return;

        if (!guild.members.me.permissions.has(ManageChannels))
        return interaction.reply({content: "❗ I do not have permissions to do this.", ephemeral: true});

        const embed = new EmbedBuilder().setColor("Aqua");

        ticketSchema.findOne({ChannelID: channel.id}, async (err, data) => {
            if (err) throw err;
            if (!data) return;

            const fetchedMember = await guild.members.cache.get(data.MemberID);

            switch(customId) {
                case "close":
                    if (data.closed == true)
                    return interaction.reply({content: "❗ Ticket is in the process of being deleted.", ephemeral: true})

                const transcript = await createTranscript(channel, {
                    limit: -1,
                    returnBuffer: false,
                    fileName: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`,
                });

                await ticketSchema.updateOne({ChannelID: channel.id}, {Closed: true});

                const transcriptEmbed = new EmbedBuilder()
                .setTitle(`Transcript Type: ${data.Type}\nID: ${data.TicketID}`)
                .setTimestamp()
                .setFooter({text: member.user.tag, iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                const transcriptProcess = new EmbedBuilder()
                .setTitle('🔄️ Saving Transcript...')
                .setDescription("Ticket will be closed in 10 seconds, make sure you have DMs enabled to get a transcript of your ticket.")
                .setColor('Red')
                .setTimestamp()
                .setFooter({text: member.user.tag, iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                const res = await guild.channels.cache.get(transcripts).send({
                    embeds: [transcriptEmbed],
                    files: [transcript],
                });

                channel.send({embeds : [transcriptProcess]});

                setTimeout(function () {
                    member.send({
                        embeds: [transcriptEmbed.setDescription(`You can download a copy of your transcript above.`)], files: [transcript],
                    }).catch(() => channel.send('❗ Could not send transcript to DMs.'));
                    channel.delete();
                }, 10000);

                break;
            };
        });
    }
}