import "dotenv/config"
import express from "express"
import { MiddlewareLogger } from "./middleware.js"
import envelopeRouter from "./routes/envelopes.js"

// environment variables
const port = process.env.PORT || 3000
const DEBUGMODE = process.env.DEBUGMODE === "TRUE"

const app = express()
// when debugmode is on, log timestamp, method and route
DEBUGMODE && app.use(MiddlewareLogger)

app.use(express.json())
//invalid route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// envelope
app.use("/envelopes", envelopeRouter)
// money handlers
app.post("/envelopes/deposit", handlerAddFunds)
app.post("/envelopes/withdraw", handlerWithdrawFunds)
app.post("/envelopes/transfer", handlerTransferFunds)
app.listen(port, (err) => {
  if (err) console.error(`Error: ${err}`)
  console.log(`Application now running on port ${port}`)
})
