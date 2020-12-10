const { ObjectID } = require("mongodb");
const { getUser, getUserCompany } = require("./users");
const { userHasApplied } = require("./helper");

function validApplication(application) {
  try {
    return (
      typeof application.company === "string" &&
      typeof application.coverLetter === "string" &&
      application.workSamples.every((workSample) => {
        return (
          Object.keys(workSample).length === 2 &&
          typeof workSample.organisation === "string" &&
          typeof workSample.url === "string"
        );
      })
    );
  } catch (error) {
    return false;
  }
}

async function addApplication(db, applicant, application) {
  try {
    if (
      validApplication(application) &&
      !(await userHasApplied(db, applicant, application.company)) &&
      (await getUserCompany(db, application.company))
    ) {
      await db.collection("applications").insertOne({
        applicant: ObjectID(applicant),
        company: ObjectID(application.company),
        coverLetter: application.coverLetter,
        workSamples: application.workSamples,
        date: new Date(),
        inTouch: false,
        conversations: [],
      });
      return { success: true, message: "Application Sent Successfully" };
    } else {
      return { success: false, message: "Invalid Data Provided" };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function getUserApplications(db, applicant) {
  try {
    const applications = await db
      .collection("applications")
      .find(
        {
          applicant: ObjectID(applicant),
        },
        { projection: { conversations: 0 } }
      )
      .sort({ date: -1 })
      .toArray();
    for (const application of applications) {
      application.companyName = await getUserCompany(db, application.company);
    }
    return {
      success: true,
      applications: applications,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function getCompanyApplications(db, company) {
  try {
    const applications = await db
      .collection("applications")
      .find(
        {
          company: ObjectID(company),
        },
        { projection: { conversations: 0 } }
      )
      .sort({ date: -1 })
      .toArray();
    for (const application of applications) {
      application.profile = (await getUser(db, application.applicant)).user;
    }
    return {
      success: true,
      applications: applications,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "An Error Occured. Please Try Again Later",
    };
  }
}

async function deleteCompanyApplication(db, company, applicationID) {
  try {
    const result = await db.collection("applications").deleteOne({
      _id: ObjectID(applicationID),
      company: ObjectID(company),
    });
    if (result.deletedCount === 1) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: "Application For The Given User Does Not Exist",
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

async function applicationInTouch(db, company, applicationID) {
  try {
    const result = await db.collection("applications").updateOne(
      {
        _id: ObjectID(applicationID),
        company: ObjectID(company),
      },
      { $set: { inTouch: true } }
    );
    if (result.matchedCount === 1) {
      if (result.modifiedCount === 1) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          message: "Applicant Already In Touch",
        };
      }
    } else {
      return {
        success: false,
        message: "Application For The Given User Does Not Exist",
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

module.exports = {
  addApplication,
  getUserApplications,
  getCompanyApplications,
  deleteCompanyApplication,
  applicationInTouch,
};
