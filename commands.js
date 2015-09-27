
"use strict";
let commands = module.exports = new Map();

let red = new RGB(255, 59, 59);
commands.set("help", (player) => {
  let str = "list of commands:";
  let i = 1;
  commands.forEach((_, key) => {
    str += " /" + key;
    if (i % 3 === 0) {
      str;
    }
    i++;
  });
  str = str.substr(0, str.length - 0);
  player.SendChatMessage(str);
});

commands.set("broadcast", (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  gm.utility.broadcastMessage("[BROADCAST] " + player.name + ": " + args.join(" "));
});

commands.set("cloth", (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length < 4 || isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2]) || isNaN(args[3])) {
    return player.SendChatMessage("Use: /cloth [component id] [draw id] [texture id] [palette id]");
  }

  player.SetComponentVariation(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));
});

commands.set('trafficLightParty', player => {
  if(PlayerInfo[player.name].adminlevel < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  world.trafficLights.interval = 100;
  player.SendChatMessage("you change the interval of the light trafic");
});

commands.set('showLoginCamera', player => {
  const cam = player.graphics.CreateCamera();
  cam.active = true;
  cam.position = new Vector3f(2078.90, 2130.34, 122.79);
  cam.pointAtCoord = new Vector3f(1700.38, 2116.60, 160.29);
  cam.fov = 30.0;
  player.graphics.RenderCameras(true);
});

commands.set('hideLoginCamera', player => {
  player.graphics.RenderCameras(false);
});


const resolveWeapon = weapon => {
  let retn;
  let num = parseInt(weapon);
  if (isNaN(num)) {
    retn = gm.utility.hashes.findByName(gm.utility.hashes.weapons, weapon);
  }
  else {
    if (num < 0 || num >= gm.utility.hashes.weapons.length) {
      num = 0;
    }
    retn = gm.utility.hashes.weapons[num];
  }
  return retn;
};

commands.set('getWeapon', (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length < 1) {
    return player.SendChatMessage("Use: /getWeapon [id or name] ([ammo])");
  }
  let ammo = parseInt(args[1]);
  if (isNaN(ammo)) {
    ammo = 300;
  }

  const weapon = resolveWeapon(args[0]);
  if (typeof weapon === "undefined") {
    return player.SendChatMessage("Use: /getWeapon [id or name] ([ammo])");
  }

  player.AddWeapon(weapon.h, ammo, true);
  player.SendChatMessage("Vous avez reçus un " + weapon.n + ".");
});

commands.set('giveFlashlight', (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length < 1) {
    return player.SendChatMessage("Use: /giveFlashlight [weapon id or name]");
  }
  const weapon = resolveWeapon(args[0]);

  if (typeof weapon === "undefined") {
    return player.SendChatMessage("Use: /giveFlashlight [weapon id or name]");
  }


  const hash1 = new Set(['WEAPON_PISTOL', 'WEAPON_COMBATPISTOL', 'WEAPON_APPISTOL', 'WEAPON_PISTOL50', 'WEAPON_MICROSMG']);
  const hash2 = new Set(['WEAPON_ASSAULTSMG', 'WEAPON_ASSAULTRIFLE', 'WEAPON_CARBINERIFLE', 'WEAPON_ADVANCEDRIFLE', 'WEAPON_PUMPSHOTGUN', 'WEAPON_SAWNOFFSHUTGON', 'WEAPON_ASSAULTSHOTGUN', 'WEAPON_SNIPERRIFLE']);

  if (hash1.has(weapon.n)) {
    player.SetWeaponComponent(weapon.h, 0x359B7AAE);
    player.SendChatMessage('Flashlight added.');
    return;
  }
  else if (hash2.has(weapon.n)) {
    player.SetWeaponComponent(weapon.h, 0x7BC4CDDC);
    player.SendChatMessage('Flashlight added.');
    return;
  }
  player.SendChatMessage("Could not add a flashlight to weapon " + weapon.n + ".");
});

commands.set('tintWeapon', (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length < 2) {
    return player.SendChatMessage("Use: /tintWeapon [id or name] [tint id]");
  }

  const weapon = resolveWeapon(args[0]);
  const tint = parseInt(args[1]);
  if (typeof weapon === "undefined" || isNaN(tint)) {
    return player.SendChatMessage("Use: /tintWeapon [id or name] [tint id]");
  }

  player.SetWeaponTint(weapon.h, tint);
  player.SendChatMessage("Weapon painted.");
});


