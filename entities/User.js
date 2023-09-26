const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    hobbies: [{type: Types.ObjectId, ref: 'hobbies'}]
})

module.exports = model('User', schema)