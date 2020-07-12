const {Router} = require('express')
const bcrypt = require('bcryptjs')
const router = Router()
const User = require('../models/User')
const {check, validationResult} = require('express-validator')

// у этого роута уже есть префикс /api/auth
router.post(
    '/register', 
    [
        check('email', 'Кривое мыло! ..').isEmail(),
        check('password', 'Долбадятел! ... Минимальная длина пароля 6 символов!...').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Ты ввел херовые данные .... олень!'
            })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: 'Такой мудак уже есть .....'})
        }

        const hashedPAssword = await bcrypt.hash(password, 12)
        const user = new User({
            email,
            password: hashedPAssword
        })

        await user.save()

        res.status(201).json({message: 'Очередной мудак создан! ....'})
    }
    catch(e) {
        res.status(500).json({message: 'Пиздец!... приплыли...'})
    }
})

router.post(
    '/register', 
    [
        check('email', 'Введи нормальное мыло.. лупень!').normalizeEmail().isEmail(),
        check('password', 'Пароль введи!!!').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Ты ввел херовые данные .... олень!'
                })
            }
    
            
        }
        catch(e) {
            res.status(500).json({message: 'Пиздец!... приплыли...'})
        }    
})

module.exports = router