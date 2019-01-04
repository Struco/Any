var buff = {
        name:'',
        expires:'',
        ticker: '',
};

var skills = {
    fireball: {description: "Deals 8 + level damage", type: "spell"},
    nimble: {description: "adds 20 evasion for next 3 rounds", type: "buff", stat: {name:"EVA",amount:20}, rounds: 3},
    backstab: {description: "Deals 20% of current HP damage",type: "spell"},
    lucky_horseshoe: {description: "Adds 20 critical hit for next 3 rounds",type: "buff", stat:{name:"CRIT",amount:20}, rounds: 3},
    healing_potion: {description: "Restores 10+ level*2 HP",type:"spell"}

}
var player = {level:1,ATK:5,HP:20,INIT:15,EVA:10,CRIT:5,name:"Player",skills:['nimble','',''], buffs:[]};
var enemy = {level:1,ATK:4,HP:15,INIT:20,EVA:10,CRIT:5,name:"Enemy",skills:['','',''], buffs:[]};

class Battle { constructor(attacker,target) {
    this.id = 1;
    this.current_turn = {
                        owner:(attacker.INIT > target.INIT) ? attacker : target,
                        number:1,
                        theAttacked:(attacker.INIT > target.INIT) ? target : attacker                        
                        };
    this.winner = false;
    this.round = 1;
   
   // this.attacker = {ATK:5,HP:20,name:"Player"};
   // this.target = {ATK:4,HP:15,name:"Enemy"};

}};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

function initiateBattle(attacker, target) {
    var battle = new Battle(attacker, target);
    //game.globalBattlesList.add(battle);
    return battle;
 }

 var currentBattle = initiateBattle(player,enemy);

 function attack(battle, attacker, target) {
     
        console.log("Turn "+battle.current_turn.number+" Round "+battle.round + "begins");

        for(var i =0;i<attacker.buffs.length;i++)
        {
            if (battle.round == attacker.buffs[i].validUntil)
            {
                console.log("nimble should end now for "+attacker.name);
            }
        }
     
    
    console.log(attacker.name + " attacks");

    if (battle.current_turn.owner != attacker) { 
       return {result: "error", message: "It's not your turn!"};
    }
    if(battle.round == 1 && attacker.skills[0])
    {
        if (skills[attacker.skills[0]].type == "buff")
        {
            console.log("Buffing up");
            attacker[skills[attacker.skills[0]].stat.name] = attacker[skills[attacker.skills[0]].stat.name] + skills[attacker.skills[0]].stat.amount;
            attacker.buffs.push({name:skills[attacker.skills[0]],validUntil:battle.round+skills[attacker.skills[0]].stat.rounds});
            console.log (attacker);
        }
        
        //target.HP -= attacker.ATK+8;
    }
    else
    {
        var evasion = getRandomInt(0,100);
        if (evasion > target.EVA)
        {
            target.HP -= attacker.ATK;
        }
        else 
        {
            console.log(target.name + " DODGE!" + "rolled "+evasion);
        }
        
    }
    

    if (target.HP <= 0) {       
       //game.end_battle(battle);
       battle.winner = true;
       return {
          status: "OK", 
          winner: attacker,
          message: attacker.name+" wins on round "+battle.round
       };
    }

    // change turn
    
    
    battle.current_turn = {owner: target,theAttacked: attacker, number: battle.current_turn.number + 1};
    if (battle.current_turn.number % 2 !=0)
    {
        console.log("Round "+ battle.round + " ends")
        battle.round = battle.round+1;
    }
    return { 
        result: "continue", 
        message: `${target.name} is at ${target.HP} HP`
    };
}
function CheckIfBuffExpired(round, validuntil){
    if (round == validuntil)
    {
        return true;
    }
    else{
        return false;
    }
}
while (!currentBattle.winner)
{
    var results = attack(currentBattle,currentBattle.current_turn.owner,currentBattle.current_turn.theAttacked);
//var results = attack(currentBattle,player,enemy);

console.log(results);
}
