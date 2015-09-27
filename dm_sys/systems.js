

"use strict";

let systems = module.exports;


systems.Group = require('./group');
systems.dm    = require('./dm');


systems.LoadDeathmatches = () => {
	let DMS = [
		{ // 0 
			name: "DM1", 
			pos1: new Vector2f(300.0, 100.0),
			pos2: new Vector2f(400.0, 150.0),
			spawns: [
				new Vector3f(330.0, 110.0, -200.0),
				new Vector3f(335.0, 120.0, -200.0),
				new Vector3f(350.0, 130.0, -200.0)
			],
			timer: gm.utility.minutes(15),
			plimit: 10,
			pstart: 4,
			kills: 60,
		},

		{ // 1
			name: "DM2",
			pos1: new Vector2f(100.0, 50.0),
			pos2: new Vector2f(200.0, 100.0),
			spawns: [
				new Vector3f(101.0, 51.0, -200.0),
				new Vector3f(110.0, 52.0, -200.0),
				new Vector3f(111.0, 53.0, -200.0)
			],
			timer: gm.utility.minutes(15),
			plimit: 10,
			pstart: 4,
			kills: 60
		}
	];

	// Load DM areas.

	let data;
	
	for(let i = 0; i < DMS.length; i++) 
	{
		data = DMS[i];
		let dmArea = new gm.rpsys.dm(data.name, data.pos1, data.pos2, data.spawns, data.plimit, data.pstart, data.kills, data.timer);
		dmArea.create();
	}

}