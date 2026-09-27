import express from 'express'
import morgan from 'morgan'
import urlRouter from './modules/routes/url.routes.js'

const app = express()

app.use(express.json())
app.use(morgan('combined'))

app.use('/api/url', urlRouter)


export default app