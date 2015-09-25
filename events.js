
"use strict";

/**
 * @namespace
 */
let Events = module.exports;
let commands = require('./commands');

/**
 * Registers all Events.
 *
 */
Events.register = () => {
  // Note: 'events' is the GTA:MP Event-System.
  events.Add("ClientConnected", Events.onClientConnected);
  events.Add("ClientDisconnected", Events.onClientDisconnected);

  events.Add("ChatMessage", Events.onChatMessage);
  events.Add("ChatCommand", Events.onChatCommand);

  events.Add("PlayerCreated", Events.onPlayerCreated);
  events.Add("PlayerDestroyed", Events.onPlayerDestroyed);

  events.Add("PlayerShot", Events.onPlayerShot);
  events.Add("PlayerDeath", Events.onPlayerDeath);
};

/**
 * Called when a Client connects
 *
 * @param {Client} client the new client
 */
Events.onClientConnected = client => {
  console.log("Client (ip: " + client.ipAddress + ") connected.");
};

/**
 * Called when a Client disconnects
 *
 * @param {Client} client the new client
 * @param {integer} reason disconnect reason
 */
Events.onClientDisconnected = (client, reason) => {
  console.log("Client (ip: " + client.ipAddress + ") disconnected. Reason: " + (reason === 1 ? "Timeout" : "Normal quit"));
};

/**
 * Called when a Player typed a message in the chat.
 *
 * @param {Player} player the player
 * @param {string} message the message
 * @returns {boolean} whether the chat message should be blocked or not.
 */
Events.onChatMessage = (player, message) => {
  // basic example on blocking swearing players
  let lowMsg = message.toLowerCase();
  for (let badWord of gm.config.badWords) {
    if (lowMsg.indexOf(badWord.toLowerCase()) !== -1) {
      player.SendChatMessage("Please be nice.", new RGB(255, 59, 59));
      return true;
    }
  }

  let fmsg = player.name + ": " + message;
if(PlayerInfo[player.name].adminlvl == 1) { fmsg = "[Modo] " + fmsg; }
if(PlayerInfo[player.name].adminlvl == 2) { fmsg = "[ADMIN] " + fmsg; }
return fmsg;
};

/**
 * Called when a Player types in a chat command (e.g. /command)
 *
 * @param {Player} player the player
 * @param {string} command the command
 */
Events.onChatCommand = (player, command) => {
  let args = command.split(" ");

  // Let's check if this crazy thing ever happens.
  if (args.length === 0) {
    throw "This should NEVER happen.";
  }
  let commandName = args.splice(0, 1)[0];

  for (const command of commands) {
    if (command[0].toLowerCase() === commandName.toLowerCase()) {
      command[1](player, args);
      return true;
    }
  }
  player.SendChatMessage("Unknown command.", new RGB(255, 59, 59));
};

/**
 * Called when a new Player was created (after he connected)
 *
 * @param {Player} player the new player
 */
Events.onPlayerCreated = player => {
  console.log(player.name + " it's connected.");

  // Set world for the player
  let now = new Date();
  player.world.SetTime(now.getHours(), now.getMinutes(), now.getSeconds());
  player.world.timeScale = gm.config.world.timeScale;
  player.world.weather = gm.config.world.defaultWeather;

  for (let ipl of gm.config.world.IPLs) {
    player.world.RequestIPL(ipl);
  }
  for (let interior of gm.config.world.interiors) {
    player.world.EnableInterior(interior);
    if (!gm.config.world.capInteriors) {
      player.world.UnCapInterior(interior);
    }
  }

  player.SendChatMessage("Welcome to the server : ", new RGB(0, 255, 0));
  player.SendChatMessage("<em>Write /help to see the commands</em>");
};

/**
 * Called when a Player dies
 *
 * @param {Player} player the player that is no more :'(
 * @param {integer} reason the reason (hash)
 */
Events.onPlayerDeath = (player, reason, killer) => {
  let teamid = PlayerInfo[killer.name].team;
  let message = "~r~" + player.name + "~s~ ";
  if (typeof killer !== "undefined") {
    if (killer === player) {
      message += "killed himself.";
    } else {
      if(typeof killer.name !== "undefined") {
        message += "has been killed by ~r~" + killer.name + "~s~.";
      } else {
        message += "has been run over by a vehicle (probably).";
      }
    }
    TeamKills[teamid] += 1;
  } else {
    message += "died.";
  }
  for (let tempPlayer of g_players) {
    tempPlayer.graphics.ui.DisplayMessage(message);
  }
  if(TeamKills[teamid] >= 150){



  } // winner
};

/**
 * Called when a Player shot
 *
 * @param {Player} player the shooting player
 * @param {integer} weaponType the weapon he used to shoot
 * @param {Vector3f} aimPos aim position
 */