commands.set('snow', player => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  const snow = !player.world.snow;
  for (const tempPlayer of g_players) {
    tempPlayer.world.snow = snow;
    tempPlayer.world.snowVehicleTacksDeep = snow;
    tempPlayer.world.snowPedTracksDeep = snow;
  }
});


commands.set('setWeaponAmmo', (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length < 2) {
    return player.SendChatMessage("Use: /setWeaponAmmo [id or name] [ammo]");
  }

  const ammo = parseInt(args[1], 10);
  if (isNaN(ammo)) {
    return player.SendChatMessage("Invalid ammo.", red);
  }

  let weapon;
  let num = parseInt(args[0]);
  if (isNaN(num)) {
    weapon = gm.utility.hashes.findByName(gm.utility.hashes.weapons, args[0]);
  }
  else {
    if (num < 0 || num >= gm.utility.hashes.weapons.length) {
      num = 0;
    }
    weapon = gm.utility.hashes.weapons[num];
  }

  if (typeof weapon === "undefined") {
    return player.SendChatMessage("Invalid Weapon.", red);
  }

  player.SetWeaponAmmo(weapon.h, ammo);
  player.SendChatMessage("Set Weapon " + weapon.n + " ammo to " + ammo + ".");
});

commands.set("goto", (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length === 0) {
  	return player.SendChatMessage("Use: /goto [id or name]", red);
  }

  let targets = gm.utility.getPlayer(args[0], true);

  if (targets.length === 0) {
  	return player.SendChatMessage("Unknow target.", red);
  }
  else if (targets.length > 1) {
  	let msg = "many target find: ";
  	for (let p of targets) {
  		msg += p.name + ", ";
  	}
  	msg = msg.slice(0, msg.length - 2);
  	return player.SendChatMessage(msg, red);
  }

  player.position = targets[0].position;
  player.SendChatMessage("teleported to " + targets[0].name, new RGB(255, 255, 0));
  targets[0].SendChatMessage(player.name + " teleported to you.", new RGB(255, 255, 0));
});

commands.set("kick", (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length === 0) {
  	return player.SendChatMessage("Use: /kick [id or name]", red);
  }

  let targets = gm.utility.getPlayer(args[0], true);

  if (targets.length === 0) {
  	return player.SendChatMessage("Unknow target.", red);
  }
  else if (targets.length > 1) {
  	let msg = "many target find: ";
  	for (let p of targets) {
  		msg += p.name + ", ";
  	}
  	msg = msg.slice(0, msg.length - 2);
  	return player.SendChatMessage(msg, red);
  }

  targets[0].Kick("You have been kicked by an admin " + player.name);
});

commands.set("playAnim", (player, args) => {
  if (args.length < 2) {
    return player.SendChatMessage("Use: /playAnim [dict] [anim]");
  }

  player.PlayAnim(args[0], args[1]);
});

commands.set("rain", (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length < 1 || isNaN(args[0])) {
    return player.SendChatMessage("Use: /rain [value]", new RGB(255, 255, 0));
  }
  let v = parseFloat(args[0]);
  if (v < 0.0 || v > 2.5) {
    v = 0.0;
  }
  gm.config.rainLevel = v;
  gm.utility.broadcastMessage(player.name + " changed the rain level to " + v);
  for (let p of g_players) {
    p.world.rainLevel = v;
  }
});

commands.set('setModel', (player, args) => {
  if (args.length < 1) {
    return player.SendChatMessage("Use: /setModel [model id or hash]");
  }

  let model;
  if (isNaN(args[0]) && !(typeof args[0] === "string" && args[0].indexOf('0x') === 0)) {
    model = gm.utility.hashes.findByName(gm.utility.hashes.peds, args[0]);
    if (typeof model === "undefined") {
      return player.SendChatMessage("Use: /setModel [model id or hash]");
    }
    model = model;
  }
  else {
    if ((typeof args[0] === "string" && args[0].indexOf('0x') === 0)) {
      model = parseInt(args[0], 16);
    }
    else {
      model = parseInt(args[0]);
    }

    if (isNaN(model)) {
      return player.SendChatMessage("Use: /setModel [model id or hash]");
    }

    if (model < 0 || model >= gm.utility.hashes.peds.length) {
      model = 0;
    }
    model = gm.utility.hashes.peds[model];
  }

  player.model = model.h;
  player.SendChatMessage("Changed your Model to " + model.n);
});

