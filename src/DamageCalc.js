import { RollDice } from "./Utilities/RollDice"

function DamageCalc(weapon, weaponCount, target, targetAbilities){
  
  let damageStats = {attacks:0, attacksHit:0, wounds:0, attackSaved:0, toughnessCheck:0, feelNoPain: 0}
  
    console.log("Weapon: ", weapon)
      
    Attacks(weapon, weaponCount, damageStats)
    AttacksHit(weapon, damageStats)
    Wounds(weapon, target, damageStats)
    AttackSaved(weapon, target, targetAbilities, damageStats)
    
    console.log(damageStats)
    console.log("Remaining Wounds: ", damageStats.wounds - damageStats.attackSaved)
    return damageStats
  
}

/* 
this function calculates the number of attacks the selected unit randomly assigns
d3 and d6 attacks are randomly rolled here 
after all rolls weapon count multiplies attacks
potential bug d3 and d6 attacks arent rolled multiple times for multiple units
*/

function Attacks(weapon, weaponCount, damageStats) { 
  
  const regex = new RegExp("(\\d?)(D?)(\\d?)\\+?(\\d?)")
  let attacks = 0;

  const split = regex.exec(weapon?.attacks)
  console.log(split)
  if (split[2] === "D") {
    for (let i = 0; i < +(split[1] || 1); i++) {
      attacks += RollDice(+split[3]) + parseInt(split[4] || 0)
    }
  } else {
    attacks = +split[1]
  }

  damageStats.attacks = weaponCount * attacks
  console.log("Attacks made: ", damageStats.attacks)
  
}

/*
if weapon skill is NA, all attacks hit (ie flamethrowers)
else we roll each attack and see if the roll is greater than or equal to the units weaponskill
*/

function AttacksHit(weapon, damageStats) {
  
  if(weapon.skill === "N/A") {
    
    damageStats.attacksHit = damageStats.attacks;
    
  } else {
    
    const weaponSkill = +weapon.skill[0]
     
    for(let i = 0; i < damageStats.attacks; i++) {
      if(RollDice(6) >= weaponSkill)
      {
        damageStats.attacksHit++
      }
    }
  }
  
  console.log("Attacks hit: ", damageStats.attacksHit)
  
}

/*
to figure out what our offensive unit wounds on we need first hit the toughness check function
then we roll dice and if they are greater than or equal to the wound on we add a wound
*/

function Wounds(weapon, target, damageStats) {
  
  console.log("Target: ", target)
  
  const woundOn = ToughnessCheck(+weapon.strength, +target.t)
  console.log("Wound On: ", woundOn)
  
  for(let i = 0; i < damageStats.attacksHit; i++)
  {
    if (RollDice(6) >= woundOn)
    {
      damageStats.wounds++
    }
  }

  console.log("Wounds: ", damageStats.wounds)
}

/*first check is to see if our defensive unit has a feel no pain
next if the unit cant save (its save is greater than 6) we add the feel no pain roll to the attacks saved
if our save is less than the invuln save we set save to invuln
for each wound we roll saves and if d6 is greater than or equal to the save on it counts as an attack saves
at the end we calculate feel no pains from any leftover wounds
*/
function AttackSaved(weapon, target, targetAbilities, damageStats) {
  
  const invuln = targetAbilities.invulnerablesave.save
  let fnp
  console.log("Invuln", invuln)
  const saveOn = +(target.sv[0]) - +(weapon.ap)
  console.log("save on: ", saveOn)
  
  if(targetAbilities.core){
  for(let i = 0; i < targetAbilities.core.length; i++){
    if(targetAbilities.core[i].includes("Feel")){
      fnp = +targetAbilities.core[i][13]
    }
  }
}
  
  if(fnp > 0){
    console.log("Feel no pain: ", fnp)
  }

  if (saveOn > 6) {
    
    damageStats.attackSaved = FeelNoPain(fnp, damageStats.wounds);
    
  }
  if (saveOn < invuln) {
    
    saveOn = invuln;
    
  }

  for (let i = 0; i < damageStats.wounds; i++)
  {
    if (RollDice(6) >= (saveOn))
      damageStats.attackSaved++;
  }
  
  console.log("Saves: ", damageStats.attackSaved)
  damageStats.attackSaved += FeelNoPain((damageStats.wounds - damageStats.AttackSaved), fnp)
  console.log("Attacks Saved: ", damageStats.attackSaved)
  
  
}

/* 
this calc checks the offensive units strength against the defensive units toughness
this formula is just base warhammer rules 
if strength is 2x the toughness wound on 2+
if strength is greater than toughness wound on 3+
if stregnth equals toughness wound on 4+
if strength is lesss than toughness we wound on 5+
if strength is less than or equal to half the toughness we wound on 6+
*/

function ToughnessCheck(strength, toughness) {
  
  console.log("Weapon Strength: ", strength)
  console.log("Toughness: ", toughness)
  
  if (strength >= (toughness * 2)) {
   
    return 2;
  }
  if (strength > toughness) {
 
    return 3;
  }
  if (strength == toughness) {
   
    return 4;
  }
  if (strength <= (toughness * 0.5)) {
  
    return 6;
  }
  if (strength < toughness) {
    
    return 5;
  }

  return 0;

}

/*
we check the defensive units feel no pain
after the check we only apply it if there are leftover wounds
d6 is rolled and if it is greater than or equal to the defensive feel no pain we save another roll
*/

function FeelNoPain(wounds, fnp) {
  
  let saves
  
  if(wounds <= 0){
    
    return 0
    
  } 
  
  for(let i = 0; i < wounds; i++){
    if(RollDice(6) >= fnp){
      saves++
    }
  }

  console.log("Feel No Pain Blocked: ", 0)
  return 0
}


export default DamageCalc