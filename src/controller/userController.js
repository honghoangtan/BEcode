import userApiService from '../service/userApiService'


const readFunc = async (req, res) => {
    try {
        // req.user được lấy bên middleware checkUserJWT bài 11.6
        console.log("CHECK REQUEST USER",req.user)
        // req.query là lấy yêu cầu từ đường dẫn
        if (req.query.page && req.query.limit) {

            let page = req.query.page
            let limit = req.query.limit

            let data = await userApiService.getUserWithPagination(+page, +limit)
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // date
            })

            console.log('>> Check data: ', 'page = ', page, 'limit = ', limit)

        } else {
            let data = await userApiService.getAllUser()
            return res.status(200).json({
                EM: data.EM, // error message
                EC: data.EC, // error code
                DT: data.DT // date
            })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    } 
}

const createFunc = async (req, res) => {
    try {
        let data = await userApiService.createNewUser(req.body)

        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // date
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    } 
}

const updateFunc = async (req, res) => {
    try {
        let data = await userApiService.updateUser(req.body)

        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // date
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    } 
}

const deleteFunc = async (req, res) => {
    try {
        let data = await userApiService.deleteUser(req.body.id)

        return res.status(200).json({
            EM: data.EM, // error message
            EC: data.EC, // error code
            DT: data.DT // date
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from server', // error message
            EC: '-1', // error code
            DT: '' // date
        })
    } 
}

const getUserAccount = async (req, res) => {
    console.log(">>> CHECK USER FROM JWT: ", req.user)

    return res.status(200).json({
        EM: 'Ok', 
        EC: 0,
        DT: {
            access_token: req.token,
            groupWithRoles: req.user.groupWithRoles,
            email: req.user.email,
            username: req.user.username 
        }
    })
}

module.exports = {
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc,
    getUserAccount
}