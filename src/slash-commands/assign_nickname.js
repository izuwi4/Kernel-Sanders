//TODO make the replies only last 5 seconds
const { SlashCommandBuilder, Role } = require('discord.js')
const ENUMN = {
	EPHEMIRAL: 64 //temporary message only visible to user
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('assign_nickname') //name of the command
        .setDescription('Change your own nickname')//descrption displayed
        .addStringOption(option =>//input
            option.setName('nickname')//name of the input
                .setDescription('Your new nickname')//description of the parameter
                .setRequired(true)),//must be put in
    
    async execute(interaction) {//what is actually going ot be done
		const nickname = interaction.options.getString('nickname')//get the received string
		// const user = interaction.user //the user who called teh command
		roleToAssign=process.env.STANDARD_ROLE//the role to assign from the env
		successfullyExecuted = true //track if both tries succeeded
		try {
			await interaction.member.setNickname(nickname)//change the users nickname to the one provied
		} catch (error) {//if the name could not be changed
			console.error(error)//log the error
			await interaction.reply({ //reply to the message prompting the command
				content: 'Failed to change your nickname. Make sure I have the "GuildMembers" permission.', //what will be said
				flags: ENUMN.EPHEMIRAL //flags as ephemeral
			})
			successfullyExecuted = false //the role was not sucessfully assigned

		} try {
			await interaction.member.edit({roles: roleToAssign})//assign the user the standard role
		} catch (error) { //if the name could not be changed
			console.error(error) //log the error
			await interaction.reply({ //reply to the message prompting the command
				content: 'Failed to change your role. Make sure I have the "GuildMembers" permission.', //what will be said
				flags: ENUMN.EPHEMIRAL //flags as ephemeral
			})
			successfullyExecuted = false //the role was not sucessfully assigned
		}
		if(successfullyExecuted){ //if both alterations were executed
			await interaction.reply({ //reply to he message prompting the command
				content: `success!`,//what will be said
				flags: ENUMN.EPHEMIRAL //flags as ephemeral
			})
		}
	}
}
