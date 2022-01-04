const chatController = require("../controllers/Chats");
const {asyncWrapper} = require("../utils/asyncWrapper");
const express = require("express");
const chatsRoutes = express.Router();
const auth = require("../middlewares/auth");

chatsRoutes.post(
    "/send",
    auth,
    asyncWrapper(chatController.send),
);

chatsRoutes.get(
    "/getMessages/:chatId",
    auth,
    asyncWrapper(chatController.getMessages),
);

// api lay danh sach chat
chatsRoutes.get(
    "/getListChats",
    auth,
    asyncWrapper(chatController.getListChats),
);

chatsRoutes.get(
    "/deleteMessage/:messageId",
    auth,
    asyncWrapper(chatController.deleteMessage),
);

chatsRoutes.get(
    "/deleteChat/:chatId",
    auth,
    asyncWrapper(chatController.deleteChat),
);

chatsRoutes.get(
    "/checkChat/:userId",
    auth,
    asyncWrapper(chatController.checkChat),
);



module.exports = chatsRoutes;