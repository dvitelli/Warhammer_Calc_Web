import { useState, useEffect, useCallback } from 'react'
import './App.css'
import DamageCalc from './DamageCalc'
import { RollDice } from './Utilities/RollDice'

function App() {
  
  const [data, setData] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(0)
  const [selectedTarget, setSelectedTarget] = useState(0)
  const [selectedWeapon, setSelectedWeapon] = useState(0)
  const [selectedWeaponCount, setSelectedWeaponCount] = useState(0)
  const [selectedModelTargeted, setModelTargeted] = useState(0)
  const [randomUnit, setRandomUnit] = useState(0)
  const [calcResults, setCalcResults] = useState(null)  
  
  useEffect(() => {
    //Json from https://github.com/Ektoer/wh40k
    fetch('https://raw.githubusercontent.com/Ektoer/wh40k/main/wh40k_10th_min.json')
      .then(res => res.json())
      .then((out) => {
        console.log('Output: ', out);
        setData(out)
        setRandomUnit(RollDice(out.length) - 1)
      }).catch(err => console.error(err));

  }, [])
  
  const getCalc = useCallback(() => {
    const results = new DamageCalc(data?.[selectedUnit]?.weapons?.[selectedWeapon], selectedWeaponCount,
    data?.[selectedTarget].stats[selectedModelTargeted], data?.[selectedTarget].abilities)
    setCalcResults(results)
  
  }, 
    [data, selectedUnit, selectedWeaponCount, selectedTarget, selectedModelTargeted])
    
  return data ? (
    
    <>   
    <div 
    className="container">
      <div
      className="head">
        <h1>Warhammer 40K Damage Calculator</h1>
        <div
          className="flavorText"> 
          {data[randomUnit]?.unitname + ": " + data[randomUnit]?.flavortext}
        </div>
        <br/>
      </div>
        <div className="selected-unit">
          <div>
              <label>Select your unit: </label>
              <select 
              name="unit-names" 
              id=""
              defaultValue={data?.[0]}
              onChange={(e) => setSelectedUnit(e.target.value)}>
                {data?.map((unit, i) => <option key={i} value={i}>{unit.unitname}</option>)}
              </select>
          </div>
              <div>
                <label>Select your weapon: </label>
                <select onChange={(e) => setSelectedWeapon(e.target.value)}>
                  {data?.[selectedUnit]?.weapons?.map((weapon, i) => <option key={i} value={i}>{weapon.name}</option>)}
                </select>
              </div>
              <div>
                <label>Select number of models with this weapon: </label>
                <input
                value={selectedWeaponCount}
                onChange={(e) => setSelectedWeaponCount(e.target.value)}></input>
              </div>
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
        </div>
      <div>
        <button
            disabled={!selectedWeaponCount && !selectedTarget}
            onClick={getCalc}>
          Run Sim
        </button>
      </div> 
      {!!calcResults &&
      <div>
        <p>{data?.[selectedUnit].unitname + " attacked " + calcResults.attacks + " times and wounded " 
              + data?.[selectedTarget].unitname + " " + (calcResults.wounds - calcResults.attackSaved) + " times. " }</p>
            <p>{"Dealing " + ((calcResults.wounds - calcResults.attackSaved) * (data?.[selectedUnit]?.weapons?.[selectedWeapon].damage)) + " total damage." }</p>
      </div>
      }
    </div>
  </>
  ) : <div>Loading Data</div>
}

export default App
