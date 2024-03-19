const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll for the Discord Members to vote on.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName("description")
        .setDescription("Set what the Members will be voting for.")
        .setRequired(true)
    )
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Where to post the poll to.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

    async execute(interaction) {
        const {options} = interaction;
        const channel = options.getChannel("channel");
        const description = options.getString("description");

        const embed = new EmbedBuilder()
        .setColor("Gold")
        .setDescription(description)
        .setTimestamp()
        .setFooter({text: `Hot Box Sheriff`, iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

        try {
            const m = await channel.send({embeds: [embed]});
            await m.react("✅")
            await m.react("❌")
            await interaction.reply({content: "✅ Poll was sucessfully created.", ephemeral: true});
        } catch (err) {
            console.log(err);
        }
    }
}