
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
  if(pAdmin[player.name] < 3) {
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
  return player.SendChatMessage("[ID: " + PlayerInfo[player.name].id + "] [AdminLevel: " + PlayerInfo[player.name].adminlvl + "]");
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
            console.log("Ha ocurrido un error al registrar al jugador \n\n");
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

commands.set("hash", (player, args) => {
  let text = args.join(" ");
  let hashtext = sha1(text);
  player.SendChatMessage(hashtext);
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
  gm.utility.print("[CMD] " + player.name + ": " + args.join(" "))
  player.SendChatMessage("[ADMIN] " + player.name + ": " + args.join(" "))
  console.log("[ADMIN] " + player.name + ": " + args.join(" "))

  gm.utility.adminMessage(message, new RGB(255,158,61));
});
commands.set("reboot", (player,args) => {
  var timer = 60
  var actualisation = setInterval(function() { compte(); }, 1000);

  function compte() {
   timer -= 1;
   if(timer == 0) { clearInterval(actualisation); }

if (timer == 0) {
  console.log("Server restart")
process.kill(process.pid);
}

  }
});

commands.set("update", (player,args) => {
  if (args.length < 1) {
    return player.SendChatMessage("Use: /update");
  }
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

commands.set("shop", (player, args) => {

  let sphere;

  for(let i = 0; i < g_shops; i++) {

  sphere = new gm.utility.sphere(ShopInfo[i].position.x, ShopInfo[i].position.y, ShopInfo[i].position.z);

  if(sphere.inRangeOfPoint(player.position)) {

      //if(typeof args[0] === 'undefined') return player.SendChatMessage("Use: /shop (buy/sell/show)");
      console.log(args[0]);
      let option = "show";
      if(typeof args[0] != 'undefined') { option = args[0].toLowerCase(); }

      switch(option) {

        case 'buy': {

          if(ShopInfo[i].type == 'dealer') return player.SendChatMessage("You can't buy nothing here");

          let product = args[1];
          let quantity = parseInt(args[2]);

          if(typeof product === 'undefined' || quantity <= 0 || typeof quantity === 'undefined' || isNaN(quantity)) return player.SendChatMessage("To buy use: /shop buy [item number or name] [quantity]");

          if(isNaN(parseInt(product))) {
            //if(isNaN(quantity)) return player.SendChatMessage("quantity must be a number");

            gm.rpsys.Shop.buy(player, product, quantity)

          } else {
            if(isNaN(quantity)) return player.SendChatMessage("quantity must be a number");

            let itemIndex = parseInt(product);

            if(typeof ShopInfo[i].items[itemIndex] === 'undefined') return player.SendChatMessage("Item number not valid");

            gm.rpsys.Shop.buy(player, ShopInfo[i].items[itemIndex], quantity);

          }
          break;
        }

        case 'sell': {

          let product = args[1];
          let quantity = parseInt(args[2]);

          if(typeof product === 'undefined' || quantity <= 0 || typeof quantity === 'undefined' || isNaN(quantity)) return player.SendChatMessage("To sell use: /shop sell [item number or name] [quantity]");

          if(isNaN(parseInt(product))) {
            gm.rpsys.Shop.sell(player, product, quantity);
          } else {
            let sellItem = [];

            for(let c = 0; c < PlayerInventory[player.name].objects; c++) {
              if(gm.utility.isInArray(PlayerInventory[player.name].objects[c], ShopInfo[i].items)) {
                sellItem.push(PlayerInventory[player.name].objects[c]);
              }
            }

              let indexItem = parseInt(product);

              if(ShopInfo[i].type == 'dealer') {
                gm.rpsys.Shop.sell(player, sellItem[indexItem], quantity);
              } else {
                gm.rpsys.Shop.sell(player, ShopInfo[i].items[indexItem], quantity);
              }

            }
            break;
          }

        case 'show':
        default: {

          if(ShopInfo[i].type == 'dealer') {
            player.SendChatMessage(" You can sell the next things here: (use /shop sell [item number or name] [quantity]");
            let count = 0;
            for(let c = 0; c < PlayerInventory[player.name].objects; c++) {
              if(gm.utility.isInArray(PlayerInventory[player.name].objects[c], ShopInfo[i].items)) {
                player.SendChatMessage(count + ": " + PlayerInventory[player.name].objects[c]);
                count++;
              }
            }

          } else {
            player.SendChatMessage("Items of the shop (use: /shop sell | buy [item number or name] [quantity]")
            for(let c = 0; c < ShopInfo[i].items.length; c++) {
              player.SendChatMessage(c + ": " + ShopInfo[i].items[c]);
            }

          }
          break;
        }

      } // options switch end
      return true;
    } // position Check end
  } // for end

  return player.SendChatMessage("You aren't in a shop");

});


commands.set("inventory", (player) => {

  let itemCount = PlayerInventory[player.name].objects.length;

  player.SendChatMessage("Player inventory: " + "( " + itemCount + " ) Weight: (" + PlayerInventory[player.name].weight + "/" + PlayerInventory[player.name].maxWeight + ")");
  for(let i = 0; i < itemCount; i++) {
    let itemWeight = gm.rpsys.Item.findByName(gm.items, PlayerInventory[player.name].objects[i]);
    player.SendChatMessage(" Item: " + PlayerInventory[player.name].objects[i] + " quantity: " + PlayerInventory[player.name].objectsQuantity[i] + " weight: " + (itemWeight.w * PlayerInventory[player.name].objectsQuantity[i]));
  }

  //console.log(Object.keys(PlayerInventory[player.name].objects))

});

commands.set("disconnect", (player) => {
  player.Kick("Normal quit");
});

commands.set("group", (player, args) => {

  let option = args[0];

  switch(option) {
    case 'create': // Group creation
    {
      let gname = args[1];

      if(typeof gname === 'undefined') {
        return player.SendChatMessage("/group create [group name]");
      }

      if(PlayerInfo[player.name].groupid >= 1) return player.SendChatMessage("You was already in a group");

      let group = new gm.rpsys.Group(gname);
      group.create(player);
      break;
    }

    case 'invite': { // Invite / invitations


      if(typeof args[1] === 'undefined') return player.SendChatMessage("/group invite [player id or name] | accept/refuse");

      // Accept

      if(args[1] == 'accept') {

        if(typeof GroupInvite[player.name] === 'undefined' || GroupInvite[player.name] == '') return player.SendChatMessage("You don't have a invitations to accept");

        //let grid = GroupInvite[player.name];

        gm.rpsys.Group.addmember(player, GroupInvite[player.name]);

        GroupInvite[player.name] = '';
        //player.SendChatMessage("New member to de group: " + player.name);
        gm.rpsys.groupMessage(PlayerInfo[player.name].groupid, "New member to the group: " + player.name, new RGB(255,255,255));
        return player.SendChatMessage("Welcome to the group: " + gm.rpsys.Group.findNameById(PlayerInfo[player.name].groupid));

      }

      // Refuse

      if(args[1] == 'refuse') {

        if(typeof GroupInvite[player.name] === 'undefined' || GroupInvite[player.name] == '') return player.SendChatMessage("You don't have a invitations to delince");

        GroupInvite[player.name] = '';
        return player.SendChatMessage("You delinced the invitation to the group: " + GroupInfo[GroupInvite[player.name]].name)
      }

      if(PlayerInfo[player.name].groupid == 0) {
        return player.SendChatMessage("You dont have a group!");
      }

      // Invite player

      let gid = gm.rpsys.Group.findById(PlayerInfo[player.name].groupid);

      let index = GroupInfo[gid].members.indexOf(player.name); //GroupInfo[gid].membersrank.indexOf(GroupInfo[gid].members);
      let memberrank = GroupInfo[gid].membersrank[index];

      if(memberrank < 3) {
        return player.SendChatMessage("You dont have permission to invite people to the group");
      }

      let targets = gm.utility.getPlayer(args[1], true);

        if (targets.length === 0) {
          return player.SendChatMessage("Unknown Target.", red);
        }
        else if (targets.length > 1) {
          let msg = "found multiple targets: ";
          for (let p of targets) {
            msg += p.name + ", ";
          }
          msg = msg.slice(0, msg.length - 2);
          return player.SendChatMessage(msg, red);
        }

      if(PlayerInfo[targets[0].name].groupid >= 1) return player.SendChatMessage("This player was already in a group");
      //let group = new gm.utility.Group(GroupInfo[gid].name);
      //let igid = PlayerInfo[player.name].groupid; //GroupInfo[PlayerInfo[player.name].groupid].id;

      GroupInvite[targets[0].name] = gid;

      targets[0].SendChatMessage("You recieved a invitation to the group " + GroupInfo[gid].name + " from " + player.name);
      targets[0].SendChatMessage("You can accept/delince the invitation using: /group invite (accept/refuse)");
      break;

    }

    case 'leave': {

      if(PlayerInfo[player.name].groupid == 0) return player.SendChatMessage("You dont have a group!");

      let groupName = gm.rpsys.Group.findNameById(PlayerInfo[player.name].groupid);

      player.SendChatMessage("You leaved from the group: " + groupName);
      // Send group message
      let groupIndex = gm.rpsys.Group.findById(PlayerInfo[player.name].groupid);

      gm.rpsys.Group.removemember(player);//, groupIndex);
      break;

    }
    case 'kick': {
      if(PlayerInfo[player.name].groupid == 0 ) return player.SendChatMessage("You don't have a group!");

      let indexGroup = gm.rpsys.Group.findById(PlayerInfo[player.name].groupid);

      let indexRank = GroupInfo[indexGroup].members.indexOf(player.name);

      if(GroupInfo[indexGroup].membersrank[indexRank] < 4) return player.SendChatMessage("You don't have permission to do that!");

      if(typeof args[1] === 'undefined') return player.SendChatMessage("/group kick [player id or name]");

      let targets = gm.utility.getPlayer(args[1], true);

        if (targets.length === 0) {
          return player.SendChatMessage("Unknown Target.", red);
        }
        else if (targets.length > 1) {
          let msg = "found multiple targets: ";
          for (let p of targets) {
            msg += p.name + ", ";
          }
          msg = msg.slice(0, msg.length - 2);
          return player.SendChatMessage(msg, red);
        }

        if(PlayerInfo[player.name].groupid != PlayerInfo[targets[0].name].groupid) return player.SendChatMessage("This player wasn't in your group");

        gm.rpsys.Group.removemember(targets[0]);

        player.SendChatMessage("You kicked: " + targets[0].name + " from the group");
        targets[0].SendChatMessage("You was kicked from the group " + GroupInfo[indexGroup].name + " by " + player.name);
        break;
    }

    case 'promote': {

      if(PlayerInfo[player.name].groupid == 0) return player.SendChatMessage("You aren't in a group");

      let indexGroup = gm.rpsys.Group.findById(PlayerInfo[player.name].groupid);

      let indexRank = GroupInfo[indexGroup].members.indexOf(player.name);

      if(GroupInfo[indexGroup].membersrank[indexRank] != 7) return player.SendChatMessage("You don't have permission to do that!");

      if(typeof args[1] === 'undefined') return player.SendChatMessage("/group promote [player id or name] [rank]");

      let targets = gm.utility.getPlayer(args[1], true);

        if (targets.length === 0) {
          return player.SendChatMessage("Unknown Target.", red);
        }
        else if (targets.length > 1) {
          let msg = "found multiple targets: ";
          for (let p of targets) {
            msg += p.name + ", ";
          }
          msg = msg.slice(0, msg.length - 2);
          return player.SendChatMessage(msg, red);
        }

        let rank = parseInt(args[2]);

        if(rank < 1 || rank > 6) return player.SendChatMessage("Rank must be between 1 and 6")

        let promoteIndex = GroupInfo[indexGroup].members.indexOf(targets[0].name);

        GroupInfo[indexGroup].membersrank[promoteIndex] = rank;

        player.SendChatMessage("You promoted " + targets[0].name + " to rank " + rank);
        targets[0].SendChatMessage("You was promoted to rank " + rank + " by " + player.name);

    }

    case 'show': {
      // Show info group (members & ranks)
      if(PlayerInfo[player.name].groupid == 0) {
        return player.SendChatMessage("You aren't in a group");
      }

      let gid = gm.rpsys.Group.findById(PlayerInfo[player.name].groupid);
      if(!gid) {
        player.SendChatMessage("Groups: " + g_groups)
        return player.SendChatMessage("Error when trying to get group info");
      }
      player.SendChatMessage("Group ID: " + gid);

      player.SendChatMessage("Group " + GroupInfo[gid].name  + " member list:")
      for(let i = 0; i < GroupInfo[gid].members.length; i++) {
        player.SendChatMessage("Name: " + GroupInfo[gid].members[i] + " rank: " + GroupInfo[gid].membersrank[i]);
      }
      break;
    }
    default: {
      player.SendChatMessage("You selected a invalid option");
      return player.SendChatMessage("/group (create/invite/leave/kick/show)")
    }
  }
});
commands.set("clearInventory", (player) => {
  PlayerInventory[player.name].items    = [];
  PlayerInventory[player.name].quantity = [];
});
commands.set("ground", (player) => {
gm.ground.pick(player);
});
commands.set("team", (player, args) => {
  if(PlayerInfo[player.name].teamid != 0) {
    return player.SendChatMessage("You are in a team");
  }
  if (args.length < 1) {
    return player.SendChatMessage("Use: /team [name of the team]");
  }
  var team = ["None","LSPD","Mafia"];
  console.log("ARGS = " + args[0]);
  if(!gm.utility.isInArray(args[0], team)) return player.SendChatMessage("Not valid team");
  var n = team.indexOf(args[0]);
    if(n == 0) return player.SendChatMessage("not valid team");
    if (n == 1) { PlayerInfo[player.name].teamid == 1;
      player.SendChatMessage ("You become LSPD")
      };
    if (n == 2) { PlayerInfo[player.name].teamid == 2;
      player.SendChatMessage ("You become Mafia")
}
});


commands.set("createdm", (player, args) => {
  if (args.length < 1) {
    return player.SendChatMessage("Use: /createdm [name of the dm] [position] [radius] [playerlimit] [playerstart] [time]");
  }

});
commands.set("joindm", (player, args) => {
  if (args.length < 1) {
    return player.SendChatMessage("Use: /joindm [name of the dm]"); // or in a list with CEF
  }

});

commands.set("leavedm", (player) => {
  if (args.length < 1) {
    return player.SendChatMessage("Use: /leavedm");
  }

});

commands.set("weapons", (player, args) => {
  if (args.length < 1) {
    return player.SendChatMessage("Use: /weapons [number of the pack]");
  }

});
