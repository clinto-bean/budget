import { validateIDs } from "./util.js"

const envelopes = new Map()

export class Envelope {
  constructor(title, description, initialBalance = 0, lineItems = [], id) {
    this.title = title
    this.description = description
    this._balance = initialBalance
    this._lineItems = lineItems
    this.id = id
  }

  get balance() {
    return this._balance
  }

  get items() {
    return this._lineItems
  }

  async addFunds(description = "Funds added", amount) {
    try {
      let desc = `Deposit: ${description}`
      this._lineItems.push({ desc, amount, date: new Date().toISOString() })
      this._balance += amount
    } catch (e) {
      throw new Error(`addFunds failed: ${e.message}`)
    }
  }

  async withdrawFunds(description = "Funds withdrawn", amount) {
    if (amount > this._balance) {
      throw new Error("Insufficient balance")
    }
    try {
      let desc = `Withdraw: ${description}`
      this._lineItems.push({
        desc,
        amount: -amount,
        date: new Date().toISOString(),
      })
      this._balance -= amount
    } catch (e) {
      throw new Error(`withdrawFunds failed: ${e.message}`)
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      balance: this._balance,
      items: this._lineItems,
    }
  }
}

export function handlerCreateEnvelope(req, res) {
  const { title, description = null, balance = 0, lineItems = [] } = req.body

  if (!req.body.title) {
    return res
      .status(400)
      .json({ error: "Must include a title for the envelope" })
  }

  const envelope = new Envelope(
    title,
    description,
    balance,
    lineItems,
    envelopes.size + 1
  )

  envelopes.set(envelope.id, envelope)

  res.status(201).json(envelope.toJSON())
}

export function handlerGetEnvelopes(req, res) {
  try {
    if (envelopes.size === 0) {
      return res.status(404).json({ error: "No envelopes found" })
    }

    const envelopeArray = Array.from(envelopes.values()).map((e) => e.toJSON())
    res.status(200).json(envelopeArray)
  } catch (e) {
    console.error("Failed to retrieve envelopes:", e)
    res.status(500).json({ error: "Internal server error" })
  }
}

export function handlerDeleteEnvelope(req, res) {
  const id = Number(req.params.id)
  if (!validateIDs(id)) {
    return res.status(400).json({ error: "Invalid envelope ID" })
  }

  const envelope = envelopes.get(id)
  if (!envelope) {
    return res.status(404).json({ error: `No envelope found with id ${id}` })
  }

  try {
    envelopes.delete(id)
    res.status(200).json({ deleted: envelope.toJSON() })
  } catch (e) {
    console.error(`Error deleting envelope: ${e}`)
    res.status(500).json({ error: "Internal server error" })
  }
}

export function handlerGetEnvelopeByID(req, res) {
  const id = Number(req.params.id)
  if (!validateIDs(id)) {
    return res.status(400).json({ error: "Invalid envelope ID" })
  }

  const envelope = envelopes.get(id)
  if (!envelope) {
    return res.status(404).json({ error: `No envelope found with id ${id}` })
  }

  res.status(200).json({ envelope: envelope.toJSON() })
}

export function handlerModifyEnvelope(req, res) {
  const id = Number(req.params.id)
  if (!validateIDs(id)) {
    return res.status(400).json({ error: "Invalid envelope ID" })
  }

  const envelope = envelopes.get(id)
  if (!envelope) {
    return res.status(404).json({ error: `No envelope found with id ${id}` })
  }

  if (req.body.title) envelope.title = req.body.title
  if (req.body.description) envelope.description = req.body.description

  res.status(200).json({ envelope: envelope.toJSON() })
}

// money handlers
export async function handlerAddFunds(req, res) {
  let description = req.body.description || ""
  let amount = req.body.amount
  if (amount <= 0) {
    res.status(400).json({ error: "can only add positive amounts" })
    return
  }
  const envelopeID = Number(req.body.envelope)
  if (!validateIDs(envelopeID)) {
    return res.status(400).json({ error: "Invalid envelope ID" })
  }
  const envelope = envelopes.get(envelopeID)
  if (!envelope) {
    return res
      .status(404)
      .json({ error: `Envelope not found with id ${envelopeID}` })
  }

  try {
    await envelope.addFunds(description, req.body.amount)

    res.status(200).json({
      transaction: {
        type: "deposit",
        amount: req.body.amount,
        newBalance: envelope.balance,
      },
    })
  } catch (e) {
    console.error(`Error: ${e}`)
    res.status(500).json({ error: "internal server error" })
    return
  }
}

export async function handlerWithdrawFunds(req, res) {
  let description = req.body.description || ""
  let amount = req.body.amount
  if (amount <= 0) {
    res.status(400).json({ error: "can only add positive amounts" })
    return
  }
  const envelopeID = Number(req.body.envelope)
  if (!validateIDs(envelopeID)) {
    return res.status(400).json({ error: "Invalid envelope ID" })
  }
  const envelope = envelopes.get(envelopeID)
  if (!envelope) {
    return res
      .status(404)
      .json({ error: `Envelope not found with id ${envelopeID}` })
  }

  try {
    await envelope.withdrawFunds(description, amount)

    res.status(200).json({
      transaction: {
        type: "withdraw",
        amount: amount,
        newBalance: envelope.balance,
      },
    })
  } catch (e) {
    console.error(`Error: ${e}`)
    res.status(500).json({ error: "internal server error" })
    return
  }
}

export async function handlerTransferFunds(req, res) {
  const fromID = Number(req.body.from)
  const toID = Number(req.body.to)

  if (!validateIDs(fromID, toID)) {
    return res.status(400).json({ error: "Invalid envelope ID(s)" })
  }

  const fromEnvelope = envelopes.get(fromID)
  const toEnvelope = envelopes.get(toID)
  if (!fromEnvelope) {
    res.status(404).json({ error: `envelope ${fromID} not found` })
    return
  }
  if (!toEnvelope) {
    res.status(404).json({ error: `envelope ${toID} not found` })
    return
  }
  try {
    await fromEnvelope.withdrawFunds(req.body.description, req.body.amount)
    await toEnvelope.addFunds(req.body.description, req.body.amount)
    res.status(200).json({
      message: `Successfully transferred $${req.body.amount} from ${fromID} to ${toID}`,
    })
  } catch (e) {
    console.error(`Error: ${e}`)
    res.status(500).json({ error: "internal server error" })
    return
  }
}
