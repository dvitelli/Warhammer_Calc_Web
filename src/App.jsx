import { useState } from 'react'
import './App.css'

function App() {
  const [WeaponName, setWeaponName] = useState(0)
  const [weaponType, setWeaponType] = useState(0)
  const [strength, setStrength] = useState(0)
  const [weaponSkill, setWeaponSkill] = useState(0)
  const [attacks, setAttacks] = useState(0)
  const [ap, setAP] = useState(0)
  const [damage, setDamage] = useState(0)
  
  const setAll = () => {
      
    setWeaponName = document.getElementById('weapon_name').value
    console.log(WeaponName)
    
  }
 
  return (
    <>
    <div>
      
        <h1>Warhammer Calculator</h1>
        <div className="container_container">
          <div className='container_one' >
            <label>
              Weapon Name
            </label>
            <input 
            id="weapon_name"
            placeholder='Weapon Name' />
            <label>
              Weapon Type
            </label>
            <input 
            id="weapon type" 
            placeholder='Weapon Type'/>
            <label>
              Strength
            </label>
            <input 
            d="strength" 
            placeholder='Strength'/>
            <label>
              Weapon Skill
            </label>
            <input 
            id="weapon skill"
            placeholder='Weapon Skill'
             />
          </div>
          <div className='container_two'>
            <label>
              Attacks
            </label>
            <input 
            id="attacks"
            placeholder='Attacks' />
            <label>
              AP
            </label>
            <input 
            id="ap"
            placeholder='AP' />
            <label>
              Damage
            </label>
            <input 
            id="damage"
            placeholder='Damage' />
            <label>
              Enemy Model
            </label>
            <input 
            id="enemy type"
            placeholder='Enemy Type' />
          </div>
          <div>
            <button
              onClick={() => setAll()}>
              Run Sim
            </button>
          </div>
        </div>
    </div>
  </>
  )
}

export default App