commands.set("snowLevel", (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length < 1 || isNaN(args[0])) {
    return player.SendChatMessage("Use: /snow [value]", new RGB(255, 255, 0));
  }
  let v = parseFloat(args[0]);
  if (v < 0.0 || v > 2.5) {
    v = 0.0;
  }
  gm.config.snowLevel = v;
  gm.utility.broadcastMessage(player.name + " changed the snow level to " + v);
  for (let p of g_players) {
    p.world.snowLevel = v;
  }
});

commands.set("stopAnim", player => {
  player.StopAnim();
});

commands.set("vehicle", (player, args) => {
  if(pAdmin[player.name] < 1) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
    if (args.length < 1) {
      return player.SendChatMessage("Use: /vehicle [name]");
    }

    const vehicle = new Vehicle(new Vector3f(player.position.x, player.position.y, player.position.z+0.51), GTAHash(args[0]));
});

commands.set("weather", (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  if (args.length < 1 || isNaN(args[0])) {
    return player.SendChatMessage("Use: /weather [id]", new RGB(255, 255, 0));
  }
  let v = parseInt(args[0]);
  if (v < 1 || v > 12) {
    v = 1;
  }
  gm.config.weather = v;
  gm.utility.broadcastMessage(player.name + " changed the weather to " + v);
  for (let p of g_players) {
    p.world.weatherPersistNow = v;
  }
});

commands.set("wind", (player, args) => {
  if(pAdmin[player.name] < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }

  if (args.length < 1 || isNaN(args[0])) {
    return player.SendChatMessage("Use: /wind [value]", new RGB(255, 255, 0));
  }
  let v = parseFloat(args[0]);
  if (v < 0.0 || v > 2.5) {
    v = 0.0;
  }
  gm.config.windLevel = v;
  gm.utility.broadcastMessage(player.name + " changed the wind level to " + v);
  for (let p of g_players) {
    p.world.windLevel = v;
  }
});

 // rajouter
 commands.set("promoteadmin", (player, args) => {

   if(PlayerInfo[player.name].adminlvl < 3) {
     return player.SendChatMessage("You don't have acces to this command.");
   }

   if (args.length === 0) {
     return player.SendChatMessage("Use: /promoteadmin [id or name] [adminlvl]", red);
   }

   let adminlvl = parseInt(args[1]);

   if(isNaN(adminlvl)) {
     player.SendChatMessage("Admin Level must be a number")
   }

   let targets = gm.utility.getPlayer(args[0], false);

   if (targets.length === 0) {
     return player.SendChatMessage("Unknow target.", red);
   }
   else if (targets.length > 1) {
     let msg = "many target find: ";
     for (let p of targets) {
       msg += p.name + ", ";
     }
     msg = msg.slice(0, msg.length - 2);
     return player.SendChatMessage(msg, red);
   }

   if(!pLogged[targets[0].name]) {
     return player.SendChatMessage("This user was not logged");
   }


   PlayerInfo[targets[0].name].adminlvl = adminlvl;

   if(gm.events.onPlayerUpdate(targets[0])) {
     player.SendChatMessage("[ADMIN] you have been promoted " + targets[0].name + " admin: " + adminlvl);
     targets[0].SendChatMessage("[ADMIN] you have been promoted : " + adminlvl + " par " + player.name);
   } else {
     player.SendChatMessage("[ERROR] An error ocurred when trying to upload player info of " + targets[0].name)
   }
 });


