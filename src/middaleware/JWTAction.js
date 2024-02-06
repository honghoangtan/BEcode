require('dotenv').config()
// day cai mat khau vao kho luu tru

import jwt from 'jsonwebtoken'
// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');


const nonSecurePaths = ['/', '/login', '/register', '/logout']

const createJWT = (payload) => {
    // đưa giá trị của key vào env để token được bảo mật
    let key = process.env.JWT_SECRET

    let token = null

    try {
        token = jwt.sign(payload, key, {                
            expiresIn: process.env.JWT_EXPIRES_IN
        });
    } catch (e) {
        console.log(e)
    }

    return token

}

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET

    let decoded = null

    try {
        decoded =  jwt.verify(token, key)
    } catch (e) {
        console.log(e)
    }

    return decoded

    // jwt.verify(token, key, function(err, decoded) {
    //     if (err) {

    //         console.log(e)
    //         return data

    //       /*
    //         err = {
    //           name: 'JsonWebTokenError',
    //           message: 'jwt malformed'
    //         }
    //       */
    //     }

    //     console.log('>>> CHECK DECODED: ', decoded)

    //     return decoded
    //   });
}

// check người dùng có đăng nhập hay không 
const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next()


    let cookies = req.cookies

    if (cookies && cookies.jwt) {
        let token = cookies.jwt

        let decoded = verifyToken(token)

        if (decoded) {
            // Nhúng
            req.user = decoded
            req.token = token
            next()
        } else {
            return res.status(401).json({
                EC: -1,
                DT: '',
                EM: 'Not authenticated the user'
            })
        }
    } else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'Not authenticated the user'
        })
    }
}

const checkUserPermission = (req, res, next) => {
    // bản chất api account không có quyền hạn về roles nên mới bỏ qua
    if (nonSecurePaths.includes(req.path) || req.path === '/account') return next()

    // ở method kiểm tra đăng nhập trên
    // chúng ta đã nhúng req.user = token đã được giải hóa 
    if (req.user) {
        let email = req.user.email
        let roles = req.user.groupWithRoles.Roles
        let currentURL = req.path

        if (!roles || roles.length === 0) {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: `You don't permission to access this resource....`
            })
        }

        let canAccess = roles.some(item => item.url === currentURL)

        if (canAccess) {
            return next()
        } else {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: `You don't permission to access this resource....`
            })
        }

    } else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'Not authenticated the user'
        })
    }
}

module.exports = {
    createJWT, verifyToken, checkUserJWT, checkUserPermission
}