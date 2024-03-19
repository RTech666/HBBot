const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the Discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
        option.setName("target")
        .setDescription("User to be kicked.")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("reason")
        .setDescription("Reason they will be kicked for.")
        .setRequired(true)
    ),

    async execute(interaction) {
        const {channel, options} = interaction;
        const user = options.getUser("target");
        const reason = options.getString("reason");
        
        const member = await interaction.guild.members.fetch(user.id);

        const errorEmbed = new EmbedBuilder()
        .setDescription(`❗ You cannot kick ${user.username} since they have a higher rank.`)
        .setColor('Red')
        .setTimestamp()
        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
        return interaction.reply({embeds: [errorEmbed], ephemeral: true});

        await member.kick(reason);

        const kickEmbed = new EmbedBuilder()
        .setDescription(`✅ Successfully kicked ${user}. Reason: ${reason}`)
        .setColor('Green')
        .setTimestamp()
        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

        await interaction.reply ({
            embeds: [kickEmbed],
        })
    }
}