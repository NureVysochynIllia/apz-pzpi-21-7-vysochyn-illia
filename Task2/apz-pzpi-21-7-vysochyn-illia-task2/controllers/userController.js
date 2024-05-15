const bcrypt = require('bcryptjs');
const { generateAccessToken } = require("../services/jwtService");
const Users = require("../models/Users");

class userController {
    async registration(request, response) {
        try {
            const { username, password, email } = request.body;
            if ( !username || !password || !email ){
                return response.status(400).json({ message: "Some fields is empty."})
            }
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return response.status(402).json({ message: 'User already registered.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new Users({
                username,
                password: hashedPassword,
                email,
                role:"user",
                balance:0
            });
            await newUser?.save();
            response.status(201).json({ message: "User created successfully." });
        } catch (error) {
            response.status(500).json({ message: "Registration failed.", error: error.message });
        }
    }

    async login(request, response) {
        try {
            const { username, password } = request.body;
            const user = await Users.findOne({ username });
            if (!user || !await bcrypt.compare(password, user?.password)) {
                return response.status(400).json({ message: "Invalid username or password." });
            }
            const accessToken = generateAccessToken(user?.username, user?.role );
            response.status(200).json({ accessToken });
        } catch (error) {
            response.status(500).json({ message: "Login failed.", error: error.message });
        }
    }
    async replenishBalance(request, response) {
        try {
            const {amount} = request.body;
            if (!amount) {
                return response.status(400).json({message: "Some fields are empty"});
            }
            const username = request.user.username;
            const user = await Users.findOne({ username });
            user.balance = user.balance+Number(amount);
            user.save();
            return response.status(201).json({message: 'Replenishing went successfully.'});
        } catch (error) {
            return response.status(500).json({message: "Failed to replenish", error: error.message});
        }
    }
    async getProfile(request, response) {
        try {
            const username = request.user.username;
            const user = await Users.findOne({ username });
            return response.status(201).json({username:user.username, role:user.role, email:user.email, balance:user.balance});
        } catch (error) {
            return response.status(500).json({message: "Failed to get user profile.", error: error.message});
        }
    }
}

module.exports = new userController();