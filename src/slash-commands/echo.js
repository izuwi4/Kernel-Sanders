const { SlashCommandBuilder } = require('discord.js');
/* command the repeat what is given */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')//name of the command
        .setDescription('Echoes whatever you say')//description of the command
        .addStringOption(option =>//the paramater
            option
                .setName('message')//name of paramater
                .setDescription('The message to echo')
                .setRequired(true)//is it needed
        ),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        await interaction.reply(message); //replies with the message taken in
    },
};
