const {EmbedBuilder, SlashCommandHandler, PermissionFlagsBits, SlashCommandBuilder} = require("discord.js");
const warningSchema = require("../../Models/Warning");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addSubcommand(subcommand =>
        subcommand.setName("add")
        .setDescription("Add a warning to a user.")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Select a user to warn.")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
            .setDescription("The reason you are warning the user.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("check")
        .setDescription("Check user for any warns.")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Select a user to check their warns.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("remove")
        .setDescription("Remove a warn from user.")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Select a user to remove a warn from.")
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("id")
            .setDescription("The ID of the warn you want to remove from the user.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("clear")
        .setDescription("Clear all warns from a user.")
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Select a user to clear their warns.")
            .setRequired(true)
        )
    ),

    async execute(interaction) {
        const {options, guildId, user, member} = interaction;
        const sub = options.getSubcommand(["add", "check", "remove", "clear"]);
        const target = options.getUser("target");
        const reason = options.getString("reason");
        const warnId = options.getInteger("id");
        const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString();
        const userTag = `${target.username}#${target.discriminator}`;

        const embed = new EmbedBuilder()

        switch (sub) {
            case "add":
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data) => {
                    if (err) throw err;

                    if (!data) {
                        data = new warningSchema({
                            GuildID: guildId,
                            UserID: target.id,
                            UserTag: userTag,
                            Content: [
                                {
                                    ExecuterId: user.id,
                                    ExecuterTag: user.tag,
                                    Reason: reason,
                                    Date: warnDate
                                }
                            ],
                        });
                    } else {
                        const warnContent = {
                            ExecuterId: user.id,
                            ExecuterTag: user.tag,
                            Reason: reason,
                            Date: warnDate
                        }
                        data.Content.push(warnContent);
                    }
                    data.save();
                });

                embed.setColor("Green")
                .setDescription(`
                Warn added: ${userTag} | ||${target.id}||
                **Reason**: ${reason}
                `)
                .setTimestamp()
                .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                interaction.reply({embeds: [embed]});
            break;

            case "check":
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        embed.setColor("Green")
                        .setDescription(`${data.Content.map(
                            (w, i) =>
                            `**ID**: ${i + 1}
                            **By**: ${w.ExecuterTag}
                            **Date**: ${w.Date}
                            **Reason**: ${w.Reason}\n\n
                            `
                        ).join(" ")}`)
                        .setTimestamp()
                        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                        interaction.reply({embeds: [embed]});
                    } else {
                        embed.setColor("Red")
                        .setDescription(`${userTag} | ||${target.id}|| has no warns.`)
                        .setTimestamp()
                        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                        interaction.reply({embeds: [embed]});
                    }
                });
            break;

            case "remove":
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        data.Content.splice(warnId, 1);
                        data.save();

                        embed.setColor("Green")
                        .setDescription(`${userTag}'s warn ID: ${warnId + 1} has been removed.`)
                        .setTimestamp()
                        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                        interaction.reply({embeds: [embed]});
                    } else {
                        embed.setColor("Red")
                        .setDescription(`${userTag} | ||${target.id}|| has no warns.`)
                        .setTimestamp()
                        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                        interaction.reply({embeds: [embed]});
                    }
                });
            break;

            case "clear":
                warningSchema.findOne({GuildID: guildId, UserID: target.id, UserTag: userTag}, async (err, data) => {
                    if (err) throw err;

                    if (data) {
                        await warningSchema.findOneAndDelete({GuildID: guildId, UserID: target.id, UserTag: userTag});

                        embed.setColor("Green")
                        .setDescription(`All ${userTag}'s warns were cleared.`)
                        .setTimestamp()
                        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                        interaction.reply({embeds: [embed]});
                    } else {
                        embed.setColor("Red")
                        .setDescription(`${userTag} | ||${target.id}|| has no warns.`)
                        .setTimestamp()
                        .setFooter({text: 'Hot Box Servers Sheriff', iconURL: 'https://cdn.discordapp.com/icons/1149487255833034782/4d14698909fb25bcbbce91e1cf3d50f0.webp?size=96'});

                        interaction.reply({embeds: [embed]});
                    }
                });
            break;
        }
    }
}