const { SlashCommandBuilder } = require('discord.js');
/* command to test if the bot is working */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responds with pong'),
    async execute(interaction) {
        await interaction.reply('pong');
    },
};
