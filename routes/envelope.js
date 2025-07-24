import {
  handlerDeleteEnvelope,
  handlerGetEnvelopes,
  handlerCreateEnvelope,
  handlerGetEnvelopeByID,
  handlerModifyEnvelope,
  handlerAddFunds,
  handlerWithdrawFunds,
  handlerTransferFunds,
} from "../envelope.js"

import express from "express"

const router = express.Router()

// CRUD
router.post("/", handlerCreateEnvelope)
router.get("/", handlerGetEnvelopes)
router.get("/:id", handlerGetEnvelopeByID)
router.patch("/:id", handlerModifyEnvelope)
router.delete("/:id", handlerDeleteEnvelope)

// Money ops
router.post("/deposit", handlerAddFunds)
router.post("/withdraw", handlerWithdrawFunds)
router.post("/transfer", handlerTransferFunds)

export default router
