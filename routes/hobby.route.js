const { Router } = require('express')
const Hobby = require('../entities/Hobby')
const {check, validationResult} = require('express-validator')
const router = Router()

// endpoint создания хобби
router.post('/create',
    //массив middleware
    [
        check('name', 'Минимальная длина названия 5 символов').isLength( {min: 5} )
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            //проверка на наличие ошибок валидации
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при создании хобби'
                })
            }
            
            const {name, description} = req.body
            
            //ищем пользователя с таким email
            const newHobby = await Hobby.findOne( {name} ).exec()
            if (newHobby) {
                return res.status(400).json( {message: 'Такое хобби уже существует'} )
            }
            const hobby = new Hobby( {name, description} )
            await hobby.save()
            res.status(201).json( {message: 'Хобби успешно создано'} )
        } catch (error) {
            res.status(500).json( {message: 'Произошла ошибка создания'} )
    }
})

// endpoint поиска хобби по имени
// можно также реализовать через get и передовать параметры в адресной строке
router.post('/read_by_name',
    //массив middleware
    [
        check('name', 'Минимальная длина названия 5 символов').isLength( {min: 5} )
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            //проверка на наличие ошибок валидации
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при поиске хобби'
                })
            }
            
            const {name} = req.body
            
            //ищем пользователя с таким email
            const findHobby = await Hobby.findOne( {name} ).exec()
            findHobby ? res.json( {message: 'Хобби найдено'} ) : res.status(404).json( {message: 'Хобби не найдено'} )
        } catch (error) {
            res.status(500).json( {message: 'Произошла ошибка поиска хобби'} )
    }
})

//endpoint поиска всех хобби
router.get('/read',
    async (req, res) => {
        try {
            //ищем пользователя с таким email
            const findHobbies = await Hobby.find().exec()
            findHobbies ? res.json( {data: findHobbies} ) : res.status(404).json( {message: 'Хобби не найдены'} )
        } catch (error) {
            res.status(500).json( {message: 'Произошла ошибка поиска хобби'} )
    }
})

//endpoint обновления по имени
router.patch('/update_by_name',
    //массив middleware
    [
        check('name', 'Минимальная длина названия 5 символов').isLength( {min: 5} )
    ],  
    async (req, res) => {
        try {
            const errors = validationResult(req)
            //проверка на наличие ошибок валидации
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при обновлении хобби'
                })
            }
            
            const {name, description} = req.body
            
            //ищем пользователя с таким email
            const updateHobby = await Hobby.findOneAndUpdate( {name}, {description} ).exec()
            updateHobby ? res.json( {message: 'Хобби обновлено'} ) : res.status(404).json( {message: 'Хобби не обновлено'} )
        } catch (error) {
            res.status(500).json( {message: 'Произошла ошибка обновления хобби'} )
    }
})

//endpoint удаления по имени
router.delete('/delete_by_name',
    async (req, res) => {
        try {
            const errors = validationResult(req)
            //проверка на наличие ошибок валидации
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при поиске хобби'
                })
            }
            
            const {name} = req.body
            
            //ищем пользователя с таким email
            const findHobby = await Hobby.deleteOne( {name} ).exec()
            findHobby ? res.json( {message: 'Хобби удалено'} ) : res.status(404).json( {message: 'Хобби не удалено'} )
        } catch (error) {
            res.status(500).json( {message: 'Произошла ошибка поиска хобби'} )
    }
})

module.exports = router