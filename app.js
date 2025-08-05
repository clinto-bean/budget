import "dotenv/config"
import express from "express"
import { MiddlewareLogger } from "./middleware.js"
import envelopeRouter from "./routes/envelope.js"
import userRouter from "./routes/user.js"

const port = process.env.PORT || 3000
const DEBUGMODE = parseInt(process.env.DEBUGMODE)

const app = express()
app.use(express.json())

// log routes if debugging
if (DEBUGMODE) app.use(MiddlewareLogger)

// envelope routes
app.use("/envelopes", envelopeRouter)
// user routes
app.use("/users", userRouter)

// 404
app.use((req, res) => {
  console.warn(`Unhandled route: ${req.method} ${req.originalUrl}`)
  res.status(404).json({ error: "Route not found" })
})

app.listen(port, (err) => {
  if (err) console.error(`Error: ${err}`)
  console.log(`Application now running on port ${port}`)
})
