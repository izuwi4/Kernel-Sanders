
const { Client, IntentsBitField } = require("discord.js")

const client = new Client({
    // permissions for the bot
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
    ] 
})
// console.log(process.env.BOT_TOKEN)
client.login(process.env.BOT_TOKEN)
