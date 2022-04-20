import express from "express"
import createError from "http-errors"
import UsersModel from "./model.js"
import { generateAccessToken } from "../../auth/tools.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await UsersModel.checkCredentials(email, password)

    if (user) {
      const accessToken = await generateAccessToken({
        _id: user._id,
        role: user.role,
      })
      console.log(accessToken)
      res.send({ accessToken })
    } else {
      next(createError(401, `Credentials are not ok!`))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
