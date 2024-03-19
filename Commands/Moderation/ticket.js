const {Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits} = require("discord.js");
const {openTicket} = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Setup and create the ticket message.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const {guild} = interaction;

        const ticketEmbed = new EmbedBuilder()
        .setDescription("Use the buttons below to open a ticket.")
        .setTimestamp()
        .setFooter({text: `Hot Box Sheriff`, iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

        const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId('customclass').setLabel('Custom Classes').setStyle(ButtonStyle.Primary).setEmoji('📝'),
            new ButtonBuilder().setCustomId('privatevc').setLabel('Private Discord VC').setStyle(ButtonStyle.Secondary).setEmoji('🎙️'),
            new ButtonBuilder().setCustomId('unban').setLabel('Unban Pass').setStyle(ButtonStyle.Danger).setEmoji('🎫'),
            new ButtonBuilder().setCustomId('support').setLabel('Shop Support').setStyle(ButtonStyle.Success).setEmoji('⛑️'),
        );

        await guild.channels.cache.get(openTicket).send({
            embeds: ([ticketEmbed]),
            components: [
                button
            ]
        });

        interaction.reply({content: "✅ Create ticket message successfully sent.", ephemeral: true})
    }
}