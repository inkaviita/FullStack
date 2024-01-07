import Button from "./Button"
import dataService from "../services/data"
import App from "../App"

const Filter = ({list, search, setValues}) => {

    const handleDelete = (id, name) => {
        const confirmed = window.confirm("Delete " + name + "?" )
        if (confirmed) {
        dataService.del(id).then(() => {
            // Update the list after successful deletion
            const updatedList = list.filter(person => person.id !== id)
            setValues(updatedList)
          }).catch(error => {
            console.error('Delete request failed:', error)
          })
        }
    }
      

    if (search === "") {
        return <div>{list.map((person, index) => <ul key = {index}> {person.name} {person.number} <Button text = "delete" onClick = {() => handleDelete(person.id, person.name)}></Button></ul>)}</div>
    }
    else if (list.length > 0){
      const searchInLower = search.toLowerCase()
      const filtered = list.filter((x)=> x.name.toLowerCase().includes(searchInLower))
      return(
      <div>
        {filtered.map((person, index) => (
        <ul key={index}>
          {person.name} {person.number} <Button text = "delete" onClick = {() => handleDelete(person.id, person.name)}></Button>
        </ul>))}
      </div>)
      
    }
  }

export default Filter