commands.set("ban", (player, args) => {

  if (args.length === 0) {
    return player.SendChatMessage("Use: /ban [id or name] [Reason]", red);
  }

  if(pAdmin[player.name] < 1) {
    return player.SendChatMessage("You don't have acces to this command.");
  }

  let targets = gm.utility.getPlayer(args[0], true);

  if (targets.length === 0) {
    return player.SendChatMessage("Unknow target.", red);
  }
  else if (targets.length > 1) {
    let msg = "many target find: ";
    for (let p of targets) {
      msg += p.name + ", ";
    }
    msg = msg.slice(0, msg.length - 2);
    return player.SendChatMessage(msg, red);
  }

  if(!pLogged[targets[0].name]) {
    return player.SendChatMessage("This player doesn't connect");
  }

  let reason = args[1];
  gm.utility.broadcastMessage("[ADMIN] " + targets[0].name + " have been ban by " + player.name + " because: " + reason);
  gm.utility.ban(targets[0]);
  targets[0].Kick("[ADMIN] you have been ban by " + player.name + " Raison: " + reason);

});
commands.set("kick", (player, args) => {


  if(pAdmin[player.name] < 1) {
    return player.SendChatMessage("You don't have acces to this command.");
  }

  if (args.length === 0) {
    return player.SendChatMessage("Use: /kick [id or name] [Reason]", red);
  }

  let targets = gm.utility.getPlayer(args[0], true);

  if (targets.length === 0) {
    return player.SendChatMessage("Unknow target.", red);
  }
  else if (targets.length > 1) {
    let msg = "many target find: ";
    for (let p of targets) {
      msg += p.name + ", ";
    }
    msg = msg.slice(0, msg.length - 2);
    return player.SendChatMessage(msg, red);
  }

  let reason = args[1];
  gm.utility.broadcastMessage("[ADMIN] " + targets[0].name + " you have been kick by " + player.name + " because: " + reason);
  targets[0].Kick("[ADMIN] you have been kick by " + player.name + " because: " + reason);

});

commands.set("stats", (player) => {
  //return player.SendChatMessage("[ID: " + PlayerInfo[player.name].id + "] [AdminLevel: " + PlayerInfo[player.name].adminlvl + "]");
  let parseStats = JSON.stringify(PlayerInfo[player.name]);
  player.SendChatMessage(parseStats);
});

commands.set("register", (player, args) => {
  let password = args.join(" ");
  //gm.utility.broadcastMessage("((BROADCAST)) " + player.name + ": " + args.join(" "));

  if(pLogged[player.name]) {
    return player.SendChatMessage("you are already registered.");
  }

  let connection = gm.utility.dbConnect();

  connection.connect();

  connection.query("SELECT username FROM users WHERE username = '" + player.name + "'", function(err, results) {

    let numRows = results.length;

    if(numRows >= 1) {
      connection.end();
      return player.SendChatMessage("you are already registered, connect with : /login [Motdepasse]");
    }
  });

  //let confirreg; // Variable que se asigna al jugador para que confirme la pwd

  if(ConfirmReg[player.name])
  {
    if(ConfirmPwd[player.name] == password)
    {
      var sha1 = require('sha1');
      password = connection.escape(password);
      let pwdhash = sha1(password);
      console.log("Hash created: " + pwdhash);
      let SQLQuery = "INSERT INTO users (username, password) VALUES ('" + player.name+ "','" + pwdhash + "');";
      connection.query(SQLQuery, function(err) {

        if(!err) {
            console.log("user "+ player.name + " registered sucesfull \n\n");
            player.SendChatMessage("sucesfully registered");
            connection.query("SELECT id FROM users WHERE username = '" + player.name + "'", function(err2, results)
            {
                  PlayerInfo[player.name].id = results[0].id;


                  gm.events.onPlayerUpdate(player);
                  pLogged[player.name]  = true;

                });
              connection.end();
        } else {
            console.log("An error ocurred trying to register the player \n\n");
            console.log("Error: " + err)
            player.SendChatMessage("Une erreur est survenue pendant votre inscription, Essayez a nouveaux" + err);
        }

      });


    } else {
      player.SendChatMessage("Password not good, Try again");
      ConfirmPwd[player.name] = "";
      ConfirmReg[player.name] = false;
    }

  } else {
    ConfirmPwd[player.name] = password;
    ConfirmReg[player.name] = true;
    player.SendChatMessage("To confirm you're inscription write again the command: /register [motdepasse]");
  }

});


