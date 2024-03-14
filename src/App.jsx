import { useState, useEffect } from 'react'
import './App.css'
import DamageCalc from './DamageCalc'

function App() {
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [selectedTarget, setSelectedTarget] = useState(null)
  const [selectedWeapon, setSelectedWeapon] = useState(null)
  const [selectedWeaponCount, setSelectedWeaponCount] = useState(null)
  const [selectedTargetCount, setSelectedTargetCount] = useState(null)
  const [selectedModelTargeted, setModelTargeted] = useState(0)
  const [data, setData] = useState(null)
  
    useEffect(() => {

      fetch('https://raw.githubusercontent.com/Ektoer/wh40k/main/wh40k_10th_min.json')
        .then(res => res.json())
        .then((out) => {
          console.log('Output: ', out);
          setData(out)
        }).catch(err => console.error(err));

    }, [] )
 
  console.log(data?.[selectedUnit]?.weapons?.[selectedWeapon])
  
  return data ? (
    
    <>   
    <div>
      <h1>Warhammer 40K Damage Calculator</h1>
        <div className="selected-unit">
          <div>
              <label>Select your unit: </label>
              <select 
              name="unit-names" 
              id="" 
              onChange={(e) => setSelectedUnit(e.target.value)}>
                {data?.map((unit, i) => <option key={i} value={i}>{unit.unitname}</option>)}
              </select>
          </div>
            {!!selectedUnit && 
              <div>
                <label>Select your weapon: </label>
                <select onChange={(e) => setSelectedWeapon(e.target.value)}>
                  {data?.[selectedUnit]?.weapons?.map((weapon, i) => <option key={i} value={i}>{weapon.name}</option>)}
                </select>
              </div>}
            {!!selectedWeapon &&
              <div>
                <label>Select number of models with this weapon: </label>
                <input
                onChange={(e) => setSelectedWeaponCount(e.target.value)}></input>
              </div>}
        </div>
        <div className="target-unit">
          <div>
            <label>Select your target unit: </label>
            <select
              name="unit-names"
              id=""
              onChange={(e) => setSelectedTarget(e.target.value)}>
              {data?.map((unit, i) => <option key={i} value={i}>{unit.unitname}</option>)}
            </select>
          </div>
          <div>{!!selectedTarget && console.log(data?.[selectedTarget].stats) && console.log("Selected Target: ", data?.[selectedTarget].stats.length)}</div>
          
          {!!selectedTarget && data?.[selectedTarget].stats.length > 1 &&
            <div>
              <label>Select model targeted in unit: </label>
              <select
              name="Models"
              id=""
              onChange={(e) => setModelTargeted(e.target.value)}>
                {data?.[selectedTarget].stats.map((stats, i) => <option key={i} value={i}>{stats.unit}</option>)}
              </select>
            </div>
            } 
            
          {/* {!!selectedTarget &&
          <div>
            <label>Select number of models in target unit: </label>
            <input
              onChange={(e) => setSelectedTargetCount(e.target.value)}></input>
          </div>} */}
          
        </div>
      <button
          onClick={() => new DamageCalc(data?.[selectedUnit]?.weapons?.[selectedWeapon], selectedWeaponCount, 
            data?.[selectedTarget].stats[selectedModelTargeted], data?.[selectedTarget].abilities, selectedTargetCount )}>
        Run Sim
      </button>
      <div>
        {}
        <p>{}</p>
      </div>
    </div>
  </>
  ) : <div>Loading Data</div>
}

export default App
