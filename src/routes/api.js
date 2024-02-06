import express from "express"

import apiController from '../controller/apiController'

import userController from '../controller/userController'

import groupController from '../controller/groupController'

import roleController from '../controller/roleController'


import { checkUserJWT, checkUserPermission } from '../middaleware/JWTAction'

const router = express.Router()

/**
 * 
 * @param {*} app : express app
 */


// Những thằng nào dùng riêng cho React thì bê vào đây 

const initApiRoutes = (app) => {
    // path, handler
    //handleHelloWord: Khong (), co nghia la goi den tham chieu
    // rest API

    router.all('*', checkUserJWT, checkUserPermission,)

    router.get('/test-api', apiController.testApi)
    router.post('/register', apiController.handleRegister)
    router.post('/login', apiController.handleLogin)

    router.post('/logout', apiController.handleLogout)


    router.get('/account', userController.getUserAccount)

    // user route
    router.get('/user/read',  userController.readFunc)
    router.post('/user/create', userController.createFunc)
    router.put('/user/update', userController.updateFunc)
    router.delete('/user/delete', userController.deleteFunc)


    // role route
    router.post('/role/create', roleController.createFunc)

    // group route
    router.get('/group/read', groupController.readFunc)



    return app.use("/api/v1/", router)
}

export default initApiRoutes