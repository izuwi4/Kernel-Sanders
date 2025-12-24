//loads in the enviornment variable(s)
require('dotenv').config();
const { Client, IntentsBitField, Collection } = require("discord.js");
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent, // Important for reading message content!
    ] 
});

// Create collections to store commands and events
client.commands = new Collection();

// Load slash commands
const commandsPath = path.join(__dirname, 'slash-commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
        console.log(`⚠️ Command at ${filePath} is missing "data" or "execute" property.`);
    }
}

// Load events
const eventsPath = path.join(__dirname, 'react-events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Loaded event: ${event.name}`);
}

// Handle slash command interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
        }
    }
});

const onClientReady = async () => {
    console.log(`Logged in as ${client.user.tag}`);

    // prepare command data
    const commandData = [];
    for (const command of client.commands.values()) {
        if (command.data && typeof command.data.toJSON === 'function') {
            commandData.push(command.data.toJSON());
        }
    }

    try {
        const guildId = process.env.GUILD_ID;
        if (guildId) {
            const guild = client.guilds.cache.get(guildId);
            if (guild) {
                await guild.commands.set(commandData);
                console.log(`Registered ${commandData.length} commands to guild ${guildId}`);
            } else {
                console.warn(`Guild ${guildId} not found in cache. Falling back to global registration.`);
                await client.application.commands.set(commandData);
                console.log(`Registered ${commandData.length} global commands`);
            }
        } else {
            await client.application.commands.set(commandData);
            console.log(`Registered ${commandData.length} global commands`);
        }
    } catch (err) {
        console.error('Failed to register commands:', err);
    }
};

// Use clientReady event listener (recommended in discord.js v14+) to register commands when bot is fully ready
client.once('clientReady', onClientReady);

client.login(process.env.BOT_TOKEN);
