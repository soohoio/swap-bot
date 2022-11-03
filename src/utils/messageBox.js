const {default: SlackMessageTinyBot} = require('slack-message-tiny-bot')


class MessageBox {
    constructor(){
        this.box = [];
    }

    add(msg){
        this.box.push(msg)
    }

    async send(){
        const message = this.box.join('\n');
        const bot = new SlackMessageTinyBot();
        bot.appendBot({
            slackWebhookUrl: 'https://hooks.slack.com/services/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',
            telegramBot: {
            botToken: '5468096577:AAHcyRIDSRdaW_IMhBjvYO4ePGFOGY4EqNA',
            chatId: '-682068870',
            },
        });
        bot.appendBot({
            slackWebhookUrl: 'https://hooks.slack.com/services/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',
            telegramBot: {
            botToken: '5477256297:AAEKr-4sy9WueFqMIm9VS5W14wTZFuKUcUM',
            chatId: '-694937562',
            },
        });

        await bot.sendMessage({
            botIndex: 1,
            message
        })

        this.box = [];
    }
}

module.exports.messageBox = new MessageBox()