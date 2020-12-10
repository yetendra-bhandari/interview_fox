const { ObjectID } = require("mongodb");

async function getUserName(db, userID) {
  try {
    return (
      await db
        .collection("users")
        .findOne({ _id: ObjectID(userID) }, { projection: { _id: 0, name: 1 } })
    ).name;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getUserChannels(db, userID) {
  try {
    return await db
      .collection("channels")
      .find({ createdBy: ObjectID(userID) })
      .toArray();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function userHasApplied(db, applicant, company) {
  try {
    return Boolean(
      await db
        .collection("applications")
        .findOne({ applicant: ObjectID(applicant), company: ObjectID(company) })
    );
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = { getUserName, getUserChannels, userHasApplied };
