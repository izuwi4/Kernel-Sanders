//TODO make the replies only last 5 seconds
const { Role, roleMention } = require('discord.js')
const { SlashCommandBuilder} = require('discord.js')
const ENUMN = {
	EPHEMIRAL: 64 //only visible to user
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('assign_nickname') //name of the command
        .setDescription('this is required to access the rest of the server')//descrption displayed
        .addStringOption(option =>//input
            option.setName('nickname')//name of the input
                .setDescription('Your new nickname')//description of the parameter
                .setRequired(true)),//must be put in
    
    async execute(interaction) {//what is actually going ot be done
		const nickname = interaction.options.getString('nickname')//get the received string

		//fetches a role object with the given id for the default role from the guilds cache
		roleToApply = await interaction.guild.roles.fetch(process.env.STANDARD_ROLE) 
			if (roleToApply){//if the standard role id is valid
			response = ''//what will be returned at the end
			roleToAssign=process.env.STANDARD_ROLE//the role to assign from the env
			successfullyExecuted = true //track if both tries succeeded
				
			try {
				await interaction.member.setNickname(nickname) //set the nickname to the given string

				
				roleToApply = await interaction.guild.roles.fetch(process.env.STANDARD_ROLE) 
				await interaction.member.roles.add(roleToApply)//add the default role to them
			} catch (error) { //if the name and role could not be changed
				console.error(error) //log the error
				response = 'Failed to change your nickname or role. Make sure I have the "GuildMembers" permission.'
				successfullyExecuted = false //the role was not sucessfully assigned
			}

			if(successfullyExecuted){ //if both alterations were executed
				response = 'success'
			}
		} else{ //if the standard role env variable is not a valid role id in the server
			response = 'no such role exists'
		}
		await interaction.reply({ //finallyy reply to the initial slash command
			content: response,//what will be said
			flags: ENUMN.EPHEMIRAL //will only be visible to the user
		})		
	}
}
