const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("serverrules")
    .setDescription("Post the Server Rules embed.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const serverRulesEmbed = new EmbedBuilder()
        .setTitle("The Hot Box Server Rules")
        .setColor('Red')
        .addFields({name: 'Minecraft Server Rules', "value": `1. You cannot rob other players (you can only take whatever they drop if you killed them).\n2. You cannot destroy other player's base and/or house or "claim" their houses.\n3. You must have a sign outside of your base and/or house.\n4. Xray texture pack is fine to use only when MINING. Nothing else.\n`},)
        .addFields({name: 'Palworld Server Rules', "value": `1. You cannot rob another player's house.\n2. You cannot destroy another player's base and/or items.`},)
        .setTimestamp()
        .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

        return interaction.reply({embeds: [serverRulesEmbed], ephemeral: false});
    }
}