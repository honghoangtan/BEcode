// Ma hoa Bcrypt npm
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise';

// get the client in (3) 5.1

// get the promise implementation, we will use bluebird
// 5.1
import bluebird from 'bluebird';

import db from '../models'



const salt = bcrypt.genSaltSync(10)

// create the connection to database 12


const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt)
    return hashPassword
}

const createNewUser = async (email, username, password) => {
    // Tra gia password duoc ma hoa
    let hashPassword = (hashUserPassword(password))

    try{
      // User o day la cua model va se anh xa toi migration
      await db.User.create({
        email: email,
        username: username,
        password: hashPassword
      })

    } catch (error) {
      console.log('>>> CHECK ERROR: ', error)
    }
}

const getUserList = async () => {
  // create the connection, specify bluebird as Promise 5.1
  // const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'jwt', Promise: bluebird});

  
    
  //   try{
  //     const [rows, fields] = await connection.execute('SELECT * FROM users');

  //     return rows
  //   } catch (error) {
  //     console.log(">>> Check error: ", error)
  //   }

  // test realationships
  // raw: true (tra ra object cua js)
  // nest: gom nhom cua include
  let newUser = await db.User.findOne({
    where: { id: 1 },
    attributes: ["id", "username", "email"],
    include: { model: db.Group },
    raw: true,
    nest: true
  })

  console.log(">>> Check new newUser: ", newUser)


  let r = await db.Role.findAll({
    include: { model: db.Group, where: { id: 1 }},
    raw: true
  })

  console.log(">>> Check new r: ", r)

    
  let users = []
  users = await db.User.findAll()
  return users
    
}

const deleteUser = async (userId) => {

  await db.User.destroy({
    where: {
      id: userId
    }
  })

  // const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'jwt', Promise: bluebird});

  // try{
  //   const [rows, fields] = await connection.execute('DELETE FROM users WHERE id =?', [id]);

  //   return rows
  // } catch (error) {
  //   console.log(">>> Check error: ", error)
  // }

}

const getUserById = async (id) => {
  // const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'jwt', Promise: bluebird});

  // try{
  //   const [rows, fields] = await connection.execute('SELECT * FROM users WHERE id =?', [id]);

  //   return rows
  // } catch (error) {
  //   console.log(">>> Check error: ", error)
  // }

  let user = {}
  user = await db.User.findOne({
    where: {
      id: id
    }
  })
  return user.get({ plain: true })
    
}

const getUpdateUserInfor = async (email, username, id) => {
  await db.User.update(
    { email: email,
      username: username
    }, {
    where: {
      id: id
    }
  });

  // const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'jwt', Promise: bluebird});

  // try{
  //   const [rows, fields] = await connection.execute('UPDATE USERS SET email = ?, username = ? WHERE id = ?', [email, username, id]);

  //   return rows
  // } catch (error) {
  //   console.log(">>> Check error: ", error)
  // }
}

module.exports = {
    createNewUser,
    getUserList,
    deleteUser,
    getUserById,
    getUpdateUserInfor
}