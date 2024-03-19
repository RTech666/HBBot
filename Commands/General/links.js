const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("links")
    .setDescription("Post the important links embed.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const linksEmbed = new EmbedBuilder()
        .setTitle("Hot Box Servers | Important Links")
        .setColor('Red')
        .addFields({name: 'Important Links:', "value": `Steam Group: https://steamcommunity.com/groups/hotboxservers\nWebsite: https://hotboxservers.net\nShop: https://hotboxservers.net/store/\nDarkRP Server IP: 164.152.122.38:27045\nDarkRP Workshop Content: https://steamcommunity.com/sharedfiles/filedetails/?id=1927973001`},)
        .setTimestamp()
        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

        return interaction.reply({embeds: [linksEmbed], ephemeral: false});
    }
}