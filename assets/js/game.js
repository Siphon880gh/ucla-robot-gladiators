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

// You can also log multiple values at once like this
console.log("Debug: Your stats:")
console.table({playerName, playerAttack, playerHealth});

var enemyName = "Roborto";
var enemyHealth = 50;
var enemyAttack = 12;

var firstFight = true;

var fight = function() {
    if(firstFight) {
        firstFight = false;
        window.alert("Welcome to Robot Gladiators!");
    }

    const oriPlayerHealth = playerHealth;
    const oriEnemyHealth = enemyHealth;

    playerHealth -= enemyAttack;
    enemyHealth -= playerAttack;

    console.log(`${playerName} attacks ${enemyName}... enemy health points decreased ${oriEnemyHealth} --> ${enemyHealth}`);
    console.log(`${enemyName} attacks ${playerName}... your health points decreased ${oriPlayerHealth} --> ${playerHealth}`);

};

fight();