require('dotenv').config()
const express = require('express')
const app = express()
const Value = require('./models/value')


//const url =
//`mongodb+srv://inkaviita:${password}@cluster1.u078ugj.mongodb.net/?retryWrites=true&w=majority`



const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)
app.use(express.static('dist'))
app.use(express.json())



let persons = [
    {
        'id': 1,
        'name': 'Arto Hellas',
        'number': '040-123456'
    },
    {
        'id': 2,
        'name': 'Ada Lovelace',
        'number': '39-44-5323523'
    },
    {
        'id': 3,
        'name': 'Dan Abramov',
        'number': '12-43-234345'
    },
    {
        'id': 4,
        'name': 'Mary Poppendieck',
        'number': '39-23-6423122'
    }
]

/*app.get('/info', (req, res) => {
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
  });*/

app.get('/info', async (request, response) => {
    try {
        const count = await Value.countDocuments({})
        const time = new Date()
        response.send(`
          <html>
            <body>
              <p>Phonebook has info for ${count} people</p>
              <p>${time}</p>
            </body>
          </html>
        `)
    } catch (error) {
        response.status(500).send('Error retrieving data')
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
    Value.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newId = Math.floor(Math.random()*10000)
    const p = request.body
    p.id = newId
    if (p.number === undefined) {
        return response.status(404).json({ error: 'Number is missing' })
    }
    else if (p.name === undefined){
        return response.status(404).json({ error: 'Name is missing' })
    }
    else if (persons.filter(x => x.name === p.name).length > 0) {
        return response.status(404).json({ error: 'Name already exists' })
    }

    const newVal = new Value({
        name: p.name,
        number: p.number
    })

    newVal.save().then(savedValue => {
        response.json(savedValue)
    }).catch(error => next(error))


    //persons = persons.concat(p)
    //response.json(p)
})

app.get('/api/persons/:id', (request, response, next) => {
    Value.findById(request.params.id)
        .then(v => {
            if (v) {
                response.json(v)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Value.find({}).then(persons => {
        response.json(persons)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Value.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedValue => {
            response.json(updatedValue)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
