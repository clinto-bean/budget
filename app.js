import "dotenv/config"
import express from "express"
import { MiddlewareLogger } from "./middleware.js"
import {
  handlerDeleteEnvelope,
  handlerGetEnvelopes,
  handlerCreateEnvelope,
  handlerGetEnvelopeByID,
  handlerModifyEnvelope,
} from "./envelope.js"
const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(MiddlewareLogger)
app.post("/envelopes", handlerCreateEnvelope)
app.get("/envelopes", handlerGetEnvelopes)
app.get("/envelopes/:id", handlerGetEnvelopeByID)
app.patch("/envelopes/:id", handlerModifyEnvelope)
app.delete("/envelopes/:id", handlerDeleteEnvelope)
app.listen(port, (err) => {
  if (err) console.log(`Error: ${err}`)
  console.log(`Application now running on port ${port}`)
})
