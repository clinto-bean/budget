import "dotenv/config"
import express from "express"
import { MiddlewareLogger } from "./middleware.js"
const port = process.env.PORT || 3000

const envelopes = ["personal", "rent"]

const app = express()
app.use(MiddlewareLogger)
app.get("/envelopes", (req, res) => {
  res.send(envelopes)
})

app.listen(port, () => {
  console.log(`Application now running on port ${port}`)
})
