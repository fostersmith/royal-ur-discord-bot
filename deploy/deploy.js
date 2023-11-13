const config = require("../config")
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const {SlashCommandBuilder} = require("discord.js");

const sollySays = new SlashCommandBuilder().setName("solomonsays")
.setDescription("generate very real custom solomon hergesheimer quote")
.addStringOption(option => option.setName("quote").setDescription("quote from solomon hergesheimer").setRequired(true))
.toJSON();

const dm = new SlashCommandBuilder()
.setName('dm')
.setDescription('send real dm from solomon hergesheimer')
.addMentionableOption(
  option =>
  option.setName('username')
  .setDescription('user to send dm to')
  .setRequired(true)
)
.addStringOption(
  option =>
  option.setName('message')
  .setDescription('message from the real solomon herghesheimer')
  .setRequired(true)
)

const gethistory = new SlashCommandBuilder()
.setName("gethistory")
.setDescription('get dm history')
.addMentionableOption(
  option =>
  option.setName('username')
  .setDescription('username')
  .setRequired(true)
)

const ur = new SlashCommandBuilder()
.setName("ur")
.setDescription("challenge opponent to the royal game of ur")
.addMentionableOption(
  option =>
  option.setName("opponent")
  .setDescription("challenge this person")
  .setRequired(true)
)

const commands = [
  {
    name: 'ping',
    description: 'pong'
  },
  ur
];


(async () =>{
try {
    const rest = new REST({ version: '10' }).setToken(config.token);
    console.log('Started refreshing application (/) commands.');

    //console.log("Commands in body: "+JSON.stringify(commands));

    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
})()