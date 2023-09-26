const express  = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
app.use(express.json()) 

app.use('/api', require('./routes/auth.route'))
app.use('/api', require('./routes/hobby.route'))

const PORT = config.get('PORT') || 3001

const start = async () => {
    try {
        await mongoose.connect(config.get('HOST_DB'), {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
            //useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`App run start on port ${PORT}`))
    } catch (error) {
        console.log('Ooops error', error.message)
        process.exit(1)
    }
} 

start()