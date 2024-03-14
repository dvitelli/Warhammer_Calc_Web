import { RollDice } from "./Utilities/RollDice"

function DamageCalc(weapon, weaponCount, target, targetAbilities, targetCount){
  
  let damageStats = {attacks:0, attacksHit:0, wounds:0, attackSaved:0, toughnessCheck:0, feelNoPain: 0}
  
    console.log("Weapon: ", weapon)
      
    Attacks(weapon, weaponCount, damageStats)
    AttacksHit(weapon, damageStats)
    Wounds(weapon, target, damageStats)
    AttackSaved(weapon, target, targetAbilities, damageStats)
    FeelNoPain()
    
    console.log("Remaining Wounds: ", damageStats.wounds - damageStats.attackSaved)
  
}

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