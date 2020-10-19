// Game States
// "WIN" - Player robot has defeated all enemy-robots
//          * Fight all enemy-robots (guess: probably a For loop through an array of enemy objects)
//          * Defeat all enemy-robots (guess: probably when For loop reaches end and the player hasn't gamed over)
// "LOSE" - Player robot's health is zero or less

/**
 * Math.random()
 * Generate random number from min... x... max, where x is a whole number
 * @param {*} min Lowest random number
 * @param {*} max Highest random number
 * 
 * Mathematical Proof: 
 * - Math.random() returns a value from 0 to 1 but never 1, so it can return 0.9999999 close to 1
 * - If returned 0, then lowest random number will be 0. Add 1 to prevent this. 1 times min will be min, so lowest random number will be min.
 * - If returned 0.999999, then highest random number will be max-1, but if you add 1, then the highest random number will be max because 1 times max is max.
 * 
 * TODO: Review; Math.random
 * 
 */
var randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

var playerInfo = {
    name: "", // Will override with user input
    health: 100,
    attack: 10,
    money: 10,
    reset: function() { /* TODO: Review; Do not use arrow function or else *this* will not work */
        this.health = 100;
        this.money = 10;
        this.attack = 10;
    },
    refillHealth: function() {
        if (this.money >= 7) {
          window.alert("Refilling player's health by 20 for 7 dollars.");
          this.health += 20;
          this.money -= 7;
        } 
        else {
          window.alert("You don't have enough money!");
        }
    },
    upgradeAttack: function() {
        if (this.money >= 7) {
          window.alert("Upgrading player's attack by 6 for 7 dollars.");
          this.attack += 6;
          this.money -= 7;
        } 
        else {
          window.alert("You don't have enough money!");
        }
    }
}; // playerInfo

var enemyInfo = [
    {
        name: "Roborto (1st robot)",
        health: 50,
        attack: randomNumber(10, 14),
        shield: {
            type: "wood",
            strength: 10
        }
    },
    {
        name: "Amy Android (2nd robot)",
        health: 50,
        attack: randomNumber(10, 14)
    },
    {
        name: "Robo Trumble (3rd robot)",
        health: 50,
        attack: randomNumber(10, 14)
    }
] // enemyInfo

function resetEnemyHealths() {
    for(var i=0; i<enemyInfo.length; i++) {
        var enemy = enemyInfo[i];
        enemy.health = 50;
    }
}

/**
 * WHAT: Fights one enemy robot until player or enemy robot dies
 * HOW: If either player has HP remaining after a fight, call recursively until no HP remains
 * POINT OF COMPLEXITY: User can skip the robot by paying a fee.
 * POINT OF COMPLEXITY: Announces round number for each new robot
 * @param {object} enemy
 * @param {number} round #
 * 
 */
