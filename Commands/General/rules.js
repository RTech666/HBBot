const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Post the rules embed.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const rulesEmbed = new EmbedBuilder()
        .setTitle("Hot Box Servers | Discord Rules")
        .setColor('Red')
        .addFields({name: 'Discord Rules:', "value": `1. No spamming of any kind is allowed.\n2. Do not post any NSFW content outside of the NSFW text channel.\n3. Advertising is not allowed what-so-ever, including DM advertising.\n4. You can ping Staff Members if absoulutely necessary, but do not ping spam.\n5. Ghost-pinging is not allowed.\n6. Do not share cheats/scripts/exploits.\n7. Racist comments, stereotypes, and any kind of harrasment towards Members and/or Staff Members will not be tollerated.\n8. Do not disrespect any Members and/or Staff Members, keep it civil.\n9. Do not spam or open multiple tickets, we will respond as soon as we can.\n10. Try to keep chat on-topic and in their respective text channels.\n11. Follow Discord's Terms (https://discord.com/terms) and Guidelines (https://discord.com/guidelines).`},)
        .setTimestamp()
        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

        return interaction.reply({embeds: [rulesEmbed], ephemeral: false});
    }
}