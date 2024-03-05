const {ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits} = require("discord.js");
const ticketSchema = require("../../Models/Ticket.js");
const {ticketParent, everyone} = require("../../config.json");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const {guild, member, customId, channel} = interaction;
        const {ViewChannel, SendMessages, ManageChannels, ReadMessageHistory} = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        if (!interaction.isButton()) return;

        if (!["customclass", "privatevc", "unban", "support"].includes(customId)) return;

        if (!guild.members.me.permissions.has(ManageChannels))
        interaction.reply({content: "❗ I do not have permissions to do this.", ephemeral: true})

        try {
            await guild.channels.create({
                name: `${member.user.username}-ticket${ticketId}`,
                type: ChannelType.GuildText,
                parent: ticketParent,
                permissionOverwrites: [
                    {
                        id: everyone,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                ],
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MemberID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                });

                const infoEmbed = new EmbedBuilder()
                .setTitle(`${guild.name} - Ticket: ${customId}`)
                .setDescription("We will respond to you shortly, in the meantime, please tell us the reason you created the ticket.")
                .setTimestamp()
                .setFooter({text: `Hot Box Sheriff - ${ticketId}`, iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('close').setLabel('Close Ticket').setStyle(ButtonStyle.Primary).setEmoji('❌'),
                );

                channel.send({
                    embeds: ([infoEmbed]),
                    components: [
                        button
                    ]
                });
                
                interaction.reply({content: "✅ Sucessfully created a ticket.", ephemeral: true});
            });
        } catch (err) {
            return console.log(err);
        }
    }
}