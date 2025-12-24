const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('assign_nickname')
		.setDescription('Placeholder: assign a nickname (no-op)'),
	async execute(interaction) {
		// Intentionally do nothing. Reply to the interaction so Discord doesn't mark it as failed.
		await interaction.reply({ content: 'This command is a placeholder and does nothing.', ephemeral: true });
	},
};
