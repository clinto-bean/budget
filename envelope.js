const envelopes = new Map()

class Envelope {
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

  add(description = "Funds added", amount) {
    const transactionID = this._lineItems.length + 1
    this._lineItems.push({ id: transactionID, description, amount })
    this._balance += amount
    return `${transactionID}: ${description} - ${amount}`
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

function handlerCreateEnvelope(req, res) {
  if (!req.body.title) {
    return res
      .status(400)
      .json({ error: "Must include a title for the envelope" })
  }

  const envelope = new Envelope(
    req.body.title,
    req.body.description ?? null,
    req.body.balance ?? 0,
    req.body.lineItems ?? [],
    envelopes.size + 1
  )

  envelopes.set(envelope.id, envelope)

  res.status(201).json(envelope.toJSON())
}

function handlerGetEnvelopes(req, res) {
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

function handlerDeleteEnvelope(req, res) {
  const id = parseInt(req.params.id, 10)
  if (!id) {
    return res
      .status(400)
      .json({ error: "Invalid search parameter, numbers only" })
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

function handlerGetEnvelopeByID(req, res) {
  const id = parseInt(req.params.id, 10)
  if (!id) {
    return res
      .status(400)
      .json({ error: "Invalid search parameter, numbers only" })
  }

  const envelope = envelopes.get(id)
  if (!envelope) {
    return res.status(404).json({ error: `No envelope found with id ${id}` })
  }

  res.status(200).json({ envelope: envelope.toJSON() })
}

function handlerModifyEnvelope(req, res) {
  const id = parseInt(req.params.id, 10)
  if (!id) {
    return res
      .status(400)
      .json({ error: "Invalid search parameter, numbers only" })
  }

  const envelope = envelopes.get(id)
  if (!envelope) {
    return res.status(404).json({ error: `No envelope found with id ${id}` })
  }

  if (req.body.title) envelope.title = req.body.title
  if (req.body.description) envelope.description = req.body.description

  res.status(200).json({ envelope: envelope.toJSON() })
}

export {
  Envelope,
  handlerModifyEnvelope,
  handlerGetEnvelopes,
  handlerCreateEnvelope,
  handlerDeleteEnvelope,
  handlerGetEnvelopeByID,
}
