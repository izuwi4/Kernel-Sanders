const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assign_nickname') //name of the command
        .setDescription('Change your own nickname')//descrption displayed
        .addStringOption(option =>//input
            option.setName('nickname')//name of the input
                .setDescription('Your new nickname')//description of the parameter
                .setRequired(true)),//must be put in
    
    async execute(interaction) {//what is actually going ot be done
		const nickname = interaction.options.getString('nickname');//get the reveived string
		role=process.env.STANDARD_ROLE
		try {
			await interaction.member.setNickname(nickname);//change the users nickname to the one provied
			await member.roles.add(role);//assign the user the standard role
			await interaction.reply({ //reply to he message prompting the command
				content: `Added the ${role.name} role!`,//what will be said
				ephemeral: true //make the message temporary
			})
		} catch (error) {//if the name could not be changed
			console.error(error);//log the error
			await interaction.reply({ //reply to the message prompting the command
				content: 'Failed to change your nickname. Make sure I have the "Manage Nicknames" permission.', //what will be said
				ephemeral: true //temporary message
			});
		}
	}
};