commands.set("login", (player, args) => {
  if(!Registered[player.name]) {
    return player.SendChatMessage("You're not registered,to register write : /register [motdepasse]");
  } else {

    let password = args.join(" ");

    let connection = gm.utility.dbConnect();
    connection.connect();
    var sha1 = require('sha1');
    password = connection.escape(password);
    let pwdhash = connection.escape(sha1(password));
    let playername = connection.escape(player.name);
    console.log(playername);
    let SQLQuery = "SELECT * FROM users WHERE username = " + playername + " AND password = " + pwdhash;
    console.log(SQLQuery);

    connection.query(SQLQuery, function(err, results) {
      let num_rows = results.length;

      if(num_rows >= 1) {

        if(results[0].banned) {
          player.Kick("you have been ban");
        }

        let stringLicenses = JSON.stringify(results[0]);
        console.log(stringLicenses);
        gm.events.onPlayerLogin(player, results[0]);

        player.SendChatMessage("Connection sucesfully");

      } else {
        player.SendChatMessage("bad password,try again.")
      }

    });

    connection.end();

  }
});

commands.set("myname", (player, args) => {
  player.SendChatMessage("You're name : " + player.name);
});

commands.set('giveMoney', (player, args) => {

  if(PlayerInfo[player.name].adminlvl < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }

  if (args.length < 1) {
    return player.SendChatMessage("Use: /giveMoney [id or name] ([money])");
  }

  let money = parseInt(args[1]);

  if(isNaN(money)) {
    return player.SendChatMessage("Money must be a number!");
  }

  let targets = gm.utility.getPlayer(args[0], true)

  if (targets.length === 0) {
    return player.SendChatMessage("Unknow target.", new RGB(255, 0, 0));
  }
  else if (targets.length > 1) {
    let msg = "many target find: ";
    for (let p of targets) {
      msg += p.name + ", ";
    }
    msg = msg.slice(0, msg.length - 2);
    return player.SendChatMessage(msg, new RGB(255, 0, 0));
  }


  gm.utility.GivePlayerMoney(targets[0], money);
  player.SendChatMessage("[ADMIN]" + money + "$ give to " + targets[0].name, new RGB(255,0,0));
  targets[0].SendChatMessage("[ADMIN] You received " + money + "$ from " + player.name, new RGB(255,0,0));
});



commands.set("a", (player,args) => {
  let message = "[ADMIN] " + player.name + ": " + args.join(" ");
  gm.utility.print(message);
  player.SendChatMessage(message);
  //console.log("[ADMIN] " + player.name + ": " + args.join(" "))

  gm.utility.adminMessage(message, new RGB(255,158,61));
});

commands.set("reboot", (player) => {

  if(PlayerInfo[player.name].adminlevel < 1) return player.SendChatMessage("You're not allowed to use this command");

  var timer = 60
  var actualisation = setInterval(function() { compte(); }, 1000);

  function compte() {
   timer -= 1;
   if(timer == 0) { clearInterval(actualisation); }

  if(timer == 0) {
    console.log("Server restart")
    process.kill(process.pid);
  }

  }
});

commands.set("update", (player) => {

  if(PlayerInfo[player.name].adminlvl < 3) {
    return player.SendChatMessage("You don't have acces to this command.");
  }
  gm.events.updateAllPlayers();

});


commands.set("allachievement", (player,args) => {
  player.SendChatMessage("List of all Achievement :");
      player.SendChatMessage("kill 50 player");
      player.SendChatMessage("kill 100 player");
      player.SendChatMessage("kill 200 player");
      player.SendChatMessage("kill 1000 player");
      player.SendChatMessage("create a group");
      player.SendChatMessage("Find the treasure");
      player.SendChatMessage("do a craft");
      player.SendChatMessage("have a weapon");
});





commands.set("disconnect", (player) => {
  player.Kick("Normal quit");
});

