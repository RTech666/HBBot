const {SlashCommandBuilder, CommandInteraction, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Make sure the bot is online and working.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(interaction) {
        interaction.reply({content: "Pong", ephermal: false})
    },
};