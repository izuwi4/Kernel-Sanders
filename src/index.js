/**************************************************************************
* kernel sanders is a bot for a dsicord server i and some friends are in. *
* he is here to facilitate the at times niche rules of the server.        *
**************************************************************************/ 
//just a helpful note, when the term "guild" is used it usually means a discord server


require('dotenv').config();//loads in the enviornment variable(s)
const { Client, IntentsBitField, Collection } = require("discord.js");//loads in the library for discord
const fs = require('fs'); //node's file system library
const path = require('path'); //node's library fo directories (paths)
const { execPath } = require('process');

//create a client object for the bot
const client = new Client({ 
    intents: [//list of permissions
        IntentsBitField.Flags.Guilds, //manage the server itself
        IntentsBitField.Flags.GuildMembers,//manage guild members
        IntentsBitField.Flags.GuildMessages, //send messages
        IntentsBitField.Flags.MessageContent, //reading message content
    ] 
});

// Create collections to store commands and events (simillar to an array)
client.commands = new Collection();

//Load slash commands

//the dir with all of the slash commands
const commandsPath = path.join(__dirname, 'slash-commands');
//reads the contents of the directory and adds each ending with ".js" to an array
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) { //loop through the array of slash command files
    const filePath = path.join(commandsPath, file); //join the directory and the file name

    const command = require(filePath); //import the file
    try{
        client.commands.set(command.data.name, command); //adds the command to the collection
        console.log(`command added: ${command.data.name}`); //print to clarify that is has been added
    }catch(err){//if something went wrong
        console.log(err)//log the error
        console.log(command)//log the command that failed to load
    }
}

// Load events (see above)
const eventsPath = path.join(__dirname, 'react-events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) { //if the event is only to happen once
        client.once(event.name, (...args) => event.execute(...args)); //register the event as a one time event
    } else { //if it will happen more than once
        client.on(event.name, (...args) => event.execute(...args)); //register to happen potentially multiple times
    }
    console.log(`Loaded event: ${event.name}`);
}

//whenever someone interacts with the bot (i.e. slash commands and replies) 
//interaction reptresents the interactoin with the bot
client.on('interactionCreate', async interaction => {

    if (interaction.isChatInputCommand()){//if it is a slash command
        const command = client.commands.get(interaction.commandName);//get the command from the bot
        if (command) {//if the bot recognises the command
            try {
                await command.execute(interaction); //attempts to execute the interaction
            } catch (error) { //if it did not execute correctly
                console.error(error);//log the error

                //reply to the message telling the user there was an error
                await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
            }
        }else{//if the bot does not recognise the command
            console.error(`No command matching ${interaction.commandName} was found.`);//raise an error
        }
    }
});
//registers all the commands with the server
const onClientReady = async () => {//once the client is ready to log in
    
    const commandData = []; //array of all the folders in json
    //creates an array of functiond from the commands registered in the bot
    for (const command of client.commands.values()) {//loops through all the commands registered in the bot
        if (command.data && typeof command.data.toJSON === 'function') {//if the command can be converted into a json function
            commandData.push(command.data.toJSON());//add the json version of the function to the list
        }
    }

    try {
        const guildId = process.env.GUILD_ID; //gets the guild (server) id from the enviornment
        if (guildId) {//if the guild id could be found
            const guild = client.guilds.cache.get(guildId);//cache representing the server
            if (guild) {//if the guild could be made
                await guild.commands.set(commandData);//upload the commands in ther server
                console.log(`Registered ${commandData.length} commands to guild ${guildId}`);
            } else {//if not guild could be loaded
                //raise a warning in the console
                console.warn(`Guild ${guildId} not found in cache. Falling back to global registration.`);
                await client.application.commands.set(commandData);//register the commands globally
                console.log(`Registered ${commandData.length} global commands`);
            }
        } else {//if there is no guild id in the env
            await client.application.commands.set(commandData);//register the commands globally
            console.log(`Registered ${commandData.length} global commands`);
        }
    } catch (err) {//if an error was raised
        console.error('Failed to register commands:', err);
    }
};

// Use clientReady event listener (recommended in discord.js v14+) to register commands when bot is fully ready
client.once('clientReady', onClientReady);//ready up the client with the server

client.login(process.env.BOT_TOKEN);//log into the bot



/*************************************************** 
 *     this is gordon the goat, he eats bugs       *
 * please fix the bugs in your program to feed him *
 *        don't let gordon go hungry!              *
 ***************************************************⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠠⠴⠶⠾⠿⠿⠿⢶⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢿⣿⣆⠐⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠿⠆⠹⠦⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⣤⣤⣀⠐⣶⣶⣶⣶⣶⣶⡀⢀⣀⣀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⢿⣿⡆⢹⡿⠻⢿⣿⣿⣷⠈⠿⠛⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣴⣾⣷⣤⣉⣠⣾⣷⣦⣼⣿⣿⣿⣧⠀⠀⠀⠀⠀
⠀⣶⣶⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀
⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀
⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣛⠻⢧⣘⡷⠀⠀⠀
⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⣉⠛⠿⣷⣦⣌⠁⠀⠀⠀
⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⣠⠘⠀⠀⢹⣿⣶⣶⠀⠀⠀⠀⠀⠀
⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⢺⣿⠀⠀⠀⠘⣿⣿⡟⠀⠀⠀⠀⠀⠀
⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠁⠀⠀⠀⠀⠻⡟⠃⠀⠀⠀⠀⠀⠀
⠀⠛⠛⠛⠛⠛⠛⠛⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀               */