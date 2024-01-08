

const mongoose = require('mongoose')



if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url =
`mongodb+srv://inkaviita:${password}@cluster1.u078ugj.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const valueSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
const Value = mongoose.model('Value', valueSchema)

const value = new Value({
    name: process.argv[3],
    number: process.argv[4],
})

if (process.argv.length > 3) {
value.save().then(result => {
    console.log("Added "+ value.name + " number "+ value.number + " to phonebook" );
    mongoose.connection.close()
})
}

if (process.argv.length == 3) {
Value.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}

  
