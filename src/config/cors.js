
// Phải có cái này thì cú pháp process.env mới hợp lệ
require("dotenv").config()



function configCors(app) {
    // Share API toi link minh muon (CORS bảo mật thông tin)
    // Add headers before the routes are defined
    app.use(function (req, res, next) {
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin',  process.env.REACT_URL)

    // Request methods you wish to allow
    // Cai thu 2 la de phan quyen
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-requested-With,content-type,Accept')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next()

})
}

export default configCors;