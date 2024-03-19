const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Post the Staff Handbook.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const staffEmbed = new EmbedBuilder()
        .setTitle("Hot Box Servers | Staff Handbook")
        .setColor('Red')
        .addFields({name: 'Staff Handbook:', "value": `to be added`},)
        .setTimestamp()
        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

        return interaction.reply({embeds: [staffEmbed], ephemeral: false});
    }
}