/* Todo: Review; jsDocs format for functions */
var fight = function(enemy, itrRobot) {

    // Ask user: Fight or skip
    function askUserFightOrSkip() {
        var promptFight = window.prompt("Would you like to FIGHT or SKIP this battle? Enter 'FIGHT' or 'SKIP' to choose.");
        if(promptFight===null) promptFight = ""; // Force string data type so .toLowerCase() will not throw an error

        // Player wants to skip battle
        if(promptFight.toLowerCase()==="skip") {
            var confirmSkip = window.confirm("Are you sure you'd like to quit? This will cost $2.");
            if(confirmSkip) {

                // Check if player can afford the fee to skip battle */
                if(playerInfo.money -2 < 0) {
                    alert("You do not have enough to pay the toll. You must fight.");
                    return "fight";
                } else {
                    playerInfo.money = Math.max(0, playerInfo.money - 2);
                    console.log(`You skipped fighting ${enemy.name}. Your money is now $${playerInfo.money}`);
                    return "skip";
                }
            } else {
                // Else nothing, because the code continues to run, and the fight starts
            }
        } else if(promptFight.toLowerCase()!=="fight") {
            window.alert("You need to choose a valid option. Try again!");
            return askUserFightOrSkip();
        }

        if(typeof itrRobot!=="undefined" && itrRobot!==-1) {
            alert("Welcome to Robot Gladiators: Round " + (itrRobot + 1) + "!");
            itrRobot = -1;
        }

        return "fight";
    } // askUserFightOrSkip

    if(askUserFightOrSkip()==="skip") {

        return;
    }

    // Deduct HP points from attacks
    const beforeEnemyHealth = enemy.health;
    const beforePlayerHealth = playerInfo.health;

    var damage1 = randomNumber(playerInfo.attack - 3, playerInfo.attack); // Random attack point in the upper 3 point range
    enemy.health = Math.max(0, enemy.health - damage1);

    var damage2 = randomNumber(enemy.attack - 3, enemy.attack);
    playerInfo.health = Math.max(0, playerInfo.health - damage2);
    
    console.log(`${playerInfo.name} attacks ${enemy.name}... enemy health points decreased ${beforeEnemyHealth} --> ${enemy.health}`);
    console.log(`${enemy.name} attacks ${playerInfo.name}... your health points decreased ${beforePlayerHealth} --> ${playerInfo.health}`);

    /** Check if anyone died
     * In designing the if statement:
     * - If either robot dies, the product of both HP is 0 or a negative number
     * - Alternately, could've used OR operator || 
     * */
    if(playerInfo.health * enemy.health<=0) {
        // clearInterval(battling);
        if(playerInfo.health<=0) {
            const gameOverMsg = `Game over. Your robot ${playerInfo.name} died!`;
            console.log("%c" + gameOverMsg, "color:red; font-weight: bold;");
            alert(gameOverMsg);
            return "lost";
        } else {
            var nextRoundVsShop = `Congrats! ${enemy.name} died! Visit the store before the next round?`;
            console.log(nextRoundVsShop);
            var confirmStore = window.confirm(nextRoundVsShop);

            // if yes, take them to the store() function
            if (confirmStore) {
              shop();
            }

            return "won";
        }
    } else if(playerInfo.health * enemy.health > 0) {
        return fight(enemy); // Recursively fight the same enemy until someone dies
    }
};
var firstGame = true;

function startGame() {
    // Reset health on game start or restart
    playerInfo.reset();
    resetEnemyHealths();

    // If first ever game, ask for player's robot name
    if(firstGame) {
        firstGame = false;

        // Ask for robot name
        while(playerInfo.name==="" || playerInfo.name===null) {
            playerInfo.name = window.prompt("What is your robot's name?");
        }
    }

    // Todo: Review; Debug; You can also log multiple values at once like this
    console.log("Debug: Your stats:")
    console.table(playerInfo);

    // Fight all enemy-robots
    for(let i=0; i<enemyInfo.length; i++) {
        var enemy = enemyInfo[i];

        // Call recursive function fight until either lost or win game
        if(fight(enemy, i)==="lost") {
            break; // Already announced Game Over; Do not go on in the fighting for loop
        } else {
            if(i===enemyInfo.length-1) {
                // Won this round at the last robot
                const wonGameMsg = `You won! ${playerInfo.name} defeated all enemy robots!`;
                console.info("%c" + wonGameMsg, "color:green; font-weight: bold;");
                alert(wonGameMsg);
            }
        }
    } // for

    endGame();

} // startGame

function endGame() {
    // Show player summary
    if(playerInfo.health>0) {
        window.alert(`You now have $${playerInfo.money} left.`);
    }

    // Ask if user wants to restart game
    var confirmRestartGame = window.confirm("Would you like to play again?");
    if(confirmRestartGame) {
        startGame();
    } else {
        window.alert(`Thank you for playing Robot Gladiators! Come back soon!`);
    }
} // endGame

function shop() {
    // console.log("Entered shop");
      // ask player what they'd like to do
    var shopOptionPrompt = window.prompt(
        "Would you like to REFILL your health, UPGRADE your attack, or LEAVE the store? Please enter one: 'REFILL', 'UPGRADE', or 'LEAVE' to make a choice."
    );
    if(shopOptionPrompt===null || typeof shopOptionPrompt==="undefined") shopOptionPrompt = ""; // force data type to string
    shopOptionPrompt = shopOptionPrompt.toLowerCase(); // make response all lowercase to simplify switch logic

    // use switch to carry out action
    switch (shopOptionPrompt) {
        case "refill":
            playerInfo.refillHealth();
            break;
        case "upgrade":
            playerInfo.upgradeAttack();
            break;
        case "leave":
            window.alert("Leaving the store.");
            break;
        default:
            window.alert("You did not pick a valid option. Try again.");
            // call shop() again to force player to pick a valid option
            shop();
            break;
    } // switch
} // shop