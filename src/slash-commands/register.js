require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // optional

if (!token || !clientId) {
    console.warn('Missing BOT_TOKEN or CLIENT_ID in environment. Skipping command registration.');
}

const commands = [];
const commandsPath = path.join(__dirname);
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== path.basename(__filename));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command && command.data && typeof command.data.toJSON === 'function') {
        commands.push(command.data.toJSON());
        console.log(`Loaded command from ${file}`);
    } else {
        console.warn(`Skipping ${file} — missing valid \'data\' export`);
    }
}

if (token && clientId) {
    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            if (guildId) {
                console.log(`Registering ${commands.length} commands to guild ${guildId}...`);
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
                console.log('Successfully registered guild commands.');
            } else {
                console.log(`Registering ${commands.length} global commands...`);
                await rest.put(Routes.applicationCommands(clientId), { body: commands });
                console.log('Successfully registered global commands.');
            }
        } catch (error) {
            console.error('Failed to register commands:', error);
        }
    })();
} else {
    console.log('Command registration skipped. Set BOT_TOKEN and CLIENT_ID to enable registration.');
}
