const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, Embed} = require("discord.js");
const ms = require("ms");
const client = require("../../index")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Setup a giveaway.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subCommand =>
        subCommand.setName("start")
        .setDescription("Starts a giveaway.")
        .addStringOption(option =>
            option.setName("length")
            .setDescription("Enter how long the giveaway should run for.")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("prize")
            .setDescription("What will the winners get?")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("pause")
        .setDescription("Pauses a giveaway.")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Enter message-id of giveaway you want to pause.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("unpause")
        .setDescription("Unpause a giveaway.")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Enter message-id of giveaway you want to unpause.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("end")
        .setDescription("End a giveaway.")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Enter message-id of giveaway you want to end.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("reroll")
        .setDescription("Reroll a giveaway.")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Enter message-id of giveaway you want to reroll.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("delete")
        .setDescription("Delete a giveaway.")
        .addStringOption(option =>
            option.setName("message-id")
            .setDescription("Enter message-id of giveaway you want to delete.")
            .setRequired(true)
        )
    ),

    async execute(interaction) {
        const {options, guildId, member, channel} = interaction;
        const sub = options.getSubcommand();
        
        const errorEmbed = new EmbedBuilder().setColor("Red");
        const successEmbed = new EmbedBuilder().setColor("Green");

        if (sub === "start") {
            const gchannel = options.getChannel("channel") || channel;
            const duration = ms(options.getString("length"));
            const winnerCount = options.getInteger("winners") || 1;
            const prize = options.getString("prize");

            if (isNaN(duration)) {
                errorEmbed.setDescription("❗ Enter the correct giveaway length format! `1d, 1h, 1m, 1s`!")
                errorEmbed.setTimestamp()
                errorEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            }

            return client.giveawaysManager.start(gchannel, {
                duration: duration,
                winnerCount,
                prize,
                messages: client.giveawayConfig.messages
            }).then(async () => {
                if (client.giveawayConfig.giveawayManager.everyoneMention) {
                    const msg = await gchannel.send("@everyone");
                    msg.delete();
                }
                successEmbed.setDescription(`✅ Giveaway successfully created in ${gchannel}!`)
                successEmbed.setTimestamp()
                successEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`❗ Error \n\`${err}\``);
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }

        const messageid = options.getString("message-id");
        const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === guildId && g.messageId === messageid);

        if (!giveaway) {
            errorEmbed.setDescription(`❗ Giveaway with ID ${messageid} was not found in MongoDB!`)
            errorEmbed.setTimestamp()
            errorEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
            return interaction.reply({embeds: [errorEmbed], ephemeral: true});
        }

        if (sub === "pause") {
            if (giveaway.isPaused) {
                errorEmbed.setDescription("❗ This giveaway has already been paused!")
                errorEmbed.setTimestamp()
                errorEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            }
            await client.giveawaysManager.pause(messageid, {
                content: client.giveawayConfig.messages.paused,
                infiniteDurationText: client.giveawayConfig.messages.infiniteDurationText,
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`❗ Error \n\`${err}\``)
                errorEmbed.setTimestamp()
                errorEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }

        if (sub === "unpause") {
            client.giveawaysManager.unpause(messageid).then(() => {
                successEmbed.setDescription('✅ Giveaway sucessfully unpaused!').setColor('Blue')
                successEmbed.setTimestamp()
                successEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`❗ Error \n\`${err}\``)
                errorEmbed.setTimestamp()
                errorEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }

        if (sub === "end") {
            client.giveawaysManager.end(messageid).then(() => {
                successEmbed.setDescription('✅ Giveaway sucessfully ended!').setColor('Blue')
                successEmbed.setTimestamp()
                successEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`❗ Error \n\`${err}\``)
                errorEmbed.setTimestamp()
                errorEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }

        if (sub === "reroll") {
            await client.giveawaysManager.reroll(messageid, {
                messages: {
                    congrat: client.giveawayConfig.messages.congrat,
                    error: client.giveawayConfig.messages.error
                }
            }).then(() => {
                successEmbed.setDescription('✅ Successfully rerolled for new winners!').setColor("Gold")
                successEmbed.setTimestamp()
                successEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                errorEmbed.setDescription(`❗ Error \n\`${err}\``).setColor('Red')
                errorEmbed.setTimestamp()
                errorEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }

        if (sub === "delete") {
            client.giveawaysManager.delete(messageid).then(() => {
                successEmbed.setDescription('✅ Giveaway sucessfully deleted!').setColor('Blue')
                successEmbed.setTimestamp()
                successEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [successEmbed], ephemeral: true});
            }).catch((err) => {
                console.log(err);
                errorEmbed.setDescription(`❗ Error \n\`${err}\``)
                errorEmbed.setTimestamp()
                errorEmbed.setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});
                return interaction.reply({embeds: [errorEmbed], ephemeral: true});
            });
        }
    }
}