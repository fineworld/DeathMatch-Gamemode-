// HI
"use strict";

let Utility = module.exports;
Utility.hashes = require('./hashes/hashes');

/**
 * Broadcasts a Message to all Players.
 *
 * @param {string} message the message to broadcast.
 * @param {RGB=} [opt_color] color of the message
 */
Utility.broadcastMessage = (message, opt_color) => {
  for (let player of g_players) {
    player.SendChatMessage(message, opt_color);
  }
};



/**
 * Returns the player from his id or (part of his) Name
 *
 * @param  {string/number} idOrName Networkid or name of the player (or some digits of the name)
 * @param  {boolean=} [allowDuplicates=false] False: If multiple players have the same Name only the first one found is returned.
 *                                            True: Returns an array with all duplicate players with the name
 * @param  {boolean=} [caseSensitive=false] True if case sensitive, false if not
 * @return {Player} An array with the players found with the id or the name,
 *                  only contains the first one found if allowDuplicates was false, empty array if no player was found
 */
Utility.getPlayer = (idOrName, opt_allowDuplicates, opt_caseSensitive) => {
  let allowDuplicates = opt_allowDuplicates || false;
  let caseSensitive = opt_caseSensitive || false;
	let id = parseInt(idOrName);
	let fnCheck;

	if (isNaN(id)) {
		if(caseSensitive === false) {
			idOrName = idOrName.toLowerCase();
		}

		// define fnCheck to check the players name
		fnCheck = target => {
			let targetName;
			if(caseSensitive === false) {
				//ignore capital letters
				targetName = target.name.toLowerCase();
			}
      else {
				// do not ignore capital letters
				targetName = target.name;
			}
			if (targetName.indexOf(idOrName) === 0) {
				return true;
			}
			return false;
		};
	}
  else {
		fnCheck = target => target.client.networkId === id;
	}

	let playerArray = [];
	for (let tempPlayer of g_players) {
		if (fnCheck(tempPlayer)) {
			playerArray.push(tempPlayer);
			if(allowDuplicates === false) {
				// exit the loop, because we just return the first player found
				break;
			}
		}
	}
	return playerArray;
};

// rajouter
Utility.GetPlayerMoney = (player) => {
	return player.stats.GetStatInt("SP0_TOTAL_CASH");
};

Utility.SetPlayerMoney = (player, money) => {
	return player.stats.SetStatInt("SP0_TOTAL_CASH", money);
};

Utility.GivePlayerMoney = (player, money) => {
	let fmoney = GetPlayerMoney(player) + (money);
	player.stats.SetStatInt(player, fmoney);
};

Utility.dbConnect = () => {
	return gm.mysql.createConnection({
        host     : gm.config.mysql.host,
        user     : gm.config.mysql.user,
        password : gm.config.mysql.password,
        database : gm.config.mysql.database
    });
};

Utility.ban = (player) => {

	let connection = Utility.dbConnect(); /*gm.mysql.createConnection({
        host     : gm.config.mysql.host,
        user     : gm.config.mysql.user,
        password : gm.config.mysql.password,
        database : gm.config.mysql.database
    });*/

	connection.connect();

	let SQLQuery = "UPDATE users SET banned = 1 WHERE id = " + PlayerInfo[player.name].id;
	printf(player.name + "a été bannis");
	connection.query(SQLQuery);

	connection.end();

};

Utility.unban = (player) => {

	let connection = Utility.dbConnect(); /*gm.mysql.createConnection({
        host     : gm.config.mysql.host,
        user     : gm.config.mysql.user,
        password : gm.config.mysql.password,
        database : gm.config.mysql.database
    });*/

	connection.connect();

	let SQLQuery = "UPDATE users SET banned = 0 WHERE id = " + PlayerInfo[player.name].id;
	printf(player.name + "a été débannis");
	connection.query(SQLQuery);

	connection.end();

};

Utility.adminMessage = (message, opt_color) => {
  for (let player of g_players) {
  	if(PlayerInfo[player.name].adminlvl >= 1) {
    	player.SendChatMessage(message, opt_color);
	}
  }
};

Utility.print = (msg) => {
  let fmsg = Utility.timestamp() + " " + msg;
  console.log(fmsg);
  /*let f = gm.fs("./logs/general.txt");
  f.write(fmsg+ "\n");
  f.end();*/
};

Utility.timestamp = () => {
	let d = new Date();
	let year = d.getFullYear();
	let month = d.getMonth();
	let day = d.getDate();
	let hour = d.getHours();
	let min = d.getMinutes();
	let secs = d.getSeconds();
	let time = "[" + day + "/" + month + "/" + year + "][" + hour + ":" + min + ":" + secs + "]";
	return time;
};

Utility.seconds = (seconds) => {
	return seconds * 1000;
};

Utility.minutes = (minutes) => {
	return Utility.seconds(60) * minutes;
};

Utility.isInArray = (value, array) => {
  //return array.indexOf(value) > -1;

  let result = array.indexOf(value);

  if(result >= 0) return true;
  else return false;

};

Utility.sphere = class Sphere { // By Tirus

    constructor(x, y, z, opt_radius) {
	    this.x = x;
	    this.y = y;
	    this.z = z;
	    this.radius = opt_radius || 1;
    }

};

Utility.sphere.prototype.inRangeOfPoint = function(position) { // By Tirus

	return (Math.pow((position.x - this.x), 2) +
            Math.pow((position.y - this.y), 2) +
            Math.pow((position.z - this.z), 2) < Math.pow(this.radius, 2));
}

// ------------  Vehicle spawn -----------//

Utility.VehicleSpawn = function(model, x, y, z, rotation) {
	let exrotation = rotation || 0;
	console.log(model);
	let fmodel;
	if(typeof model === "string") {
		fmodel = Utility.hashes.findByName(gm.utility.hashes.vehicles, model);
	} else {
		fmodel = Utility.hashes.vehicles[model];
	}

	//console.log(fmodel)
	const vehicle = new Vehicle(new Vector3f(x, y, z), fmodel.h);
  	vehicle.rotation.z = exrotation;

  	gm.events.OnVehicleSpawn(vehicle);
  	return vehicle;
}


Utility.getArgsFrom = (start, args) => {
  let fullargs = "";
  for(let i = start; i < args.length; i++) {
    if(i == start || i == args.length) { fullargs += args[i]; }
    else if(i > start && i < args.length) { fullargs += args[i] + " "; }
  }
}

Utility.resolveWeapon = weapon => {
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

Utility.GivePlayerWeapon = (player, weapon, ammo) => {
	let exWeapon = Utility.resolveWeapon(weapon);
	player.AddWeapon(exWeapon.h, ammo, true);
}

Utility.floatcmp = (f1, f2) => {
	if(parseFloat(f1) == parseFloat(f2)) return 0;
	if(parseFloat(f1) < parseFloat(f2))  return -1;
	if(parseFloat(f1) > parseFloat(f2))  return 1;
}

Utility.IsBetweenVector = (v, v1, v2) => {
	
	switch(Utility.floatcmp(v1, v2))
	{
		case 0: if(v == v1) return 1;
		case 1: if(v <= v1 && v >= v2) return 1;
		case -1: if(v >= v1 && v <= v2) return 1;
	}
	return 0;
}

Utility.IsPointInRectangle = (pos1, pos2, pos3) => {

	if(Utility.IsBetweenVector(pos1.x, pos2.x, pos3.x) && Utility.IsBetweenVector(pos1.y, pos2.y, pos3.y))
	{
		return 1;
	}
	return 0;
}