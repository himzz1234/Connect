const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')
const convRoutes = require('./routes/conversations')
const multer = require('multer')

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})

// middleware
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const upload = multer()
app.post("api/upload", upload.single('file'), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully")
  } catch(err) {
    console.log(err)
  }
})

app.get('/', (req, res) => {
  res.json("kokofekfe")
})

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/conversation', convRoutes)

app.listen(8800, () => console.log('Server up and running⚡'))