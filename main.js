
"use strict";

/*
    A few notes from Jan:
    The default package is using the strict mode. If you need more information about the strict mode, read this:
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
    We are also using ES6 features:
        https://iojs.org/en/es6.html

    This package is split up into multiple files. This was a personal choice. You *could* append all content into one single file.
    However, this would become kind of messy somewhen. In order to keep your code as readable as possible, I decided to split it up.

    This package is also conform to Google's Javascript Style Guide:
        https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 */

function Query(port) {
    let http = require('http');

    //We need a function which handles requests and send response
    function handleRequest(request, response){
        let param = request.url.split("/");
        let action = param[param.length - 1];
        if(action == "serverInfo") {
            let server_config = JSON.parse(g_server.config);
            let server_info = GetServer();

            let data = {
                name: server_info.serverName,
                maxPlayers: server_info.maxPlayers,
                serverMode: server_config.mode,
                serverMap: server_config.map,
                playersOnline: g_players.length
            };
            return response.end(JSON.stringify(data));
            return response.end(msg);
        }
        else if(action == "playersList") {
            let players = [];
            let msg = "";
            for(let p of g_players) {
                players.push({id: p.client.networkId, name: p.name});
            }
            return response.end(JSON.stringify(players));
            return response.end(msg);
        }
        return response.end("/serverInfo - Server info\n/playerList - List of players");
    }

    let server = http.createServer(handleRequest);
    server.listen(port, function(){
        console.log("Server listening on: http://localhost:%s", port);
    });
}

module.exports = Query;

// Creating a global namespace to prevent naming issues with GTA:MP
/**
 * @namespace
 */

// player variables
global.PlayerInfo = [];
global.TeamNames  = ["none", "red", "blue"];
//global.PlayerInventory = [];
//Other player variables
global.ConfirmReg = [];
global.ConfirmPwd = [];
global.Registered = [];
// Group system variables
global.g_groups = 0;
global.GroupInfo = [];
global.GroupInvite = [];
// DM system
global.g_dm       = 0;
global.Deathmatch = [];
//global.CreateZone = [];
global.DMArea     = [];
//global.ActiveDM   = 0;



global.gm = {
  config: require('./config.js'),
  events: require('./events.js'),
  utility: require('./utility.js'),
  mysql:   require('./node_modules/mysql'),
  sha1:    require('./node_modules/sha1'),
  //items:    require('./inventory.js'),
  rpsys:   require('./dm_sys/systems.js')
};

/**
 * The main function of this package.
 */
function main () {
  console.log("Registering Events...");
  gm.events.register();

  console.log("Server started!");
  Query(8080); //You can change your port

  // ---- This is for check database connection ----- //

  /*let testdb = gm.utility.dbConnect();

  testdb.connect(function(err) {
    if(err) {
      console.log("Error connecting to the database ... ");
      throw err;
    } else {
      console.log('Database connected!')
    }
  });

  testdb.end();*/
}

main();
