const { PRIVATE_CHAT, GROUP_CHAT } = require("../constants/constants");
const ChatModel = require("../models/Chats");
const MessagesModel = require("../models/Messages");
const httpStatus = require("../utils/httpStatus");
const chatController = {};

chatController.send = async (req, res, next) => {
  try {
    let userId = req.userId;

    const { name, chatId, receivedId, member, type, content } = req.body;

    let chatIdSend = null;
    let chat;
    if (type === PRIVATE_CHAT) {
      if (chatId) {
        chat = await ChatModel.findById(chatId);
        if (chat !== null) {
          chatIdSend = chat._id;
        }
      } else {
        chat = new ChatModel({
          type: PRIVATE_CHAT,
          member: [receivedId, userId],
        });
        await chat.save();
        chatIdSend = chat._id;
      }
    } else if (type === GROUP_CHAT) {
      if (chatId) {
        chat = await ChatModel.findById(chatId);
        if (chat !== null) {
          chatIdSend = chat._id;
        }
      } else {
        chat = new ChatModel({
          type: GROUP_CHAT,
          member: member,
        });
        await chat.save();
        chatIdSend = chat._id;
      }
    }
    if (chatIdSend) {
      if (content) {
        let message = new MessagesModel({
          chat: chatIdSend,
          user: userId,
          content: content,
        });
        await message.save();
        let messageNew = await MessagesModel.findById(message._id)
          .populate("chat")
          .populate("user");
        return res.status(httpStatus.OK).json({
          data: messageNew,
        });
      } else {
        return res.status(httpStatus.OK).json({
          data: chat,
          message: "Create chat success",
          response: "CREATE_CHAT_SUCCESS",
        });
      }
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Not chat",
      });
    }
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

chatController.getMessages = async (req, res, next) => {
  try {
    let messages = await MessagesModel.find({
      chat: req.params.chatId,
    }).populate("user");
    return res.status(httpStatus.OK).json({
      data: messages,
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

// Nam api lay list chat
chatController.getListChats = async (req, res, next) => {
  let userId = req.userId;

  try {
    let allChats = await ChatModel.find({
      member: { $all: `${userId}` },
    });

    return res.status(httpStatus.OK).json({
      data: allChats,
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

chatController.deleteMessage = async (req, res, next) => {
  let userId = req.userId;

  try {
    await MessagesModel.deleteOne({ _id: req.params.messageId });

    return res.status(httpStatus.OK).json({
      message: "Đã xóa thành công",
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};
chatController.deleteChat = async (req, res, next) => {
  let userId = req.userId;
  try {
    await MessagesModel.deleteMany({ chat: req.params.chatId });
    await ChatModel.deleteOne({ _id: req.params.chatId });
    return res.status(httpStatus.OK).json({
      message: "Đã xóa thành công",
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

chatController.checkChat = async (req, res, next) => {
  let userId = req.userId;
  let userFriend = req.params.userId;
//   userFriend = '618e975874550a22a4cb2a90';

  try {
   
    let allChats = await ChatModel.findOne({
      member: { $all: [`${userFriend}`, `${userId}`] },
    });
    console.log('ga',allChats);

    return res.status(httpStatus.OK).json({
      data: allChats,
    });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message,
    });
  }
};

module.exports = chatController;
