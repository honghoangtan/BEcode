import roleApiService from '../service/roleApiService'

const createFunc = async (req, res) => {
    try {
        let data = await roleApiService.createNewRoles(req.body)

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




module.exports = {
    createFunc,
}