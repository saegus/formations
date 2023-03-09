// Dans le fichier: /routes/user
const dailyRewards = require("./daily_rewards.json");

server.route({
  path: baseUrl + "/current-reward",
  method: "GET",
  handler: async function (request, h) {
    const db = request.getDb("odyssee_teams");
    const User = db.getModel("User");

    // check oid_ad is present in request
    if (!request.state.oid_ad) {
      return false;
    }

    // Look for user and check if he is admin
    const currentUserByAD = await User.findOne({
      where: {
        oid_ad: request.state.oid_ad,
      },
    });

    if (!currentUserByAD) {
      return false;
    }
    // if admin then skip
    if (currentUserByAD.id_role == 2) {
      return true;
    }
    // get le nombre de jours de connexion
    const nbDaysOfConnexion = await db.sequelize.query(`
        select date_trunc('day',horodatage) as dates
        from public.h_user_login
        where id_user = ${currentUserByAD.id_user}
        group by 1
        order by 1`);

    let currentRewards =
      dailyRewards[Number(nbDaysOfConnexion[0].length) - 1];

    let index = Number(nbDaysOfConnexion[0].length - 1);

    let before = [],
      after = [];

    if (index === 1) {
      before = dailyRewards.slice(index - 1, index);
    } else if (index === dailyRewards.length - 1) {
      before = dailyRewards.slice(index - 4, index);
    } else if (index > 1) {
      before = dailyRewards.slice(index - 2, index);
    } else {
    }

    if (index == dailyRewards.length - 1) {
      after = dailyRewards.slice(index + 1, index + 2);
    } else if (index === 1) {
      after = dailyRewards.slice(index + 1, index + 4); // 3 elements after
    } else if (index === 0) {
      after = dailyRewards.slice(index + 1, index + 5);
    } else if (index < dailyRewards.length - 1) {
      after = dailyRewards.slice(index + 1, index + 3);
    } else {
    }

    const result = {
      current: currentRewards,
      before: before,
      after: after,
    };

    return result;
  },
});
