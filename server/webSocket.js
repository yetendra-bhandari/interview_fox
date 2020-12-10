const Io = require("socket.io")();
const { Db } = require("mongodb");
const { getUserID } = require("./controllers/users");
const { getUserName } = require("./controllers/helper");
const { getChannelID, createChat } = require("./controllers/channels");
const {
  inConversation,
  createConversation,
} = require("./controllers/conversations");

/**
 *
 * @param {Db} db
 * @param {Io} io
 */
function webSocket(db, io) {
  io.use(function (socket, next) {
    const userID = getUserID(socket.handshake.query.token);
    if (userID) {
      getUserName(db, userID).then((name) => {
        socket.data = { senderID: userID, senderName: name };
        return next();
      });
    } else {
      return next(new Error("Unauthorized User"));
    }
  });
  io.on("connection", (socket) => {
    console.log("Connected SocketID: " + socket.id);
    socket.on("changeChannel", (channelName) => {
      socket.leaveAll();
      getChannelID(db, channelName).then((channelID) => {
        if (channelID) {
          socket.data.channelID = channelID;
          socket.join(socket.data.channelID);
        }
      });
    });
    socket.on("changeConversation", (applicationID) => {
      socket.leaveAll();
      inConversation(db, applicationID, socket.data.senderID).then(
        (isInConversation) => {
          if (isInConversation) {
            socket.data.applicationID = applicationID;
            socket.join(socket.data.applicationID);
          }
        }
      );
    });
    socket.on("chat", (chat) => {
      if (socket.data.channelID) {
        createChat(
          db,
          socket.data.channelID,
          socket.data.senderID,
          socket.data.senderName,
          chat
        ).then((chatObject) => {
          io.to(socket.data.channelID).emit("chat", chatObject);
        });
      }
    });
    socket.on("conversation", (conversation) => {
      if (socket.data.applicationID) {
        createConversation(
          db,
          socket.data.applicationID,
          socket.data.senderID,
          conversation
        ).then((conversationObject) => {
          io.to(socket.data.applicationID).emit(
            "conversation",
            conversationObject
          );
        });
      }
    });
    socket.on("disconnect", () => {
      delete socket.data;
      socket.removeAllListeners();
      console.log("Disconnected UserID: " + socket.id);
    });
  });
}

module.exports = webSocket;