commands.set("group", (player, args) => {

  if(args.length < 1) return player.SendChatMessage("Use: /group (create/invite (accept/delince)/leave/kick)")
  let option = args[0];
  switch(option) {

    case 'create': {
      if(typeof args[2] === 'undefined') return player.SendChatMessage("Use: /group create [group name]");
      if(PlayerInfo[player.name].group >= 1) return player.SendChatMessage("You're already in a group!");

      let groupName = gm.utility.getArgsFrom(2, args);

      let group = new gm.rpsys.group(groupName);

      group.create(player);
      player.SendChatMessage("You created the group: " + groupName);
      break;
    }
    case 'invite': {
        if(typeof args[2] === 'undefined') return player.SendChatMessage("Use /group invite [player name or id/accept/delince]");

        let argument = args[2].toLowerCase();
        if(argument == "accept" || argument == "delince") { // Used for checks
          if(GroupInvite[player.name] == 0) return player.SendChatMessage("You don't have invitations to " + argument);
          if(PlayerInfo[player.name].group >= 1) return player.SendChatMessage("You was already in a group!");
        }

      // Action of argument (accept/delince)

      if(argument == "accept")
      {
        let gindex = GroupInvite[player.name];
        player.SendChatMessage("Welcome " + player.name + " to the group " + GroupInfo[gindex].name);
        gm.rpsys.group.message(gindex, "New member in the group: " + player.name, new RGB(255,255,255));
        return gm.rpsys.addmember(player, gindex);
      }
      else if(argument == "delince")
      {
        let gindex = GroupInvite[player.name];
        let groupName = GroupInfo[gindex].name;
        GroupInvite[player.name] = 0;
        return player.SendChatMessage("You delinced the invitation to the group " + groupName);
      }

      // Invite to a player

        let targets = gm.utility.getPlayer(args[2], true)

        if (targets.length === 0) {
          return player.SendChatMessage("Unknow target.", new RGB(255, 0, 0));
        } else if (targets.length > 1) {
          let msg = "many target find: ";
          for (let p of targets) {
            msg += p.name + ", ";
          }
          msg = msg.slice(0, msg.length - 2);
          return player.SendChatMessage(msg, new RGB(255, 0, 0));
        }

        let target = targets[0];

        if(PlayerInfo[target.name].group >= 1) return player.SendChatMessage("This player was already in a group!");
        if(PlayerInfo[target.name].team != PlayerInfo[player.name].team) return player.SendChatMessage("That player was not in your team!");
        GroupInvite[target.name] = PlayerInfo[player.name].group;
        player.SendChatMessage("You send a invitation to: " + target.name);
        target.SendChatMessage("You recieved a invitation from " + player.name + " to join a group");
        //gm.rpsys.group.addmember(target, gindex)
      break;
    }
    case 'leave': {
      if(PlayerInfo[player.name].group < 1) return player.SendChatMessage("You aren't in a group");
      let gindex = PlayerInfo[player.name].group;

      player.SendChatMessage("You leaved from the group: " + GroupInfo[gindex].name);
      gm.rpsys.group.removemember(player, gindex);
      return gm.rpsys.group.message(gindex, player.name + " leaved", new RGB(255,255,255));
      break;
    }

    case 'kick': {

      if(typeof args[2] === 'undefined') return player.SendChatMessage("Use: /group kick [player name or id]")
      let targets = gm.utility.getPlayer(args[2], true)

      if (targets.length === 0) {
        return player.SendChatMessage("Unknow target.", new RGB(255, 0, 0));
      }
      else if (targets.length > 1) {
        let msg = "many target find: ";
        for (let p of targets) {
          msg += p.name + ", ";
        }
        msg = msg.slice(0, msg.length - 2);
        return player.SendChatMessage(msg, new RGB(255, 0, 0));
      }

      let target = targets[0];

      if(PlayerInfo[player.name].group != PlayerInfo[target.name].group) return player.SendChatMessage("This player is not in ur group!");
      
      let gindex = PlayerInfo[target.name].group;
      target.SendChatMessage("You was kicked from the group " + GroupInfo[gindex].name + " by " + player.name);
      gm.rpsys.removemember(target, gindex);
      return gm.rpsys.group.message(gindex, target.name + " was kicked from the group by " + player.name, new RGB(255,255,255));
      break;
    }

    case 'show':
    default: {
      if(PlayerInfo[player.name].group == 0) return player.SendChatMessage("You aren't in a group");
      let gindex = PlayerInfo[player.name].group;
      player.SendChatMessage(GroupInfo[gindex].name + " members: ");
      for(let i = 0; i < GroupInfo[gindex].members.length; i++) {
        player.SendChatMessage(" - " + GroupInfo[gindex].members[i]);
      }
      break;
    }
  }
});

commands.set("team", (player,args) => {
  if(PlayerInfo[player.name].teamid != 0) return player.SendChatMessage("You're in a team!");
  let teamlist = "";
  for(let i = 1; i < TeamNames; i++) {
    teamlist += TeamNames[i];
  }

  if(args.length < 1) return player.SendChatMessage("Use: /team [team name: " + teamlist + "]");
  let lowertname = args[0].toLowerCase();
  if(!gm.utility.isInArray(lowertname, TeamNames) || lowertname == "none") return player.SendChatMessage("Invalid team name");

  PlayerInfo[player.name].teamid = TeamNames.indexOf(lowertname);

  player.SendChatMessage("You joined to " + args[0]);
});

