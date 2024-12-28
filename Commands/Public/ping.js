const {ChatInputCommandInteraction, SlashCommandBuilder} = require('discord.js');

module.exports = {
    name: "Ping",
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot can read/send messsages."),

    execute(interaction) {
        interaction.reply({content: "Pong!", ephemeral: true});
    }
}