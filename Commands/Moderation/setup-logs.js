const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, Guild} = require("discord.js");
const logSchema = require("../../Models/Logs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-logs")
    .setDescription("Setup the information needed for the Discord logs.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Set the text channel for the logging messages.")
        .setRequired(true)
    ),

    async execute(interaction) {
        const {channel, guildId, options} = interaction;
        const logChannel = options.getChannel("channel") || channel;
        
        const embed = new EmbedBuilder();

        logSchema.findOne({Guild: guildId}, async (err, data) => {
            if (!data) {
                await logSchema.create({
                    Guild: guildId,
                    Channel: logChannel.id
                });

                embed.setDescription("✅ Data was successfully sent to the MongoDB.")
                .setColor('Green')
                .setTimestamp()
                .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
            } else if (data) {
                logSchema.findOneAndDelete({Guild: guildId});
                await logSchema.create({
                    Guild: guildId,
                    Channel: logChannel.id
                });

                embed.setDescription("✅ Successfully replaced old data with the new data.")
                .setColor('Green')
                .setTimestamp()
                .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
            }

            if (err) {
                embed.setDescription("❗ Something went wrong. Please contact RTech.")
                .setColor('Red')
                .setTimestamp()
                .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
            }

            return interaction.reply({embeds: [embed], ephemeral: true});
        })
    }
}