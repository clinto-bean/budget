import {
  handlerRegisterUser,
  handlerGetUser,
  handlerModifyUser,
  handlerDeleteUser,
} from "../user.js"

import express from "express"

const router = express.Router()

//
router.post("/", handlerRegisterUser)
router.get("/:id", handlerGetUser)
router.patch("/:id", handlerModifyUser)
router.delete("/:id", handlerDeleteUser)

export default router
