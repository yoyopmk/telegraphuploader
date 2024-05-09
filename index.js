const { Telegraf } = require('telegraf');
const telegraph = require('telegraph-node');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Telegraph client
const telegraphClient = new telegraph();

// Set up the bot token
const botToken = process.env.BOT_TOKEN;

// Set up the telegraph client with the API credentials
const authorName = 'laksh-botto-nny'; // Change this if needed
telegraphClient.createAccount({
    short_name: 'laksh-botto-nny',
    author_name: authorName
})
.then(account => console.log('Telegraph account created:', account))
.catch(error => console.error('Error creating Telegraph account:', error));

// Create a new bot instance
const bot = new Telegraf(botToken);

// Start command handler
bot.start((ctx) => ctx.reply('Hi! Send me any file and I will upload it to Telegraph and return the link to you.'));

// File handler
bot.on('document', async (ctx) => {
    try {
        const fileId = ctx.message.document.file_id;
        const file = await ctx.telegram.getFile(fileId);

        // Download the file
        const filePath = `${__dirname}/downloads/${fileId}.${ctx.message.document.file_name.split('.').pop()}`;
        await ctx.telegram.downloadFile(file.file_path, filePath);

        // Upload the file to Telegraph
        const telegraphResponse = await telegraphClient.upload(filePath);

        // Send back the link to the user
        await ctx.replyWithHTML(`<a href="${telegraphResponse.url}">Here is the link to your file on Telegraph</a>`);
    } catch (error) {
        console.error('Error processing file:', error);
        await ctx.reply('Sorry, there was an error processing your file.');
    }
});

// Start the bot
bot.launch()
    .then(() => console.log('Bot is running'))
    .catch((error) => console.error('Error starting bot:', error));
