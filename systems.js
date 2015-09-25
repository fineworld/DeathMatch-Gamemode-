

"use strict";

let systems = module.exports;


systems.Shop = require('./shop');
systems.Item = require('./item');
systems.Group = require('./group');
systems.Ground = require('./ground');

/*module.exports = class systems {
	let farm = require('./farm');
	let Shop = require('./shop');
	let Item = require('./item');
}*/

// ---------------- Load SHOPS -------------- //

systems.LoadShops = () => {

	let shopSpawns = [
		{ position: new Vector3f(3360.19, -4849.67, 111.8), items: ["apple", "orange", "kebab", "cocacola", "bannana", "rat", "lemon juice"] },
		{ position: new Vector3f(-90.0, -2365.8, 14.3), items: ["shears", "wives", "explosive charge", "flanges keys"] }
	];

	console.log("Loading shops...");

	let shop;
	for(let i = 0; i < shopSpawns.length; i++)
	{
		let shopData = shopSpawns[i];
		shop = new gm.rpsys.Shop(shopData.position, shopData.items);
		shop.create();
	}

	console.log("Loaded " + g_shops + " shop(s)");
}

// ----------------- Load GROUPS ------------- //

systems.LoadGroups = (dbconnection) => {
  // well db connection u can call it if u check in main.js for the MySQL connection but if u not... Utility.dbConnection()
  let connection = dbconnection; // put here Utility.dbConnection(); if u not check the mysql connection in main function

  let SQLQuery = "SELECT * FROM groups";

  connection.query(SQLQuery, function(err, result) {
  console.log("Loading groups...");

  if(err) {
    gm.utility.print("An error ocurred trying to load a group");
    gm.utility.print("[QUERY]: " + SQLQuery);
    gm.utility.print("[ERROR]: " + err);
  }
  else
  {
		let num_rows = result.length;
		let cr = 0;

		// parsing the elements of the array
		// Split reference: http://www.w3schools.com/jsref/jsref_split.asp
		let parseMembers, parseMembersRank;

		while(num_rows > cr)
		{
		   //console.log("ROW: " + cr + " index: " + cr+1 + " ID: " + result[cr].id + "NAME: " + result[cr].name);

		   parseMembers = result[cr].members.split(",");
		   parseMembersRank = result[cr].membersrank.split(",");

		  GroupInfo[cr+1] = {
		   id: result[cr].id,
		   name: result[cr].name,
		   members: parseMembers,
		   membersrank: parseMembersRank
		  };
		  cr++;
		}
		g_groups = cr;
		console.log("Loaded " + g_groups + " group(s)")
    }
  });
}



systems.LoadGround = () => {

 let groundSpawns = [
  { position: new Vector3f(3360.19, -4849.67, 111.8), items: ["apple", "orange", "kebab", "cocacola", "bannana", "rat", "lemon juice"], quantity: [1, 3, 5, 2, 1, 1, 2] },
  { position: new Vector3f(-90.0, -2365.8, 14.3), items: ["shears", "wives", "explosive charge", "flanges keys"], quantity: [1, 3, 5, 2] }
 ];

 console.log("Loading shops...");

 let Grounds;
 for(let i = 0; i < groundSpawns.length; i++)
 {
  let groundData = groundSpawns[i];
  ground = new gm.rpsys.Shop(groundData.position, groundData.items, groundData.quantity);
  ground.create();
 }

 console.log("Loaded " + g_ground + " ground(s)");
}
