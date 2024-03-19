const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user on the Discord server.")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("Select a user.")
        .setRequired(true)
    ),

    async execute(interaction) {
        const {options} = interaction;
        const user = options.getUser("user") || Interaction.user;
        const member = await interaction.guild.members.cache.get(user.id);
        const icon = user.displayAvatarURL()
        const tag = user.tag;

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({name : tag, iconURL: icon})
        .addFields(
            {name: "Name:", value: `${user}`, inline: false},
            {name: "Roles:", value: `${member.roles.cache.map(r => r).join(``)}`, inline: false},
            {name: "Joined:", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true},
            {name: "Created:", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true}
        )
        .setTimestamp()
        .setFooter({text: `UserID: ${user.id}`, iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

        await interaction.reply({embeds: [embed]})
    }
}