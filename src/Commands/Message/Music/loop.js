import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "loop",
  aliases: ["repeat"],
  category: "Music",
  permission: "",
   desc: "Toggles Loop Mode!",
    options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: true,
      active: true,
    },
    premium: false,
    vote: false,
  },
  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args }) => {
    const player = client.kazagumo.players.get(message.guild.id);
    try {
      if (!player) {
        const embed = new EmbedBuilder()
          .setDescription(`No Player Found For This **Guild**.`)
          .setColor(client.settings.COLOR);
        return message.channel.send({ embeds: [embed] });
      }
      if (!args[0]) {
        const embed = new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setDescription(
            `Select a method to **loop**.`
          );
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("track")
          //.setEmoji(`1177292642590142494`)
            .setLabel("Track")
            .setStyle(client.Buttons.grey),
          new ButtonBuilder()
            .setCustomId("queue")
            //.setEmoji(`1177292640576864266`)
            .setLabel("Queue")
            .setStyle(client.Buttons.grey),
          new ButtonBuilder()
            .setCustomId("off")
            .setLabel("Off")
            //.setEmoji(`1177292636244148265`)
            .setStyle(client.Buttons.grey)
        );
        const msg = await message.channel.send({
          embeds: [embed],
          components: [buttons],
        });
        const filter = (i) => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({
          filter,
          time: 15000,
        });
        collector.on("collect", async (i) => {
          if (i.customId === "track") {
            player.setLoop("track");
            embed.setDescription(`Now looping the **track**`);
            i.update({ embeds: [embed], components: [] });
          } else if (i.customId === "queue") {
            player.setLoop("queue");
            embed.setDescription(`Now looping the **queue**`);
            i.update({ embeds: [embed], components: [] });
          } else if (i.customId === "off") {
            player.setLoop("none");
            embed.setDescription(`Looping is now **disabled**`);
            i.update({ embeds: [embed], components: [] });
          }
        });
        collector.on("end", (collected) => {
          if (collected.size === 0) {
            embed.setDescription(`**Loop** Selection Timed Out`);
            msg.edit({ embeds: [embed], components: [] });
          }
        });
      } else {
        if (
          args[0].toLowerCase() === "queue" ||
          args[0].toLowerCase() === "q" ||
          args[0].toLowerCase() === "full"
        ) {
          await player.setLoop("queue");
          let embeds = new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`Now looping the **queue**`);
          return message.channel.send({ embeds: [embeds] });
        }
        if (
          args[0].toLowerCase() === "track" ||
          args[0].toLowerCase() === "t" ||
          args[0].toLowerCase() === "song" ||
          args[0].toLowerCase() === "current"
        ) {
          await player.setLoop("track");
          let embeds = new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`Now looping the **track**`);
          return message.channel.send({ embeds: [embeds] });
        }
        if (
          args[0].toLowerCase() === "off" ||
          args[0].toLowerCase() === "disable" ||
          args[0].toLowerCase() === "false" ||
          args[0].toLowerCase() === "none"
        ) {
          await player.setLoop("none");
          let embeds = new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`Looping is now **disabled**`);
          return message.channel.send({ embeds: [embeds] });
        } else if (
          args[0].toLowerCase() !== "track" ||
          args[0].toLowerCase() !== "t" ||
          args[0].toLowerCase() !== "song" ||
          args[0].toLowerCase() !== "current" ||
          args[0].toLowerCase() !== "queue" ||
          args[0].toLowerCase() !== "q" ||
          args[0].toLowerCase() !== "full" ||
          args[0].toLowerCase() !== "off" ||
          args[0].toLowerCase() !== "disable" ||
          args[0].toLowerCase() !== "false"
        ) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(`#FF0000`)
                .setDescription(
                  `Invalid Loop Options!\nValid methods: \`track\`, \`queue\`, \`off\``
                ),
            ],
          });
        }
      }
    } catch (err) {
      console.log(err);
      message.channel.send(
        `There was an error while executing this command! Please try again later.`
      );
    }
  },
};











