const { DiscordAPIError } = require("discord.js");
const Jimp = require('jimp');
const fs = require('fs');

/*
**  This is the main feature of SaguskyBot, the ability to locally create memes without an external database.
**
**  A lot of inspiration is being taken from ESMBot, however with ESMbot all the images are processed through
** A database which can result in slow upload times and sometimes things not working at all.
**
** If this works as intended, all of the image manufacturing should be done directly on Discord.
**
** This is a very rough version of this program, I will be updating it later.
**
*/

module.exports = {
    name: 'meme',
    description: "This command makes a meme from a member",
    execute(message, args) {
        const member = message.mentions.users.first();
        if (!args[1]) return message.channel.send("You need to give the text you want to apply to the image!");
        if (!message.attachments.first()) return message.channel.send("You need to provide an image!");

        try {
            console.log(args);
            const [topText, bottomText] = args.slice(1).join(" ").split(",");
                message.channel.startTyping();
                Jimp.read(message.attachments.first(), (err, lenna) => {
                    Jimp.loadFont(Jimp.FONT_SANS_128_WHITE).then(font => {
                        if (err) console.log(err);
                        var yAxisMove = 900
                        if (20 > bottomText.length > 10) {
                            var yAxisMove = 720;
                        } else if (bottomText.length > 20) {
                            var yAxisMove = 580;
                        }
                        lenna
                        .resize(1280, 1080)
                        .quality(100) // set quality
                        .print(font, 75, 20, {
                            text: topText,
                            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                        }, 1100)
                        .print(font, 75, yAxisMove, {
                            text: bottomText,
                            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                        }, 1100)
                        .write("./tmp/" + message.author.id +".jpg"); // save
                    });
                });
                if (!bottomText) {
                    let noBottomText = message.channel.send("You need to add a bottom text! If you dont want a bottom text, just add a  period.");
                    let stoptyping = message.channel.stopTyping();
                    return [noBottomText, stoptyping];
                }
                for (i = 0; i < (1); i++) {
                    setTimeout(function() {
                        message.channel.send({
                            files: ["./tmp/" + message.author.id + ".jpg"]
                        })
                        message.channel.stopTyping();
                        for (i = 0; i < (1); i++) {
                            setTimeout(function() {
                                fs.unlinkSync("./tmp/" + message.author.id + ".jpg")
                            }, 3 * 1000)
                        }
                    }, 3 * 1000)
                }
        }
        catch (error) {
            console.log("problem with meme command");
        }
    }
}