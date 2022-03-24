const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const conectDB = require("./config/db.js");
const userRoute = require("./routes/userRoute.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const path = require("path");


dotenv.config();
conectDB();




app.use(cors())
app.use(express.json());



const PORT = process.env.PORT ;


// app.get("/", (req, res) => {
//     res.json({
//         message: "Chit-Chat API Running!"
//     })
// })
// Api Endpoints....
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------------------------deployment------------------------------

const server = app.listen(PORT, () => {
    console.log(`Server Listening on PORT ${PORT}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io!");
    socket.on('setup', (user) => {
        // console.log(user);
        socket.join(user._id);
        socket.emit("connected");
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined Room", room);
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log('Chat.user not defined!');


        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})