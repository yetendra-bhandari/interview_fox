const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getUserID,
  getUser,
  getUserType,
  getUserSkills,
  patchUser,
  getRecommendedCompanies,
  searchCompany,
} = require("../controllers/users");
const {
  createChannel,
  getChannel,
  getRecentChannels,
  getTrendingChannels,
  searchChannel,
} = require("../controllers/channels");
const {
  getRecentConversations,
  getConversations,
} = require("../controllers/conversations");
const {
  addApplication,
  getUserApplications,
  getCompanyApplications,
  deleteCompanyApplication,
  applicationInTouch,
} = require("../controllers/applications");

function authorization(req, res, next) {
  try {
    const userID = getUserID(req.header("Authorization").split(" ")[1]);
    if (userID) {
      getUserType(req.app.locals.db, userID).then((userType) => {
        req.app.locals.userID = userID;
        req.app.locals.userType = userType;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
}

router.use(
  ["/user", "/channel", "/conversation", "/application"],
  authorization
);

router.post("/register", (req, res) => {
  registerUser(req.app.locals.db, req.body.user, req.body.remember).then(
    (result) => {
      res.send(result);
    }
  );
});

router.post("/login", (req, res) => {
  loginUser(req.app.locals.db, req.body.user, req.body.remember).then(
    (result) => {
      res.send(result);
    }
  );
});

router.get("/user", (req, res) => {
  getUser(req.app.locals.db, req.app.locals.userID).then((result) => {
    res.send(result);
  });
});

router.get("/user/skills", (req, res) => {
  getUserSkills(req.app.locals.db, req.query.userID).then((result) => {
    res.send(result);
  });
});

router.patch("/user", (req, res) => {
  patchUser(req.app.locals.db, req.app.locals.userID, req.body.skills).then(
    (result) => {
      res.send(result);
    }
  );
});

router.post("/channel", (req, res) => {
  createChannel(
    req.app.locals.db,
    req.app.locals.userID,
    req.body.channelName
  ).then((result) => {
    res.send(result);
  });
});

router.get("/channel", (req, res) => {
  getChannel(req.app.locals.db, req.query.channelName).then((result) => {
    res.send(result);
  });
});

router.get("/channel/recent", (req, res) => {
  getRecentChannels(req.app.locals.db, req.app.locals.userID).then((result) => {
    res.send(result);
  });
});

router.get("/channel/trending", (req, res) => {
  getTrendingChannels(req.app.locals.db).then((result) => {
    res.send(result);
  });
});

router.get("/channel/search", (req, res) => {
  searchChannel(req.app.locals.db, req.query.channelName).then((result) => {
    res.send(result);
  });
});

router.post("/application", (req, res) => {
  if (req.app.locals.userType === "E") {
    addApplication(
      req.app.locals.db,
      req.app.locals.userID,
      req.body.application
    ).then((result) => {
      res.send(result);
    });
  } else {
    return res.sendStatus(403);
  }
});

router.delete("/application", (req, res) => {
  if (req.app.locals.userType === "B") {
    deleteCompanyApplication(
      req.app.locals.db,
      req.app.locals.userID,
      req.body.applicationID
    ).then((result) => {
      res.send(result);
    });
  } else {
    return res.sendStatus(403);
  }
});

router.get("/application/user", (req, res) => {
  if (req.app.locals.userType === "E") {
    getUserApplications(req.app.locals.db, req.app.locals.userID).then(
      (result) => {
        res.send(result);
      }
    );
  } else {
    return res.sendStatus(403);
  }
});

router.get("/application/company", (req, res) => {
  if (req.app.locals.userType === "B") {
    getCompanyApplications(req.app.locals.db, req.app.locals.userID).then(
      (result) => {
        res.send(result);
      }
    );
  } else {
    return res.sendStatus(403);
  }
});

router.get("/application/recommended", (req, res) => {
  if (req.app.locals.userType === "E") {
    getRecommendedCompanies(req.app.locals.db, req.app.locals.userID).then(
      (result) => {
        res.send(result);
      }
    );
  } else {
    return res.sendStatus(403);
  }
});

router.get("/application/search", (req, res) => {
  if (req.app.locals.userType === "E") {
    searchCompany(
      req.app.locals.db,
      req.app.locals.userID,
      req.query.company
    ).then((result) => {
      res.send(result);
    });
  } else {
    return res.sendStatus(403);
  }
});

router.post("/application/inTouch", (req, res) => {
  if (req.app.locals.userType === "B") {
    applicationInTouch(
      req.app.locals.db,
      req.app.locals.userID,
      req.body.applicationID
    ).then((result) => {
      res.send(result);
    });
  } else {
    return res.sendStatus(403);
  }
});

router.get("/conversation/recent", (req, res) => {
  getRecentConversations(
    req.app.locals.db,
    req.app.locals.userID,
    req.app.locals.userType
  ).then((result) => {
    res.send(result);
  });
});

router.get("/conversation", (req, res) => {
  getConversations(
    req.app.locals.db,
    req.query.applicationID,
    req.app.locals.userID,
    req.app.locals.userType
  ).then((result) => {
    res.send(result);
  });
});

router.all("/", (req, res) => {
  res.send("Interview_Fox_API");
});

module.exports = router;
