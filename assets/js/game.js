console.info("%cApp init: %cPassed", "font-weight:bold", "font-style:italic; color:green;");

class Robot {
    constructor() {

    }
} // Robot

// Game States
// "WIN" - Player robot has defeated all enemy-robots
//          * Fight all enemy-robots (guess: probably a For loop through an array of enemy objects)
//          * Defeat all enemy-robots (guess: probably when For loop reaches end and the player hasn't gamed over)
// "LOSE" - Player robot's health is zero or less

/** <<< Code above are notes */

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

var playerName = ""; // Will override with user input
var playerHealth = oriPlayerHealth = 100; /* Original player health that we reset if player restarts the game */
var playerAttack = 10;
var playerMoney = 10;

var enemyNames = ["Roborto (1st robot)", "Amy Android (2nd robot)", "Robo Trumble (3rd robot)"];
var enemyHealth = oriEnemyHealth = 50; /* Original enemy health that we reset to after every robot */
var enemyAttack = 12;

// var firstFight = true; // Say "Welcome" on the first fight ever

/**
 * WHAT: Fights one enemy robot until player or enemy robot dies
 * HOW: If either player has HP remaining after a fight, call recursively until no HP remains
 * POINT OF COMPLEXITY: User can skip the robot by paying a fee.
 * POINT OF COMPLEXITY: Announces round number for each new robot
 * @param {string} enemyName
 * @param {number} round #
 * 
 */
/* Todo: Review; jsDocs format for functions */
var fight = function(enemyName, itrRobot) {

    // Ask user: Fight or skip
    function askUserFightOrSkip() {
        var promptFight = window.prompt("Would you like to FIGHT or SKIP this battle? Enter 'FIGHT' or 'SKIP' to choose.");
        if(promptFight===null) promptFight = ""; // Force string data type so .toLowerCase() will not throw an error

        // Player wants to skip battle
        if(promptFight.toLowerCase()==="skip") {
            var confirmSkip = window.confirm("Are you sure you'd like to quit? This will cost $2.");
            if(confirmSkip) {

                // Check if player can afford the fee to skip battle */
                if(playerMoney -2 < 0) {
                    alert("You do not have enough to pay the toll. You must fight.");
                    return "fight";
                } else {
                    playerMoney = Math.max(0, playerMoney - 2);
                    console.log(`You skipped fighting ${enemyName}. Your money is now $${playerMoney}`);
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
    const beforePlayerHealth = playerHealth;
    const beforeEnemyHealth = enemyHealth;

    var damage = randomNumber(playerAttack - 3, playerAttack); // Random attack point in the upper 3 point range
    enemyHealth = Math.max(0, enemyHealth - damage);

    var damage = randomNumber(enemyAttack - 3, enemyAttack);
    playerHealth = Math.max(0, playerHealth - enemyAttack);
    
    console.log(`${playerName} attacks ${enemyName}... enemy health points decreased ${beforeEnemyHealth} --> ${enemyHealth}`);
    console.log(`${enemyName} attacks ${playerName}... your health points decreased ${beforePlayerHealth} --> ${playerHealth}`);

    /** Check if anyone died
     * In designing the if statement:
     * - If either robot dies, the product of both HP is 0 or a negative number
     * - Alternately, could've used OR operator || 
     * */
    if(playerHealth * enemyHealth<=0) {
        // clearInterval(battling);
        if(playerHealth<=0) {
            const gameOverMsg = `Game over. Your robot ${playerName} died!`;
            console.log("%c" + gameOverMsg, "color:red; font-weight: bold;");
            alert(gameOverMsg);
            return "lost";
        } else {
            var nextRoundVsShop = `Congrats! ${enemyName} died! Visit the store before the next round?`;
            console.log(nextRoundVsShop);
            var confirmStore = window.confirm(nextRoundVsShop);

            // if yes, take them to the store() function
            if (confirmStore) {
              shop();
            }

            return "won";
        }
    } else if(playerHealth * enemyHealth > 0) {
        return fight(enemyName); // Recursively fight the same enemy until someone dies
    }
};
var firstGame = true;

function startGame() {
    // Reset health on game start or restart
    playerHealth = oriPlayerHealth;
    enemyHealth = oriEnemyHealth;

    // If first ever game, ask for player's robot name
    if(firstGame) {
        firstGame = false;

        // Ask for robot name
        while(playerName==="" || playerName===null) {
            playerName = window.prompt("What is your robot's name?");
        }
    }

    // Todo: Review; Debug; You can also log multiple values at once like this
    console.log("Debug: Your stats:")
    console.table({playerName, playerAttack, playerHealth, playerMoney});

    // Fight all enemy-robots
    for(let i=0; i<enemyNames.length; i++) {
        var enemyName = enemyNames[i];
        enemyHealth = oriEnemyHealth;

        // Call recursive function fight until either lost or win game
        if(fight(enemyName, i)==="lost") {
            break; // Already announced Game Over; Do not go on in the fighting for loop
        } else {
            if(i===enemyNames.length-1) {
                // Won this round at the last robot
                const wonGameMsg = `You won! ${playerName} defeated all enemy robots!`;
                console.info("%c" + wonGameMsg, "color:green; font-weight: bold;");
                alert(wonGameMsg);
            }
        }
    } // for

    endGame();

} // startGame

function endGame() {
    // Show player summary
    if(playerHealth>0) {
        window.alert(`You now have $${playerMoney} left.`);
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
            if (playerMoney >= 7) {
                window.alert("Refilling player's health by 20 for 7 dollars.");

                // increase health and decrease money
                playerHealth = playerHealth + 20;
                playerMoney = playerMoney - 7;
                console.log(`Your health is now at ${playerHealth}. Your money is now at $${playerMoney}`);
            }
            else {
                window.alert("You don't have enough money!");
            }

            break;
        case "upgrade":
            if (playerMoney >= 7) {
                window.alert("Upgrading player's attack by 6 for 7 dollars.");
            
               // increase attack and decrease money
                playerAttack = playerAttack + 6;
                playerMoney = playerMoney - 7;
                console.log(`Your attack is now at ${playerAttack}. Your money is now at $${playerMoney}`);
              }
              else {
                window.alert("You don't have enough money!");
              }
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