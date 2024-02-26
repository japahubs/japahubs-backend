import express from 'express'
import { createUserController } from '../../../useCases/createUser'

const userRouter = express.Router()

userRouter.post('/users/new', (req, res) =>
  createUserController.execute(req, res),
)

export { userRouter }
