import "dotenv/config"
import express from "express"
const port = process.env.PORT || 3000

const app = express()
app.get("/", (req, res) => {
  res.send("hello")
})

app.listen(port, () => {
  console.log(`Application now running on port ${port}`)
})
