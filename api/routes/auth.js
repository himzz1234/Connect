const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// GENERATE TOKEN
const generateToken = (id, username) => {
   const payload = {
      id,
      username
   }

   const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
   return token
}

// VERIFY TOKEN
const verifyJWT = (req, res, next) => {
   const token = req.headers["x-access-token"]?.split(" ")[1]

   if(token){
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
         if(err){
            res.status(400).json({ message: err.message })
         }

         req.user = {}
         req.user.id = decoded.id
         req.user.username = decoded.username
         next()
      })
   } else {
      res.status(400).json({ message: 'Incorrect Token Given!' })
   }
}

// REGISTER
router.post('/register', async (req, res) => {
   try{
      const {username, email, password} = req.body

      // generate new password
      const salt = await bcrypt.genSalt(10) // a salt is random data that is used as an additional input to a one-way function that hashes data
      const hashedPassword = await bcrypt.hash(password, salt)

      // create a new user
      const newUser = new User({
         username, email, password: hashedPassword
      })
   
      // save user and send respond
      const user = await newUser.save()
      res.status(200).json({message: 'New User Created!', user: user})
   } catch(err){
      res.status(500).json(err)
   }
})

// LOGIN
router.post('/login', async (req, res) => {
   try{
      const user = await User.findOne({email: req.body.email})
      !user && res.status(400).json({ message: "User not found!" })

      const validPassword = await bcrypt.compare(req.body.password, user.password)
      !validPassword && res.status(400).json({ message: "Wrong Password!" })

      res.status(200).json({ message: 'Login Successfull!', user: user, token: `Bearer ${generateToken(user._id, user.username)}` })
   } catch(err) {
      res.status(500).json(err)
   }
})

// GET USER
router.get('/getauth', verifyJWT, async (req, res) => {
   try{
      const user = await User.findById(req.user.id)
      res.status(200).json({ user: user })
   } catch(err) {
      res.status(500).json(err)
   }
}) 

module.exports = router