
"use strict";

function interior() {
  return {

  }
}

module.exports = {
  badWords: ["fuck", "shit", "BitEmE","Naunaud"],
  world: {
    weather: 1,
    windLevel: 0.0,
    rainLevel: 0.0,
    snowLevel: 0.0,
    timeScale: 1.0,
    IPLs: [],
    interiors: [],
    capInteriors: true
  },
  mysql: {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'gamemode'
  }
};
