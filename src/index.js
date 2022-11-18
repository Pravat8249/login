const express = require('express')
const bodyParser = require('body-Parser')
const route = require('./routes/route.js')
const { default: mongoose } = require('mongoose')
const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



mongoose.connect("mongodb+srv://Pratice:MVLNdVEz62Td6t7j@cluster0.q9vy5.mongodb.net/abhisek", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 3000, function (){
    console.log('Express app running on port: ' + (process.env.PORT || 3000))
}) 