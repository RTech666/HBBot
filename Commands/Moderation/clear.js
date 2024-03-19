const {SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear messages from a specific user or channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
        option.setName('amount')
        .setDescription('Numnber of messages to clear.')
        .setRequired(true)
    ),
    // .addUserOption(option =>
    //     option.setName('target')
    //     .setDescription('Select a user to clear their messages.')
    //     .setRequired(false)
    // ),

    async execute(interaction) {
        const {channel, options} = interaction;
        const amount = options.getInteger('amount');
        const target = options.getUser("target");

        const messages = await channel.messages.fetch({
            limit: amount +1,
        });

        const res = new EmbedBuilder()
        .setColor('Red')

        if (target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id == target.id && amount . i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`✅ Successfully deleted ${messages.size} messages from ${target}.`)
                res.setTimestamp()
                res.setFooter({text: "Hot Box Servers Sheriff", iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                interaction.reply({embeds: [res]})
            });
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`✅ Successfully deleted ${messages.size} messages.`)
                res.setTimestamp()
                res.setFooter({text: "Hot Box Servers Sheriff", iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                interaction.reply({embeds: [res]})
            });
        }
    }
}