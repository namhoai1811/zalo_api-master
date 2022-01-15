require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { PORT } = require("./constants/constants");
const { MONGO_URI } = require("./constants/constants");
const bodyParser = require("body-parser");
const io = require("socket.io")(3000);
// const MessageModel = require("../models/Messages");

// connect to mongodb
mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((res) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
// use middleware to parse body req to json
app.use(express.json());

// use middleware to enable cors
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// route middleware
app.use("/", mainRouter);

app.get("/settings", function (req, res) {
  res.send("Settings Page");
});

app.listen(PORT, () => {
  console.log("server start - " + PORT);
});

// Socket.io chat realtime
io.on("connection", (socket) => {

  console.log("a user connected ", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  socket.on("sendMessages", (data) => {
    io.emit("messageBack", data);
  });

  socket.on("deleteMessages", (data) => {
    io.emit("messageBack", data);
  });

  socket.on("block", (data) => {
    io.emit("blockBack", data);
  });
});
