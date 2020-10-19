console.info("%cApp init: %cPassed", "font-weight:bold", "font-style:italic; color:green;");

class Robot {
    constructor() {

    }
} // Robot

/** <<< Code above are notes */

var playerName = "";
while(playerName==="" || playerName===null) {
    playerName = window.prompt("What is your robot's name?");
}
var playerHealth = 100;
var playerAttack = 10;

// Todo: Review; Debug; You can also log multiple values at once like this
console.log("Debug: Your stats:")
console.table({playerName, playerAttack, playerHealth});

var enemyName = "Roborto";
var enemyHealth = 50;
var enemyAttack = 12;

var firstFight = true;

var fight = function() {
    // Welcome message if first fight
    if(firstFight) {
        firstFight = false;
        window.alert("Welcome to Robot Gladiators!");
    }

    // Deduct HP points from attacks
    const oriPlayerHealth = playerHealth;
    const oriEnemyHealth = enemyHealth;
    playerHealth -= enemyAttack;
    enemyHealth -= playerAttack;
    console.log(`${playerName} attacks ${enemyName}... enemy health points decreased ${oriEnemyHealth} --> ${enemyHealth}`);
    console.log(`${enemyName} attacks ${playerName}... your health points decreased ${oriPlayerHealth} --> ${playerHealth}`);

    /** Check if anyone died
     * In designing the if statement:
     * - If either robot dies, the product of both HP is 0
     * - Alternately, could've used OR operator || 
     * */
    if(playerHealth * enemyHealth===0) {
        clearInterval(battling);
        if(playerHealth===0) {
            const gameOver = `Game over. ${playerName} died!`;
            console.log(gameOver);
            alert(gameOver);
        } else {

            console.log(`Congrats! ${enemyName} died! Onto the next round...`);
        }
    }
};

fight();

/* Battle until a robot reaches 0 hp */
const roundTime = 200;
const battling =  setInterval(()=>{
    fight();

}, roundTime);