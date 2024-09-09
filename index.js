const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
// Check if the session contains a valid user object
if (req.session && req.session.user) {
    // User is authenticated
    next();
} else {
    // User is not authenticated
    res.status(401).json({ message: "Unauthorized, please log in" });
}
});

// Example login route to set the session
app.post('/customer/login', (req, res) => {
const { username, password } = req.body;

// Dummy authentication check
if (username === "user" && password === "password") {
    // Store user data in the session
    req.session.user = { username: username };
    res.json({ message: "Login successful" });
} else {
    res.status(401).json({ message: "Invalid credentials" });
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
