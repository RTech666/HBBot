const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("mchow")
    .setDescription("Post the Forge Minecraft server how-to embed.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const howEmbed = new EmbedBuilder()
        .setTitle("How to Join the Forge Server")
        .setColor('Red')
        .addFields({name: 'Script and Modlist:', "value": `https://hotboxservers.net`},)
        .addFields({name: 'Important:', "value": `MAKE SURE YOU HAVE LAUNCHED VANILLA MINECRAFT AT LEAST ONCE BEFORE INSTALLING THE MODS!\n`},)
        .addFields({name: 'Instructions:', "value": `1. All you have to do is download the Minecraft Mod Script, linked above.\n2. Run the script AS ADMINISTRATOR and make sure you read :)\n3. If the script turns RED, that means something failed, you have to SCREENSHOT THE WINDOW and send it to me to help you.\n4. If the script is GREEN till it closes, your good to go, launch Forge and then add the Server IP.\n`},)
        .setTimestamp()
        .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

        return interaction.reply({embeds: [howEmbed], ephemeral: false});
    }
}