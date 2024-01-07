import { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import Form from './components/Form'
import dataService from "./services/data"
import Notification from './components/Notification'

const App = () => {

  const [newName, setNewName] = useState('')
  const [values, setValues] = useState([])
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)

  /*const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3002/persons')
      .then(response => {
        console.log('promise fulfilled')
        setValues(response.data)
      })
  }*/
  
  //useEffect(hook, [])

  useEffect(() => {
    dataService
      .getAll()
      .then(initialValues => {
        setValues(initialValues)
      })
  }, [])

  console.log('render', values.length, 'persons')

  const Click = (event) => {
    event.preventDefault()

    const newVal = {
      name: newName,
      number: newNumber
    }

    const exists = values.some(person => person.name === newName)
    const f = values.find(person => person.name === newName)
    
    if (exists) {
      const confirmed = window.confirm(newName + " is already added to phonebook, replace the old number with a new one?" )
      if (confirmed) {
      const updatedValues = values.map(person => {
        if (person.id === f.id) {
          // Update the existing person's number
          return { ...person, number: newNumber }
        }
        return person
      })
    
    
      dataService.update(f.id, { name: newName, number: newNumber })
        .then(returnedValue => {
          setValues(updatedValues)
          setNewName("")
          setNewNumber("")
        })
        setErrorMessage("Changed the number of " + newName)

      }

    } else {
      //const newList = values.concat([{name: newName, number: newNumber}])
      //setValues(newList)
      dataService
      .create(newVal)
      .then(returnedValue => {
        setValues(values.concat(returnedValue))
        setNewName("")
        setNewNumber("")
      })
      setErrorMessage("Added " + newName)
      

     /* axios.post("http://localhost:3002/persons", newVal)
    .then(response => {
      setValues(values.concat(response.data))
      console.log(response)
      setNewName("")
      setNewNumber("")
    })*/

      
    }
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <form>
        <div>
          <input value = {search} onChange = {e => setSearch(e.target.value)}></input>
        </div>
      </form>
      <Form 
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        Click={Click}/>
      <h2>Numbers</h2>
      <Filter list = {values} search = {search} setValues={setValues}/>
    </div>
  )
}

export default App
