"use strict";

class dm {
  constructor(name, pos1, pos2, spawns, plimit, pstart, kills, timer) {
    this.name     = name;
    this.spawns   = spawns;
    //this.radius   = radius;
    this.plimit   = plimit;
    this.pstart   = pstart;
    this.timer    = timer;
    this.kills    = kills;
  }

  static djoin(player, index) {
    if(Deatchmatch[index].plimit )
    //player.position = Deatchmatch[index].position;

    if(Deatchmatch[index].pjoined < Deatchmatch[index].plimit) {
      let rnd = gm.utility.RandomInt(0, Deatchmatch[index].spawns.length);
      spawnPos = Deatchmatch[index].spawns[rnd];
      DMArea[player.name] = index;
      player.position = spawnPos;
      Deatchmatch[index].joined += 1;
      if(Deatchmatch[index].joined == Deatchmatch[index].pstart) {
        OnDeathmatchStart(index);
        setTimeout(function() {
          gm.events.OnDeathmatchEnd(index);
        }, Deatchmatch[index].timer)
      }
    } else {
      return player.SendChatMessage("This deathmatch reached maximun players");
    }
  }

  static dleave(player) {
    
    if(DMArea[player.name] < 0) return player.SendChatMessage("You not joined to a deathmatch");

    let lobby = new Vector3f(0.0, 0.0, 0.0);
    player.position = lobby;
    let dmindex = DMArea[player.name];
    Deathmatch[dmindex].joined -= 1;
    DMArea[player.name] = -1;
    player.SendChatMessage("You leaved of the deathmatch");

  }

  static findByName(name) {
    for(let i = 0; i < g_dm; i++) {
      if(Deathmatch[i].name == name) {
        return i;
      }
    }
    return -1;
  }

  static IsPlayerInDMArea(player) {
    
    let dmindex = DMArea[player.name];

    let pos1 = Deathmatch[dmindex].pos1;
    let pos2 = Deathmatch[dmindex].pos2;

    if(gm.utility.isPointInRectangle(player.position, pos1, pos2)) {
      return 1;
    }
    return 0;
  }
}

dm.prototype.create = function() {

  global.Deathmatch[g_dm] = {
    name: this.name,
    spawns: this.spawn,
    //radius: this.radius,
    kills: this.kills,
    plimit: this.plimit,
    pstart: this.pstart,
    timer: this.timer,
    pjoined: 0
  }

  g_dm++;
}

module.exports = dm;

// i don't no id
// id = index in array of Deathmatch
