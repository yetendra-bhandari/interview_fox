const { ObjectID } = require("mongodb");
const { getUserCompany, getUserType } = require("./users");
const { getUserName } = require("./helper");

async function inConversation(db, applicationID, userID) {
  try {
    const query = { _id: ObjectID(applicationID), inTouch: true };
    if ((await getUserType(db, userID)) == "E") {
      query.applicant = ObjectID(userID);
    } else {
      query.company = ObjectID(userID);
    }
    return Boolean(
      await db
        .collection("applications")
        .findOne(query, { projection: { conversations: 1 } })
    );
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function getRecentConversations(db, userID, userType) {
  try {
    const query = { inTouch: true };
    const projection = {};
    if (userType == "E") {
      query.applicant = ObjectID(userID);
      projection.company = 1;
    } else {
      query.company = ObjectID(userID);
      projection.applicant = 1;
    }
    const applications = await db
      .collection("applications")
      .find(query, { projection })
      .toArray();
    const recent = [];
    for (const application of applications) {
      recent.push({
        id: application._id,
        name:
          userType == "E"
            ? await getUserCompany(db, application.company)
            : await getUserName(db, application.applicant),
      });
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

async function getConversations(db, applicationID, userID, userType) {
  try {
    const query = { _id: ObjectID(applicationID), inTouch: true };
    if (userType == "E") {
      query.applicant = ObjectID(userID);
    } else {
      query.company = ObjectID(userID);
    }
    return {
      success: true,
      conversations: (
        await db
          .collection("applications")
          .findOne(query, { projection: { _id: 0, conversations: 1 } })
      ).conversations,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function createConversation(db, applicationID, senderID, conversation) {
  try {
    conversationObject = {
      senderID: ObjectID(senderID),
      conversation: conversation,
      date: new Date(),
    };
    await db
      .collection("applications")
      .updateOne(
        { _id: ObjectID(applicationID) },
        { $push: { conversations: conversationObject } }
      );
    return conversationObject;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getRecentConversations,
  getConversations,
  createConversation,
  inConversation,
};
