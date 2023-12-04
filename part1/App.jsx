import { useState } from 'react'

const Header = (props) => {
  
  return <h1>{props.name}</h1>
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = (props) => {
  return(
    <p>{props.text} {props.value} {props.percentage}</p>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const sum = good - bad
  const percentage = all === 0 ? 0 : sum/all *100 
  return(all === 0 ? ("No feedback given") : (
    <table>
      <tr>
        <td><StatisticLine text = "good"/></td>
        <td><StatisticLine value = {good}/></td>
      </tr>
      <tr>
        <td><StatisticLine text = "neutral"/></td>
        <td><StatisticLine value = {neutral}/></td>
      </tr>
      <tr>
        <td><StatisticLine text = "bad"/></td>
        <td><StatisticLine value = {bad}/></td>
      </tr>
      <tr>
        <td><StatisticLine text = "all"/></td>
        <td><StatisticLine value = {all}/></td>
      </tr>
      <tr>
        <td><StatisticLine text = "positive"/></td>
        <td><StatisticLine value = {percentage} percentage = "%"/></td>
      </tr>
    </table>
  )
  )
}


const App = () => {
  const title = "give feedback"
  const stats = "statistics"
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <Header name = {title}/>
      <Button onClick={increaseGood} text = "good"/><Button onClick={increaseNeutral} text = "neutral"/><Button onClick={increaseBad} text = "bad"/>
      <Header name = {stats}/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App