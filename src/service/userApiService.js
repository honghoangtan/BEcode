import db from "../models";

import bcrypt from 'bcryptjs'

import loginRegisterService from './loginRegisterService'

const salt = bcrypt.genSaltSync(10)



const getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            attributes: ["id", "username", "email", "phone", "sex"],
            include: { model: db.Group, attributes: ["name", "description"] },
            raw: true,
            nest: true  
        }
        )

        if (users) {
            // let data = users.get({ plain: true })
            // findall tu dong convert thanh array khong phai dung cau lenh tren

            return {
                EM: 'get data susccess',
                EC: 0,
                DT: users
            }
        } else {
            return {
                EM: 'get data error',
                EC: 0,
                DT: []
            }
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

const getUserWithPagination = async (page, limit) => {
    try{
        let offset = (page - 1) * limit

        const { count, rows } = await db.User.findAndCountAll({
            attributes: ["id", "username", "email", "phone", "sex", 'address'],
            include: { model: db.Group, attributes: ["name", "description", "id"] },
            order: [
                ['id', 'ASC']
            ],
            raw: true,
            nest: true ,
            offset: offset,
            limit: limit
          });

        console.log("CHECK COUNT USERS: ", count)

        let totalPages = Math.ceil(count/limit)

        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows
        }

        return {
            EM: 'Ok',
            EC: 0,
            DT: data
        }

        console.log('>>> Check data: ', data)

    } catch(e) {
        console.log(e)
        return {
            EM: 'some thing wrong with service',
            EC: 1,
            DT: []
        }
    }
}

const createNewUser = async (data) => {
    try {
        // check email, phone, password

        let isEmailExist = await loginRegisterService.checkEmailExist(data.email)
        if (isEmailExist) {
            return {
                EM: 'The email is already exist',
                EC: 1,
                DT: 'email'
            }
        }

        let isPhoneExist = await loginRegisterService.checkEmailExist(data.phone)
        if (isPhoneExist) {
            return {
                EM: 'The phone is already exist',
                EC: 1,
                DT: 'phone'
            }
        }

        // hash user password
        let hashPassword = loginRegisterService.hashUserPassword(data.password)

        await db.User.create({...data, password: hashPassword})


        return {
            EM: 'something wrongs with service',
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

const updateUser = async (data) => {
    try {

        if (!data.groupId) {
            return {
                EM: 'Error with empty GroupId',
                EC: 1,
                DT: 'group'
            }
        }

        let user = await db.User.findOne({
            where: { id: data.id }
        })

        if (user) {
            // update
            await user.update({
                username: data.username,
                address: data.address,
                sex: data.sex,
                groupId: data.groupId
            })

            return {
                EM: ' Update user success',
                EC: 0,
                DT: ''
            }

        } else {
            // not found
            return {
                EM: 'User not found',
                EC: 2,
                DT: ''
            }
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

const deleteUser = async (id) => {
    try {
        let user = await db.User.findOne({
            where: { id: id}
          });

        if (user) {
            await user.destroy()
            return {
                EM: 'Ok',
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: 'User not exist',
                EC: 2,
                DT: []
            }
        }

    } catch (e) {
        console.log(e)
        return {
            EM: 'Error from service',
            EC: 1,
            DT: []
        }
    }  
}

module.exports = {
    getAllUser, createNewUser, updateUser, deleteUser, getUserWithPagination
}