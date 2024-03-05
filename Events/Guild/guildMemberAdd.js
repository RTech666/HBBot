const {EmbedBuilder} = require("@discordjs/builders");
const {GuildMember, Embed} = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    execute(member) {
        const {user, guild} = member;
        const welcomeChannel = member.guild.channels.cache.get('996476860848423173');
        const verifyChannel = member.guild.channels.cache.get('1149772469071265803');
        const welcomeMessage = `Welcome <@${member.id}> to The Hot Box!`;

        const welcomeEmbed = new EmbedBuilder()
        .setTitle("Member Joined!")
        .setDescription(welcomeMessage)
        .setColor(0x00FF00)
        .setTimestamp()
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

        welcomeChannel.send({embeds: [welcomeEmbed]});
    }
}