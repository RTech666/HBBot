module.exports = {

    giveawayManager: {
        // Private Message Information.
        // If you set false, the bot will not send private message information to members who join the giveaway, for example.
        privateMessageInformation: true,
        // When a giveaway is created the bot pings everyone (true or false)
        everyoneMention: true,
        // You can choose a custom reaction
        reaction: '🎉'
    },

    // You can leave it as it is here by default.
    // Don't change things in {} brackets like {winners}, ...
    messages: {
        giveaway: '🎉 **Giveaway**',
        giveawayEnded: '🎉 **Giveaway Ended**',
        title: 'Prize: {this.prize}',
        drawing: 'The giveaway ends in: {timestamp}',
        dropMessage: 'Be the first, and react to 🎉!',
        inviteToParticipate: 'React with 🎉 to enter the giveaway!',
        winMessage: 'Congratulations, {winners}! You won **{this.prize}**!',
        embedFooter: '{this.winnerCount} winner',
        noWinner: 'Giveaway cancelled, no valid participations.',
        hostedBy: 'Hosted by: {this.hostedBy}',
        winners: 'Winner:',
        endedAt: 'Ended at',
        paused: '⚠️ **This giveaway is paused!**',
        infiniteDurationText: '`NEVER`',
        congrat: 'New winner: {winners}! Congratulations, your prize is **{this.prize}**!',
        error: 'Reroll cancelled, no valid participations.'
    }
}