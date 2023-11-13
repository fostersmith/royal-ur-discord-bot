const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { RoyalGameOfUr, isRosette } = require("./RoyalGameOfUr");

module.exports = gameId => {

    const rows = Array(8);


    for(let r = 0; r < 8; ++r){
        rows[r] = new ActionRowBuilder();
        for(let c = 0; c < 3; ++c){
            rows[r].addComponents( new ButtonBuilder().setStyle(ButtonStyle.Primary).setEmoji("▪️") );
        }
    }
    
    // set shared spaces
    for(let i = 0; i < 8; ++i){
        rows[i].components[1].setCustomId(gameId+";s;"+(i+4)).setDisabled(true);
        if(i == 3) 
            rows[i].components[1].setStyle(ButtonStyle.Success);
    }
    // set player spaces
    for(let i = -2; i < 4; ++i){
        rows[3-i].components[0].setCustomId(gameId+";0;"+i).setDisabled(true);
        rows[3-i].components[2].setCustomId(gameId+";1;"+i).setDisabled(true);
        if(i == 3){
            rows[3-i].components[0].setStyle(ButtonStyle.Success);
            rows[3-i].components[2].setStyle(ButtonStyle.Success);
        }
    }
    for(let i = 12; i < 14; ++i){
        rows[19-i].components[0].setCustomId(gameId+";0;"+i).setDisabled(true);
        rows[19-i].components[2].setCustomId(gameId+";1;"+i).setDisabled(true);
        if(i == 13){
            rows[19-i].components[0].setStyle(ButtonStyle.Success);
            rows[19-i].components[2].setStyle(ButtonStyle.Success);
        }
    }
    
    for(let r = 4; r <= 5; ++r){
        for(let c = 0; c <= 3; c += 2){
            rows[r].components[c].setStyle(ButtonStyle.Secondary).setDisabled(true);
        }
    }
    
    return rows;
}