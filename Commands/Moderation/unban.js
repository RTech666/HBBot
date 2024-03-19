const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a banned user from the Discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
        option.setName("userid")
        .setDescription("Discord ID of the user you want to unban.")
        .setRequired(true)
    ),

    async execute(interaction) {
        const {channel, options} = interaction;
        const userId = options.getString("userid");

        try {
            await interaction.guild.members.unban(userId);

            const unbanEmbed = new EmbedBuilder()
            .setDescription(`✅ Successfully unbanned ${userId}.`)
            .setColor('Green')
            .setTimestamp()
            .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

            await interaction.reply({
                embeds: [unbanEmbed],
            });
        } catch(err) {
            console.log(err);

            const errorEmbed = new EmbedBuilder()
            .setDescription(`❗ Invalid Discord ID. Please provide a valid Discord ID.`)
            .setColor('Red')
            .setTimestamp()
            .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

            interaction.reply({embeds: [errorEmbed], ephemeral: true});
        }
    }
}