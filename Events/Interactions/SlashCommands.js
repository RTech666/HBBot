const {ChatInputCommandInteraction} = require("discord.js");

module.exports = {
    name: "interactionCreate",
    
    execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if(!command)
            return interaction.reply({
                content: "This command is outdated.",
                ephemeral: true
            });

        if (command.develiper && interaction.user.id !== "979047956198096927")
        return interaction.reply({
            content: "You are not my developer.",
            ephemeral: true
        });

        command.execute(interaction, client);
    }
}