import express, { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes'

dotenv.config()

const app: Application = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT

app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello world</h1>')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
