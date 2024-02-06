import userService from '../service/userService'

const handleHelloWord = (req, res) => {
    return res.render("home.ejs")
}

const handleUserPage = async (req, res) => {
    // Việc gọi dữ liệu bị bất đồng bộ 
    let userList = await userService.getUserList()
    
    return res.render("user.ejs", {userList})
}

const handleCreateNewUser = (req, res) => { 

    // Giá trị lấy được từ body trước khi gửi lên server
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password

    // Liên quan đến nghiệp vụ, liên quan đến database thì đẩy vào service
    userService.createNewUser(email, username, password)


    return res.redirect("/user")
}

const handleDeleteUser = async (req, res) => {

    try {
        
        await userService.deleteUser(req.params.id)
        console.log('>>> Check id: ', req.params.id);
        return res.redirect("/user")
    } catch (e) {
        console.log(e)
    }

}

const getUpdateUserPage = async (req, res) => {

    try {
        let id = req.params.id
        let user = await userService.getUserById(id)
    
        console.log(user)
        let userData = {}
    
        // if (user && user.length > 0) {
        //     userData = user[0]
        // }
        userData = user
        return res.render("user-update.ejs", {userData})
    } catch (e) {
        console.log(e)
    }
    
}

const handleUpdateUser = async (req, res) => {

    try {
        let email = req.body.email
        let username = req.body.username
        let id = req.body.id
    
        console.log('>>> Check body: ', req.body)
    
        await userService.getUpdateUserInfor(email, username, id)
        return res.redirect('/user')
    } catch (e) {
        console.log(e)
    }
    
}

// export ra 1 file, export ra 1 object
module.exports = {
    handleHelloWord,
    handleUserPage,
    handleCreateNewUser,
    handleDeleteUser,
    getUpdateUserPage,
    handleUpdateUser
}