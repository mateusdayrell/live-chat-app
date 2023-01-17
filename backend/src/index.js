const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
require('dotenv').config();

const app = express()

app.get('/', (req, res) => {
    return res.send('Live-Chat-App')
})

app.use(cors())

const serverHttp =  http.createServer(app)

const io = new Server(serverHttp, {
    cors: {
        origin: process.env.SITE_URL,
    }
})

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
    })
})

const port = process.env.PORT || 3333;

serverHttp.listen(port, () => console.log("Server is runing at: http://localhost:3333"))