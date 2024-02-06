import db from "../models"

const getGroupWithRoles = async (user) => {
    // scope

    let roles = await db.Group.findOne({
        where: { id: user.groupId },
        include: [{ 
            model: db.Role, 
            attributes: ['id', 'url', 'description'],
            through: { attributes: [] } 
        }]
    })

    console.log('CHECK ROLES: ', roles)

    return roles ? roles : {}
}

module.exports = {
    getGroupWithRoles
}