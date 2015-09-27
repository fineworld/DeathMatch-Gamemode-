

"use strict";

class Group {

	constructor(teamname) {
    this.name = teamname;
  }

  static addmember(player, index) {
    PlayerInfo[player.name].group = index;
    GroupInfo[index].members.push(player.name)
    GroupInvite[player.name] = 0;
  }

  static removemember(player, index) {
    let mindex = GroupInfo[index].members.indexOf(player.name);
    GroupInfo[index].members[mindex] = "";
    
    for(let i = 0; GroupInfo[index].members.length; i++) {
      if(GroupInfo[index].members[i] == "") {
        GroupInfo[index].members.splice(i, 1);
      }
    }
  } // End of removemember

  static message(group, message, opt_color) {
    let defcolor = new RGB(255,255,255);
    let defaultcolor = opt_color || defcolor;
    for (let player of g_players) {
      if(PlayerInfo[player.name].group == group) {
      player.SendChatMessage(message, opt_color);
      }
    }
  } // End of Group message
  // End of Group class
}

Group.prototype.create = function(player) {
  g_groups++;
  GroupInfo[g_groups] = { name: this.name, members: [player.name] }
  PlayerInfo[player.name].group = g_groups;
}

module.exports = Group;
