const { Router } = require('express')
const User = require('../entities/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const router = Router()

const JWT_SECRET_KEY = 'JWT_SECRET_KEY'

router.post('/auth',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            //проверка на наличие ошибок валидации
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе'
                })
            }
            
            const {email, password} = req.body
            const user = await User.findOne( {email})
            if (!user) {
                return res.status(400).json( {message: 'Пользователь с таким email не найден'} )
            }

            const checkPassword = await bcrypt.compare(password, user.password)

            if (!checkPassword) {
                return res.status(400).json( {message: 'Неверный пароль'} )
            }

            const token = jwt.sign(
                { userId: user.id },
                JWT_SECRET_KEY,
                { expiresIn: '1h' }
            )

            res.json( {token, userId: user.id, hobby: user.hobbies} )
        } catch (error) {
            res.status(500).json( {message: 'Произошла ошибка регистрации'} )
    }
})

// endpoint регистрации
router.post('/register',
    //массив middleware
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 7 символов').isLength( {min: 7} )
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            //проверка на наличие ошибок валидации
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }
            
            const {email, password} = req.body
            
            //ищем пользователя с таким email
            const newUser = await User.findOne( {email} ).exec()
            if (newUser) {
                return res.status(400).json( {message: 'Пользователь с таким email уже существует'} )
            }
            //хешируем пароль для надежности
            const hashPassword = await bcrypt.hash(password, 16)
            const user = new User( {email, password: hashPassword} )
            await user.save()
            res.status(201).json( {message: 'Пользователь успешно создан'} )
        } catch (error) {
            res.status(500).json( {message: 'Произошла ошибка регистрации'} )
    }
})

module.exports = router