const { ObjectID } = require("mongodb");
const { getUserName } = require("./helper");

async function getChannelID(db, channelName) {
  try {
    const result = await db
      .collection("channels")
      .findOne({ name: channelName.trim() }, { projection: { _id: 1 } });
    if (result) {
      return result._id;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getChannelDetails(db, channelID) {
  try {
    const result = await db
      .collection("channels")
      .findOne({ _id: ObjectID(channelID) });
    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function createChannel(db, userID, channelName) {
  try {
    if (channelName.length <= 32 && /^[A-Za-z0-9]+$/.test(channelName)) {
      if (!(await getChannelID(db, channelName))) {
        await db.collection("channels").insertOne({
          name: channelName,
          createdBy: ObjectID(userID),
          createdByName: await getUserName(db, userID),
          totalChats: 0,
          createdOn: new Date(),
        });
        return {
          success: true,
          message: "New Channel Created",
        };
      } else {
        return {
          success: false,
          message: "Channel Already Exists",
        };
      }
    } else {
      return {
        success: false,
        message: "Invalid Channel Name",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function getChannel(db, channelName) {
  try {
    const channel = await db
      .collection("channels")
      .findOne({ name: channelName.trim() });
    if (channel) {
      const discussion = await db
        .collection("discussions")
        .find({ channelID: ObjectID(channel._id) })
        .toArray();
      return {
        success: true,
        channel: channel,
        discussion: discussion,
      };
    } else {
      return {
        success: false,
        message: "Requested Channel Does Not Exist",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function getTrendingChannels(db) {
  try {
    return {
      success: true,
      trending: await db
        .collection("channels")
        .aggregate([{ $sort: { totalChats: -1 } }, { $limit: 5 }])
        .toArray(),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function getRecentChannels(db, userID) {
  try {
    const recentIDs = await db
      .collection("discussions")
      .aggregate([
        { $match: { senderID: ObjectID(userID) } },
        {
          $group: {
            _id: "$channelID",
            lastDate: { $last: "$date" },
          },
        },
        { $sort: { lastDate: -1 } },
      ])
      .toArray();
    const recent = [];
    for (const recentID of recentIDs) {
      recent.push(await getChannelDetails(db, recentID._id));
    }
    return {
      success: true,
      recent: recent,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function searchChannel(db, channelName) {
  try {
    return {
      success: true,
      channels: await db
        .collection("channels")
        .find({ name: new RegExp(channelName, "i") })
        .toArray(),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function createChat(db, channelID, senderID, senderName, chat) {
  try {
    chatObject = {
      channelID: ObjectID(channelID),
      senderID: ObjectID(senderID),
      senderName: senderName,
      chat: chat,
      date: new Date(),
    };
    await db.collection("discussions").insertOne(chatObject);
    await db
      .collection("channels")
      .updateOne({ _id: ObjectID(channelID) }, { $inc: { totalChats: 1 } });
    return chatObject;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getChannelID,
  getChannelDetails,
  createChannel,
  getChannel,
  getTrendingChannels,
  getRecentChannels,
  searchChannel,
  createChat,
};