/*commands.set("createdm", (player, args) => {
  if (args.length < 1) {
    return player.SendChatMessage("Use: /createdm [name of the dm] [x] [y] [z] [radius] [playerlimit] [playerstart] [timer]");
  }

  // Here check if the values was correct or not.

    let pos1 = new Vector3f(args[1], args[2], args[3]);
    //let dmarea = new gm.dmsys.dm(args[0], pos, args[4], args[5, args[6], args[7], args[8]);
    dmarea.create(); // here ^^
  }

});*/

commands.set("joindm", (player, args) => {
  
  if (args.length < 1) {
    player.SendChatMessage("Use: /joindm [name of the dm]"); // or in a list with CEF
    player.SendChatMessage("Deathmatch games list: ");
    for(let i = 0; i < g_dm; i++) {
      let ni = i + 1;
      player.SendChatMessage(ni + ": " + Deathmatch[i].name + " players (" + Deathmatch[i].joined + "/" + Deathmatch[i].plimit + ")");
    }
    return 0;
  }

  if(isNaN(parseInt(args[0]))) {
    let index = gm.rpsys.dm.findByName(args[0]);
    return gm.rpsys.dm.djoin(player, index);
  } else {
    let index = parseInt(args[0]);
    return gm.rpsys.dm.djoin(player, index);
  }
  

});

commands.set("leavedm", (player) => {
 return gm.rpsys.dm.dleave(player);
});

/*commands.set("weapons", (player, args) => {
  if (args.length < 1) {
    return player.SendChatMessage("Use: /weapons [number of the pack]");
  }
  const weapons = resolveWeapon(args[0]);
  if (typeof weapon === "undefined") {
    return player.SendChatMessage("Use: /weapon [number of the pack]");
  }
  let ammo = 300; // number of ammo in each weapon
  let weapon = args[0]; // pack number
  if (weapon == 1) {
  player.AddWeapon(WEAPON_ASSAULTSHOTGUN, ammo, true);
  player.AddWeapon(WEAPON_PISTOL, ammo, true);
  }
    if (weapon == 2) {
  player.AddWeapon(WEAPON_CARBINERIFLE, ammo, true);
  player.AddWeapon(WEAPON_PISTOL, ammo, true);
  }
      if (weapon == 3) {
  player.AddWeapon(WEAPON_HEAVYSNIPER, ammo, true);
  player.AddWeapon(WEAPON_PISTOL, ammo, true);
  }
      if (weapon == 4) {
  player.AddWeapon(WEAPON_ASSAULTRIFLE, ammo, true);
  player.AddWeapon(WEAPON_PISTOL, ammo, true);
  }
player.SendChatMessage("You have received pack number : " + args[0]);
});*/

commands.set("choiceclass", (player, args) => {

  let classNames = ["demolition", "sniper", "assault"];

  if(args.length < 1) {
    player.SendChatMessage("Use /choiceclass [class number/name]");
    for(let i = 0; classNames.length; i++) {
      let opN = i + 1;
      player.SendChatMessage(opN + ": " + classNames[i]);
    }
    return 0;
  }

  let option = args[0];

  if(!isNaN(parseInt(option))) {
    let optionParsed = parseInt(option) - 1;
    option = classNames[optionParsed];
  }

  if(typeof option === 'undefined' || !gm.utility.isInArray(option, classNames)) return player.SendChatMessage("Invalid class name");
  let weapon;
  switch(option) 
  {
    case 'demolition': {
      gm.utility.GivePlayerWeapon(player, "WEAPON_ASSAULTSHOTGUN", 300);
      gm.utility.GivePlayerWeapon(player, "WEAPON_PISTOL", 300);
      break;
    }
    case 'sniper': {
      gm.utility.GivePlayerWeapon(player, "WEAPON_HEAVYSNIPER", 300);
      gm.utility.GivePlayerWeapon(player, "WEAPON_PISTOL", 300);
      break;
    }
    case 'assault': {
      gm.utility.GivePlayerWeapon(player, "WEAPON_ASSAULTRIFLE", 300);
      gm.utility.GivePlayerWeapon(player, "WEAPON_PISTOL", 300);
      break;
    }
  }

});


