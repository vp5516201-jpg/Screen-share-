const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

// Jab koi site khole, index.html dikhao
app.get("/", (req, res) => {
    res.sendFile(__path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
    
    // Room join karna
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);

        // Disconnect hone par
        socket.on("disconnect", () => {
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });

    // Signaling data (Offer, Answer, ICE Candidates) relay karna
    socket.on("signal", (data) => {
        io.to(data.room).emit("signal", {
            type: data.type,
            data: data.data,
            sender: socket.id
        });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
