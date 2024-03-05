const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'endedGiveawayReactionAdded',
    execute(giveaway, member, reaction) {
        reaction.users.remove(member.user);
        return member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🤔 Mistake?')
                    .setDescription(`Oops, you entered an already ended [Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})!`)
            ]
        }).catch(() => { });
    }
}