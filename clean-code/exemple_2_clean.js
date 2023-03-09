// Dans le fichier: /routes/user
const {hapiHandler, HTTPResponse} = require("./handler-to-controller");
const dailyRewards = require("./daily_rewards.json");

server.route({
  path: baseUrl + "/current-reward",
  method: "GET",
  handler: hapiHandler(getCurrentRewardController),
});

const getCurrentRewardController = async (request, model) => {
  const {user} = request;
  const {UserLogins} = model;

  if (user.isAdmin()) return HTTPResponse({
    payload: true,
  });

  const payload = await rewardsDetails(UserLogins, user);
  return HTTPResponse({payload});
}

const rewardsDetails = async (UserLogins, user) => {
  const nbDaysOfConnexionRaw = await UserLogins.nbDaysOfConnexion(user.id_user);
  const nbDaysOfConnexion = parseInt(nbDaysOfConnexionRaw[0].length) - 1;

  const result = {
    current: currentRewards(nbDaysOfConnexion),
    before: previousRewards(nbDaysOfConnexion),
    after: nextRewards(nbDaysOfConnexion),
  };

  return result;
}

const currentRewards = (dailyRewards, nbDaysOfConnexion) => {
  return dailyRewards[nbDaysOfConnexion];
}

const previousRewards = (dailyRewards, nbDaysOfConnexion) => {
  const lastDayCampaignIndex = dailyRewards.length - 1;
  if (nbDaysOfConnexion === lastDayCampaignIndex) {
    return dailyRewards.slice(lastDayCampaignIndex - 4, lastDayCampaignIndex);
  }

  let rewardStartIndex = nbDaysOfConnexion - 2;
  if (rewardStartIndex < 0) rewardStartIndex = 0;
  return dailyRewards.slice(rewardStartIndex, nbDaysOfConnexion);
}

const nextRewards = (dailyRewards, nbDaysOfConnexion) => {
  const lastDayCampaignIndex = dailyRewards.length - 1;
  const nextConnectionRewardIndex = nbDaysOfConnexion + 1;
  const nbDaysFirstWeek = 5;

  if (nbDaysOfConnexion <= 1) {
    return dailyRewards.slice(nextConnectionRewardIndex, nbDaysFirstWeek);
  } else if (nbDaysOfConnexion == lastDayCampaignIndex) {
    return dailyRewards.slice(lastDayCampaignIndex, lastDayCampaignIndex + 1);
  } else {
    return dailyRewards.slice(nextConnectionRewardIndex, nextConnectionRewardIndex + 2);
  }
}

// Dans le fichier: /routes/handler-to-controller
const HTTPResponse = ({httpStatusCode, payload}) => {
  // Note: si vous trouvez ce code bizarre, je ne l'ai écrit que pour correspondre au comportement original de la fonction.
  return httpStatusCode ? false : payload;
}

const hapiHandler = (controller) => {
  return async function (request, h) {
    const {oid_ad} = request.state || {};
    if (!oid_ad) return HTTPResponse({
      httpStatusCode: 400,
      payload: "Request format is invalid: no oid",
    });
  
    const model = getHapiModel(request);

    request.user = await authenticateUser(request, model);
    if (!request.user) return HTTPResponse({
      httpStatusCode: 401,
      payload: "User not authenticated",
    });

    const result = await controller(request, model);
    
    return result;
  }
}

const getHapiModel = (request) => {
  const model = {};
  const db = request.getDb("odyssee_teams");
  model.User = db.getModel("User");
  model.UserLogins = db.getModel("UserLogins");

  return model;
}

const authenticateUser = async (request, model) => {
  const {User} = model;
  const {oid_ad} = request.state;

  const user = await User.byAD(oid_ad);
  return user;
}

module.exports = {
  HTTPResponse,
  hapiHandler,
}

// Dans le fichier: /model/User
const ADMIN_ROLE = 2;
// ...
const instanceMethods = {
  isAdmin: function() {
    return this.id_role == this.ADMIN_ROLE;
  }
};

const staticMethods = {
  byAD: (oid_ad) => {
    return User.findOne({
      where: {oid_ad},
    });
  }
};
// ...

// Dans le fichier: /model/UserLogins
// ...
const staticMethods = {
  nbDaysOfConnexion: async (id_user) => {
    const result = await this.sequelize.query(`
      select date_trunc('day',horodatage) as dates
      from public.h_user_login
      where id_user = ${id_user}
      group by 1
      order by 1`
    );

    return result;
  }
};
// ...
