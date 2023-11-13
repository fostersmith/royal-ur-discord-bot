const { Client, GatewayIntentBits, Partials, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const {RoyalGameOfUr, ROLLING, MOVING} = require("./ur/RoyalGameOfUr");
const SomeClass = require("./ur/SomeClass");
const client = new Client({ 
    intents: 
    [GatewayIntentBits.Guilds,], 
});
const config = require("./config");
const makeButtons = require('./ur/makeButtons');
const setButtons = require('./ur/SetButtons');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// JSON mapping game id number to gameInfo JSON
let games = {};

urButtonUpdate = async (gameInfo) => {
    setButtons(gameInfo.game, gameInfo.rows);
    await gameInfo.interaction.editReply({content: scoreStr(gameInfo),components: gameInfo.rows.slice(0, 5)});
    await gameInfo.msg.edit({components: gameInfo.rows.slice(5,9)});            
};

const scoreStr = (gameInfo) => {
    const game = gameInfo.game;
    let str = "";
    str += "Player 1:\n";
    str += "\tTiles:\t  ";
    for(let i = 0; i < game.piecesAvailable[0]; ++i) str += "\u{1F315} ";
    for(let i = game.piecesAvailable[0]; i < 7; ++i) str += "⭕ ";
    str += "\n\tScore:\t";
    for(let i = 0; i < game.points[0]; ++i) str += "\u{1F315} ";
    for(let i = game.points[0]; i < 7; ++i) str += "⭕ ";
    str += "\n";
    str += "Player 2\n";
    str += "\tTiles:\t  ";
    for(let i = 0; i < game.piecesAvailable[1]; ++i) str += "\u{1F311} ";
    for(let i = game.piecesAvailable[1]; i < 7; ++i) str += "⭕ ";
    str += "\n\tScore:\t";
    for(let i = 0; i < game.points[1]; ++i) str += "\u{1F311} ";
    for(let i = game.points[1]; i < 7; ++i) str += "⭕ ";
    str += "\n\n";
    str += `${gameInfo.players[gameInfo.game.player].globalName}'s turn (P${gameInfo.game.player+1})`
    //console.log(str);
    return str;
}

const resetDice = (gameInfo) => {
    gameInfo.rollMsg.edit({content: "\u{1F7E6} \u{1F7E6} \u{1F7E6} \u{1F7E6} = ???"})
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {

    if(!interaction.channel){
        interaction.reply("Sorry, this channel is not supported. Try this command in a guild, or check bot permissions.");
        return;
    }

    if(interaction.isChatInputCommand()){

        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }  else if(interaction.commandName === "ur"){

            const p1 = interaction.user;
            const p2Id = interaction.options.get("opponent").value;
            const p2 = client.users.cache.get(p2Id) || client.users.fetch(p2Id);

            if(!p1 || !p2) {interaction.reply("User not found."); return; }

            let id;
            do {
                id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            } while(id in games)

            let rows = makeButtons(id);
            let game = new RoyalGameOfUr();

            setButtons(game, rows);
            await interaction.reply({components:rows.slice(0, 5)});
            const msgRef = await interaction.channel.send({components:rows.slice(5,9)});

            const rollButton = new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(id+";roll").setLabel("Roll");
            const rollActionRow = new ActionRowBuilder().addComponents(rollButton);

            const rollMsg = await interaction.channel.send({components:[rollActionRow]});

            const gameInfo = {
                game: game,
                interaction: interaction,
                msg: msgRef,
                rollMsg: rollMsg,
                rows: rows,
                players: [p1, p2],
                rollActionRow: rollActionRow,
            }
            games[id] = gameInfo;

            await urButtonUpdate(gameInfo);
            await resetDice(gameInfo);

            /*await urButtonUpdate(gameInfo);
            await urRoll(gameInfo);*/

        }
    } else if(interaction.isButton()){

        const comps = interaction.customId.split(";");
        const gameId = parseInt(comps[0]);

        const gameInfo = games[gameId];

        if(interaction.user != gameInfo.players[gameInfo.game.player]){
            interaction.reply("Wait your turn!");
            await delay(1000);
            interaction.deleteReply();
            return;
        }

        if(comps[1] != "roll"){

            if(gameInfo.game.gameState != MOVING){
                await interaction.editReply("Roll before you move!");
                await delay(1000);
                interaction.deleteReply();
                return;
            }

            const player = comps[1];
            const i = parseInt(comps[2]);

            if(player == "s" || parseInt(player) == gameInfo.game.player)
                gameInfo.game.move(i);
            else {
                interaction.reply("You can't do that!");
                await delay(1000);
                interaction.deleteReply();
                return;
            }

            if(gameInfo.game.points[0] == 7){
                await interaction.deferReply();
                await gameInfo.interaction.editReply({content: scoreStr(gameInfo)});
                gameInfo.game.gameState = ROLLING;
                await urButtonUpdate(gameInfo);
                await interaction.editReply("Player 1 Wins!!");
            } else if (gameInfo.game.points[1] == 7){
                await interaction.deferReply();
                await gameInfo.interaction.editReply({content: scoreStr(gameInfo)});
                gameInfo.game.gameState = ROLLING;
                await urButtonUpdate(gameInfo);
                await interaction.editReply("Player 2 Wins!!");
            } else {
                await interaction.update({});
                await resetDice(gameInfo);
                await urButtonUpdate(gameInfo);
            }

        } else { // Code for roll button

            if(gameInfo.game.gameState != ROLLING){
                await interaction.reply("Wait until you can roll!");
                await delay(1000);
                interaction.deleteReply();
                return;
            }

            //urRoll(gameInfo);
            gameInfo.game.roll();


            let diceStr = "";
            //console.log(gameInfo.game.dice);
            gameInfo.game.dice.forEach( die => diceStr += (die == 0 ? "\u{1F7E6} " : "⏺️ ") )

            diceStr += " = " + gameInfo.game.moves;

            await urButtonUpdate(gameInfo);

            await gameInfo.rollMsg.edit({content: diceStr, components: [gameInfo.rollActionRow]});

            await interaction.update({});
        }

    }
});

client.login(config.token);