const {EmbedBuilder} = require("@discordjs/builders");
const {GuildMember, Embed} = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    execute(member) {
        const {user, guild} = member;
        const leftChannel = member.guild.channels.cache.get('996476860848423173');
        const verifyChannel = member.guild.channels.cache.get('1149772469071265803');
        const leftMessage = `<@${member.id}> left The Hot Box!`;

        const leftEmbed = new EmbedBuilder()
        .setTitle("Member Left!")
        .setDescription(leftMessage)
        .setColor(0xFF0000)
        .setTimestamp()
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setFooter({text: 'Hot Box Sheriff', iconURL: 'https://cdn.discordapp.com/app-icons/981380401836748910/2a258c7aaffa0edb2eddc692414fa301.png?size=256'});

        leftChannel.send({embeds: [leftEmbed]});
    }
}