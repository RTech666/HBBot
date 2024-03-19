const {EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('createverify')
    .setDescription('Setup and create the verification embed.')
    .addChannelOption(option =>
        option.setName('channel')
        .setDescription('Send verification embed in this channel.')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        const verifyEmbed = new EmbedBuilder()
        .setTitle("Verification")
        .setDescription('Click the button below to verify your account and gain access to the Discord server.')
        .setColor('Green')
        .setTimestamp()
        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
        let sendChannel = channel.send({
            embeds: ([verifyEmbed]),
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('verify').setLabel('✅ Verify').setStyle(ButtonStyle.Success),
                ),
            ],
        });

        if (!sendChannel) {
            return interaction.reply({content: '❗ An error has occured! Please try again or read the console.', ephemeral: true})
        } else {
            return interaction.reply({content: '✅ Verification embed was sucessfully created.', ephemeral: true})
        }
    }
}