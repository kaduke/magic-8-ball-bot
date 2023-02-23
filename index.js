const { Client, GatewayIntentBits, SlashCommandBuilder, SlashCommandStringOption, REST, Routes } = require('discord.js');

const CLIENT_ID = process.env.MAGIC_8_BALL_CLIENT_ID;
const TOKEN = process.env.MAGIC_8_BALL_TOKEN;

const ASK_COMMAND_NAME = 'ask';
const ASK_COMMAND_ANSWERS = [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
    'Reply hazy, try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
    'Don\'t count on it',
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful',
];
const REST_VERSION = '10';

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const rest = new REST({ version: REST_VERSION }).setToken(TOKEN);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', async () => {
    console.log(`Connected as ${client.user.tag}!`);

    // Register "ask" slash command
    console.log('Starting to refresh application slash commands.');
    const askCommand = new SlashCommandBuilder()
        .setName(ASK_COMMAND_NAME)
        .setDescription('Ask me anything')
        .addStringOption(
            new SlashCommandStringOption()
                .setName('question')
                .setDescription('The question to ask')
                .setRequired(true)
        );

    await rest.put(Routes.applicationCommands(CLIENT_ID), { 
        body: [askCommand]
    });

    console.log('Successfully refreshed application slash commands.');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === ASK_COMMAND_NAME) {
        await interaction.reply({
            content: getRandomElement(ASK_COMMAND_ANSWERS)
        });
    }
});

client.login(TOKEN);