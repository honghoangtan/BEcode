import db from '../models/index'

const createNewRoles = async (roles) => {
    try {
        
        let currentRolse = await db.Role.findAll({
            attributes: ['url', 'description'],
            raw: true
        })

        //  no se lay ra thang khong bi trung trong db
        const persists = roles.filter(({ url1: url1 }) => !currentRolse.some(({ url2: url2 }) => url1 === url2))

        if (persists.length === 0) {
            return {
                EM: 'Nothing to create....',
                EC: 1,
                DT: []
            }

        } 
        
        await db.Role.bulkCreate(persists)
        return {
            EM: `Create roles success ${persists.length}`,
            EC: 0,
            DT: []
        }


    } catch (e) {
        console.log(e)
        return {
            EM: 'some thing wrong with service',
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    createNewRoles
}