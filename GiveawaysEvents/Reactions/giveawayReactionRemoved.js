const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'giveawayReactionRemoved',
    execute(giveaway, member) {
        return member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('❌ Entry Removed')
                    .setDescription(`You left the [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}).\nGiveaway prize: \`${giveaway.prize}\`.\nIf it was a mistake, you can join again.`)
            ]
        })
    }
}