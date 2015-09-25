"use strict";

class ground {
        constructor(position, items, quantity) {
                this.position = position;
                this.items        = items;
                this.quantity = quantity;
        }

        static inGroundPoint(player) {
                for(let i = 0; i < g_groundpoints; i++) {
                        let sphere = new gm.utility.sphere(GroundPoint[i].position.x, GroundPoint[i].position.y, GroundPoint[i].position.z, 1.0);
                        if(sphere.inRangeOfPoint(player.position)) {
                                return i;
                        }
                }
                return -1;
        }
        static pick(item, player, quantity) {

                let groundIndex = ground.inGroundPoint(player);



                if(groundIndex >= 0) {

                        if(isNaN(parseInt(item))) {

                                let indexItem = GroundPoint[groundIndex].items.indexOf(item);

                                if(typeof GroundPoint[groundIndex].items[indexItem] === 'undefined') return player.SendChatMessage("Thats not a valid item name");

                                let gitem = new gm.rpsys.Item(GroundPoint[groundIndex].items[indexItem], GroundPoint[groundIndex].quantity[indexItem]);
                                let groundleft = GroundPoint[groundIndex].quantity[indexItem] - parseInt(quantity);

                                // if quantity param is more than the quantity of that item in the ground.
                                if(groundleft < 0) {
                                        groundleft = GroundPoint[groundIndex].quantity[indexItem] - Math.abs(groundleft);
                                }

                                GroundPoint[groundIndex].quantity[indexItem] -= groundleft;



                                if(GroundPoint[groundIndex].quantity[indexItem] == 0)
                                {
                                        let maxQ = 0;
                                        for(let i = 0; i < GroundPoint[groundIndex].quantity.length; i++)
                                        {
                                                maxQ = GroundPoint[groundIndex].quantity[i];
                                                if(maxQ > 0) {
                                                        break;
                                                }
                                        }

                                        if(maxQ == 0) {
                                                let oldQuantities = GroundPoint[groundIndex].quantity;
                                                GroundPoint[groundIndex].quantity = [];
                                                setTimeout(function() {
                                                        GroundPoint[groundIndex].quantity = oldQuantities;
                                                }, gm.utility.minutes(30));
                                        }

                                }
                                gitem.give(player);
                                return player.SendChatMessage("You pick " + groundleft + " " + GroundPoint[groundIndex].items[indexItem] + "from the ground");

                        } else {

                                if(typeof GroundPoint[groundIndex].items[item] === 'undefined') return player.SendChatMessage("That number is not valid");

                                let gitem = new gm.rpsys.Item(GroundPoint[groundIndex].items[item], GroundPoint[groundIndex].quantity[item]);
                                gitem.give(player);
                                return player.SendChatMessage("You pick " + GroundPoint[groundIndex].quantity[item] + " " + GroundPoint[groundIndex].items[item] + "from the ground");
                        }

                } else return player.SendChatMessage("No was nothing here in the Ground");

        } // End of pick

        static listItems(player) {

                      let groundIndex = ground.inGroundPoint(player);

                      if(groundIndex >= 0) {

                              for(let i = 0; i < GroundPoint[groundIndex].items.length; i++) {
                                      if(GroundPoint[groundIndex].quantity[i] > 0) {
                                              player.SendChatMessage(i + ": Item: " + GroundPoint[groundIndex].items[i] + " quantity: " + GroundPoint[groundIndex].quantity[i]);
                                      }
                              }

                      } else return player.SendChatMessage("No was nothing here");
              } // End of list items
}
ground.prototype.create = function() {

        GroundPoint[g_groundpoints] = {
                position: this.position,
                items: this.items,
                quantity: this.quantity
        };

        // Here was a box here or something like that

        g_groundpoints += 1;
}

module.exports = ground;