Events.onPlayerShot = player => {
  player.graphics.ui.DisplayMessage("~r~SHOTS FIRED");
};

/**
 * Called when a Player is leaving the Server
 *
 * @param {Player} player the leaving player
 */
Events.onPlayerDestroyed = player => {
  console.log(player.name + " is disconnect.");
  if(pLogged[player.name]) { Events.OnplayerUpdate(player); } /// Add this
};

// rajouter

/**
 * Called when a new Player was created (after he connected)
 *
 * @param {Player} player the new player
 */
 Events.onPlayerCreated = player => {
   pLogged[player.name]    = false;
   ConfirmReg[player.name] = false;

   PlayerInfo[player.name] = {
     id: 0,
     adminlvl: 0,
     groupid: 0,
     teamid: 0,

   };
   PlayerInventory[player.name] = {
objects: [],
objectsQuantity: [],
weight: 0,
maxWeight: 64

};


   console.log(player.name + " is connected.");

   // Set world for the player
   let now = new Date();
   player.world.SetTime(now.getHours(), now.getMinutes(), now.getSeconds());
   player.world.timeScale = gm.config.world.timeScale;
   player.world.weather = gm.config.world.defaultWeather;

   for (let ipl of gm.config.world.IPLs) {
     player.world.RequestIPL(ipl);
   }
   for (let interior of gm.config.world.interiors) {
     player.world.EnableInterior(interior);
     if (!gm.config.world.capInteriors) {
       player.world.UnCapInterior(interior);
     }
   }

   player.SendChatMessage("Welcome to the server :", new RGB(0, 255, 0));
   player.SendChatMessage("<em>Write /help to see the commands</em>");

   // REG SYSTEM

     let connection = gm.utility.dbConnect();

     connection.connect(function(err){

       if(!err) {
           console.log("Database is connected ... \n\n");
       } else {
           console.log("Error connecting database ... \n\n");
       }

     });

     connection.query("SELECT username FROM users WHERE username = '" + player.name + "'", function(err, results) {

         let numRows = results.length;

         if(numRows >= 1) {
           player.SendChatMessage("Use /login [motdepasse] to connect");
           Registered[player.name] = true;

         } else {
           player.SendChatMessage("You're not registered, use /register [motdepasse] to register");
           Registered[player.name] = false;
         }
     });
     connection.end();
     console.log("Players connected: " + g_players.length);
   // --
 };

 Events.onPlayerLogin = (player, dbData) => {

  console.log("dbData \n" + dbData);

  gm.utility.print("Player " + player.name + " logged in");



  PlayerInfo[player.name] = {
    id: dbData.id,
    adminlvl: dbData.adminlvl,
    groupid: dbData.groupid,
    teamid: dbData.teamid


  };


};
Events.onPlayerUpdate = (player, callback, info) => {

  info = typeof info !== 'undefined' ? info : true;
  let connection = gm.utility.dbConnect();



  connection.connect();

  let SQLQuery = "UPDATE users SET" +
  " adminlvl=" + PlayerInfo[player.name].adminlvl +
  " ,groupid=" + PlayerInfo[player.name].groupid +
  " ,teamid=" + PlayerInfo[player.name].teamid +
  " WHERE id = " + PlayerInfo[player.name].id;


  connection.query(SQLQuery, function(err) {
    if(err) {
          gm.utility.print("An error ocurred trying to upload the info of " + player.name);
          gm.utility.print("QUERY: " + SQLQuery);
          gm.utility.print("[ERROR]: " + err);
          if(callback) callback(false);
        } else {
          if(info) { gm.utility.print("player data of " + player.name + " has been updated."); }
          if(callback) callback(true);
        }
  });

  connection.end();

};

Events.updateAllPlayers = () => {
  let loggedPlayers = 0;
  if(g_players.length >= 1)
  {
     console.log("Uploading all players info...");
    for (let player of g_players)
    {
      if(pLogged[player.name])
      {
        Events.onPlayerUpdate(player,function(){},false);
        loggedPlayers++;
      }
    }

    console.log("info of all players (" + loggedPlayers + ") has been uploaded");

  }
};

/**
 * Called when a player enter in the area when he is not registered for him or when he join a match
 * @param {Player} player
 */
Events.OnAreaEnter = (player) => {


};
/**
 * Called when a player try to leave the area of the DM game is still running
 * @param {Player} player
 *
 */
Events.OnAreaLeave = (player) => {


};
/**
 * Called when a DM start
 * @param {Player} player
 */
Events.OnDeathMatchStart = (player) => {


};
/**
 * Called when a DM end
 * @param {Player} player
 */
Events.OnDeathMatchEnd = (player) => {


};
