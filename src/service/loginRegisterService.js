require("dotenv").config()

import bcrypt from 'bcryptjs'

import { Op } from 'sequelize'



import db from '../models/index'

import { getGroupWithRoles } from './JWTService'

import { createJWT } from '../middaleware/JWTAction'


const salt = bcrypt.genSaltSync(10)



const checkEmailExist = async (userEmail) => {
    let user = await db.User.findOne({
        where: { email: userEmail }
    })

    if (user) {
        return true
    }

    return false
}

const checkPhoneExist = async (userPhone) => {
    let user = await db.User.findOne({
        where: { phone: userPhone }
    })

    if (user) {
        return true
    }

    return false
}

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt)
    return hashPassword
}

const registerNewUser = async (rawUserData) => {
    try{
        // check email || phone arre exist
        let isEmailExist = await checkEmailExist(rawUserData.email)
        if (isEmailExist) {
            return {
                EM: 'The email is already exist',
                EC: 1
            }
        }

        let isPhoneExist = await checkEmailExist(rawUserData.phone)
        if (isPhoneExist) {
            return {
                EM: 'The phone is already exist',
                EC: 1
            }
        }
        // hash user password
        let hashPassword = hashUserPassword(rawUserData.password)

        // create new user
        // User o day la cua model va se anh xa toi migration
        await db.User.create({
            email: rawUserData.email,
            username: rawUserData.username,
            password: hashPassword,
            phone: rawUserData.phone,
            GroupId: 4
        })

        // EC: 0 la thanh cong
        return {
            EM: 'A user is created successfully',
            EC: 0
        }

    } catch (error) {
        return {
            EM: 'Something wrongs in service... ',
            EC: -2
        }
    }
}

const checkPassWord = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword)
}

const handleUserLogin = async (rawUserData) => {
    try{

        // Làm việc với cập nhật người dùng, xóa người dùng thì dùng sequelize obj
        // Con khong thi them user.get({ plain: true })

        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: rawUserData.valueLogin},
                    { phone: rawUserData.valueLogin}
                ]
            }
        })
        console.log('CHECK FIND USER: ', user)

        if (user) {

            let isCorrectPassword = checkPassWord(rawUserData.password, user.password)


            // test roles
            let groupWithRoles = await getGroupWithRoles(user)

            console.log('CHECK GROUPWITHROLES: ', groupWithRoles)

            let payload = {
                email: user.email,
                username: user.username,
                groupWithRoles,


                // check sự hết hạn của token

            }

            let token = createJWT(payload)

            if (isCorrectPassword) {

                return {
                    EM: 'ok!',
                    EC: 0,
                    DT: {
                        access_token: token,
                        // Truyền groupWithRoles 1 lần nữa là để cho bên FE sử dụng
                        groupWithRoles,
                        email: user.email,
                        username: user.username 
                    }
                }
            }

        }

        return {
            EM: 'Your email/ phone number or password is incorrect',
            EC: 1,
            DT: ''
        }
    } catch(e) {
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

module.exports = {
    registerNewUser,
    handleUserLogin,
    hashUserPassword,
    checkEmailExist,
    checkPhoneExist
}