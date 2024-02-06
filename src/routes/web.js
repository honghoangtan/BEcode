import express from "express"

import homeController from '../controller/homeController'
import apiController from '../controller/apiController'

const router = express.Router()

/**
 * 
 * @param {*} app : express app
 */

const initWebRoutes = (app) => {
    // path, handler
    //handleHelloWord: Khong (), co nghia la goi den tham chieu

    router.get("/", homeController.handleHelloWord)

    router.get("/user", homeController.handleUserPage)

    router.post("/users/create-user", homeController.handleCreateNewUser)

    router.post("/delete-user/:id", homeController.handleDeleteUser)

    router.get("/update-user/:id", homeController.getUpdateUserPage)

    router.post("/users/update-user", homeController.handleUpdateUser)

    // rest API
    router.get('/api/test-api', apiController.testApi)

    return app.use("/", router)
}

export default initWebRoutes