const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())

app.use(morgan('tiny'));


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const entries = persons.length;
    const requestTime = new Date();
    const formatted = requestTime.toDateString() + " " + requestTime.toTimeString();
    // Render a simple HTML page
    res.send(`
      <html>
        <body>
          <p>Phonebook has info for ${entries} people</p>
          <p>${requestTime}</p>
        </body>
      </html>
    `);
  });

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const newId = Math.floor(Math.random()*10000)
    const p = request.body
    p.id = newId
    if (!p.number) {
        return response.status(404).json({ error: 'Number is missing' });
    } 
    else if (!p.name){
        return response.status(404).json({ error: 'Name is missing' });
    }
    else if (persons.filter(x => x.name === p.name).length > 0) {
        return response.status(404).json({ error: 'Name already exists' });
    }
    persons = persons.concat(p)
    response.json(p)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(note => note.id === id)
    if (!note) {
        return response.status(404).json({ error: 'Person not found' });
      }
    response.json(note)
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})



const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
