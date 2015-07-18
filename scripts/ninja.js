//
// Eray Arslan - relfishere@gmail.com -
// ninja.js 0.0.2-10min
// ... hmm ...
//

(function(root, factory) {

    if(typeof define === "function" && define.amd) {

        define(["exports"], function(exports) {
            root.ninja = factory(root, exports);
        });

    } else if (typeof exports !== "undefined") {

        factory(root, exports);

    } else {

        root.ninja = factory(root, {});

    }

}(this, function(root, ninja) {

    var getFile = function(file_path) {
        var request = new XMLHttpRequest();
        request.open('GET', file_path, false);
        request.send(null);

        if (request.status === 200) {
            return request.responseText;
        } else {
            return false;
        }
    };
    //
    var version = "0.0.2-10min";

    var pixel_size = 15;

    var youAscii = eval(getFile("ascii/you.json"));

    var monsters = [
        { name : "Murat"    , hp : 0.5      }, // nerf +0.5
        { name : "Serkan"   , hp : 1005     }, // buff +0.002k
        { name : "Eray"     , hp : 9999     }, // nerf -1
        { name : "Sefa"     , hp : 13000    }, // still noob
        { name : "Çağrı"    , hp : 20000    }, // buff +10k + 5k opsiqo
        { name : "Berk"     , hp : 25000    }, // nerf -5k
        { name : "Bınarcı"  , hp : 25000    }, // new monster
        { name : "Osman"    , hp : 40000    }, // new monster
        { name : "Levent"   , hp : 45000    }, // buff 5k
        { name : "Burak"    , hp : 90999    }, // buff +60k - 1
        { name : "Bahadır"  , hp : 200000   }  // buff +100k
    ];

    var items = [
        { name : "Işın Kılıcı", damage : 5, criticChange: -20, critic: 500 },
        { name : "Tava", damage : 10, criticChange: 1, critic: 1 },
        { name : "Culluk", damage : 10, criticChange: 5, critic: 5 },
        { name : "Yeşil", damage : 50, criticChange: 0, critic: 0 },
        { name : "Tütsü", damage : -15, criticChange: 25, critic: 50 },
        { name : "52lik", damage : 52, criticChange: 10, critic: -25 }, // new item
        { name : "Saç", damage : 200, criticChange: -50, critic: 50 } // new item
    ];

    var drawChar = function(el, char) {
        var w = 0;
        var h = char.length;
        //
        var ctx = el.getContext("2d");
        //
        for(var i=0;i<h;i++){
            if(char[i].length>w){
                w = char[i].length;
            }
        }
        //
        el.width = pixel_size*w;
        el.height = pixel_size*h;
        //
        for(var y=0;y<h;y++) {
            for(var x=0;x<w;x++) {
                if(char[y][x]!==undefined && char[y][x]!=="#fff") {
                    ctx.fillStyle=char[y][x];
                    ctx.fillRect(pixel_size*x,pixel_size*y,pixel_size,pixel_size);
                    ctx.stroke();
                }
            }
        }
    };

    var you = {
        level           :   1,
        damage          :   20,// buff +10
        criticChange    :   25,// %
        critic          :   50,// %
        items           :   []
    };

    var spawnMonster = function() {
        if(monsters[you.level - 1]) {
            return monsters[you.level - 1]
        } return false;
    };

    var currentMonster = spawnMonster();

    var random = function(from, to) {
        return Math.floor((Math.random() * to) + from);
    };

    var critic = function(hitDamage) {
        if(you.criticChange >= random(1,100)) {
            console.info("%" + you.critic + " critic!");
            return hitDamage * (you.critic / 100);
        } return 0;
    };

    var destroy = function() {
        delete window["ninja"];
    };

    var killCurrentMonster = function() {
        console.info("You killed " + currentMonster.name + "!");
        //
        you.level = you.level + 1;
        you.damage = you.damage + 10;
        you.criticChange = you.criticChange + 5;
        you.critic = you.critic + 10;
        //
        console.info("You're stronger now than before (:")
        //
        currentMonster = spawnMonster();
        if(!currentMonster) {
            console.info("You win ^,^");
            destroy();
        } else {
            dropItem();
            console.info("You have new enemy! (" + currentMonster.name + ")");
        }
    };

    var dropItem = function() {
        var item = items[random(0,items.length-1)];
        //
        you.damage = you.damage + item.damage;
        you.criticChange = you.criticChange + item.criticChange;
        you.critic = you.critic + item.critic;
        //
        console.log(item.name + " dropped!");
        //
        you.items.push(item);
    };
    //
    ninja.getVersion = function() {
        return version;
    };

    ninja.display = function(canvas_id) {
        drawChar(document.getElementById(canvas_id), youAscii);
    };

    ninja.lookEnemy = function() {
        return currentMonster;
    };

    ninja.lookYourSelf = function() {
        return you;
    };

    ninja.attackToEnemy = function() {
        console.clear();
        //
        var hitDamage = random(you.damage-10, you.damage);
        var criticDamage = critic(hitDamage);
        //
        var damage = hitDamage + criticDamage;
        currentMonster.hp = currentMonster.hp - damage;
        console.info("You hit " + damage + " to your enemy!");
        //
        if(currentMonster.hp < 0) {
            killCurrentMonster();
        }
        return damage;
    };

    return ninja;

}));