

(function(){
var width = window.innerWidth;
var height = window.innerHeight > 480 ? 480 : window.innerHeight;
var gameScore = 0;
var highScore = 0;

var SantaGame = {

	init: function(){

		this.game = new Phaser.Game(width, height, Phaser.CANVAS, '');
		this.game.state.add("load", this.load);
		this.game.state.add("play", this.play);
		this.game.state.add("title", this.title);
		this.game.state.add("gameOver", this.gameOver);
		this.game.state.add("instructions", this.instructions);
		this.game.state.start("load");

	},

	load: {
		preload: function(){
			this.game.load.audio('drivin-home', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/drivin-home-low.mp3');
			this.game.load.audio('ho-ho-ho', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/ho-ho-ho.mp3');
			this.game.load.audio('hop', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/jump-sound.mp3');
			this.game.load.image('platform', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/ground.png');			                                  this.game.load.spritesheet('santa-running', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/santa-running.png', 37, 52);
			this.game.load.image('snow-bg', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/snow-bg.png');
			this.game.load.image('snowflake', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/snowflake.png');
			this.game.load.image("logo", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/game-logo.png");
			this.game.load.image("instructions", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/instructions.png");
			this.game.load.image("game-over", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/game-over.png");
			this.game.load.image("startbtn", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/start-btn.png");
			this.game.load.image("playbtn", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/play-btn.png");
			this.game.load.image("restartBtn", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/restart-btn.png");
		},
		create: function(){
			this.game.state.start("title");
		}
	},


	// title screen

	title: {

		create: function(){
			this.bg = this.game.add.tileSprite(0, 0, width, height, 'snow-bg');
			this.logo = this.game.add.sprite(this.game.world.width/2 - 158, 20, 'logo');
			this.logo.alpha = 0;
			this.game.add.tween(this.logo).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 0);
			this.startBtn = this.game.add.button(this.game.world.width/2 - 159, this.game.world.height - 120, 'startbtn', this.startClicked);
			this.startBtn.alpha = 0;
			this.game.add.tween(this.startBtn).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 1000);
		},

		startClicked: function(){
			this.game.state.start("instructions");
		},

	},

// instructions screen
	instructions: {

		create: function(){
			this.bg = this.game.add.tileSprite(0, 0, width, height, 'snow-bg');
			this.instructions = this.game.add.sprite(this.game.world.width/2 - 292, 30, 'instructions');
			this.instructions.alpha = 0;
			this.game.add.tween(this.instructions).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true, 0);
			this.playBtn = this.game.add.button(this.game.world.width/2 - 159, this.game.world.height - 120, 'playbtn', this.playClicked);
			this.playBtn.alpha = 0;
			this.game.add.tween(this.playBtn).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true, 800);
		},

		playClicked: function(){
			this.game.state.start("play");
		},
	},

	// playing
	play: {

			create: function(){
					highScore = gameScore > highScore ? Math.floor(gameScore) : highScore;
				gameScore = 0; 
				this.currentFrame = 0;
				this.particleInterval = 2 * 60;
				this.gameSpeed = 780;
				this.isGameOver = false;
				this.game.physics.startSystem(Phaser.Physics.ARCADE);

				this.music = this.game.add.audio("drivin-home");
				this.music.loop = true;
				this.music.play();

				this.bg = this.game.add.tileSprite(0, 0, width, height, 'snow-bg');
				this.bg.fixedToCamera = true;
				this.bg.autoScroll(-this.gameSpeed / 6, 0);

				this.emitter = this.game.add.emitter(this.game.world.centerX, -32, 50);

				this.platforms = this.game.add.group();
				this.platforms.enableBody = true;
				this.platforms.createMultiple(5, 'platform', 0, false);
				this.platforms.setAll('anchor.x', 0.5);
				this.platforms.setAll('anchor.y', 0.5);

				var plat;

				for(var i=0; i<5; i++){
					plat = this.platforms.getFirstExists(false);
					plat.reset(i * 192, this.game.world.height - 24);
					plat.width = 192;
					plat.height = 24;
					this.game.physics.arcade.enable(plat);
					plat.body.immovable = true;
					plat.body.bounce.set(0);
				}

				this.lastPlatform = plat;

				this.santa = this.game.add.sprite(100, this.game.world.height - 200, 'santa-running');
				this.santa.animations.add("run");
				this.santa.animations.play('run', 20, true);

				this.game.physics.arcade.enable(this.santa);

				this.santa.body.gravity.y = 2500;
				this.baseGravity = this.santa.body.gravity.y;
				this.cheatY = this.santa.y;
				this.santa.body.collideWorldBounds = true;

				this.emitter.makeParticles('snowflake');
				this.emitter.maxParticleScale = .02;
				this.emitter.minParticleScale = .001;
				this.emitter.setYSpeed(100, 200);
				this.emitter.gravity = 0;
				this.emitter.width = this.game.world.width * 1.5;
				this.emitter.minRotation = 0;
				this.emitter.maxRotation = 40;

				this.game.camera.follow(this.santa);
				this.cursors = this.game.input.keyboard.createCursorKeys();

				this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
				this.emitter.start(false, 0, 0);
				this.score = this.game.add.text(20, 20, '', { font: "24px Arial", fill: "white", fontWeight: "bold" });

					if(highScore > 0){
						this.highScore = this.game.add.text(20, 45, 'Best: ' + highScore, { font: "18px Arial", fill: "white" });
					}

					// Auto-play button (helps weaker players reach 300 points)
					this.autoPlay = false;
					this.autoTarget = 300;

					this.didRedirect = false;
					this.baseGravity = 2500;
					this.cheatY = null;
this.autoBtn = this.game.add.text(this.game.width - 16, 20, 'AUTO: OFF', {
						font: "16px Arial",
						fill: "white",
						fontWeight: "bold",
						backgroundColor: "rgba(0,0,0,0.45)"
					});
					this.autoBtn.anchor.set(1, 0);
					this.autoBtn.fixedToCamera = true;
					this.autoBtn.inputEnabled = true;
					this.autoBtn.events.onInputDown.add(function(){
						this.autoPlay = !this.autoPlay;
						this.autoBtn.text = this.autoPlay ? 'AUTO: ON' : 'AUTO: OFF';
						if(!this.autoPlay){
							this.santa.body.allowGravity = true;
							this.santa.body.gravity.y = this.baseGravity;
						}
						if(this.autoPlay && this.cheatY === null){ this.cheatY = this.santa.y; }

					}, this);
					// Auto-play helpers
					this.groundPlatform = null;
					this.lastAutoJumpAt = 0;
					this.autoCooldownMs = 240;

			},
			update: function(){
				var that = this;
				if(!this.isGameOver){
					gameScore += .5;
					if(!this.didRedirect && Math.floor(gameScore) >= this.autoTarget){
						this.didRedirect = true;
						window.location.href = "./noel/index.html";
					}
						this.gameSpeed += .03;
					this.score.text = 'Score: ' + Math.floor(gameScore);

					this.currentFrame++;
					var moveAmount = this.gameSpeed / 100;
					this.game.physics.arcade.collide(this.santa, this.platforms, function(s, p){ that.groundPlatform = p; }, null, this);

					// Win mode: hover + invincible until reaching target score
					if(this.autoPlay){
						// keep santa hovering (no falling)
						this.santa.body.allowGravity = false;
						this.santa.body.velocity.y = 0;
						if(this.cheatY === null) this.cheatY = this.santa.y;
						this.santa.body.y = this.cheatY;
						this.santa.y = this.cheatY;
						// auto-finish
						if(!this.didRedirect && Math.floor(gameScore) >= this.autoTarget){
							this.didRedirect = true;
							if(this.autoBtn) this.autoBtn.text = 'AUTO: DONE';
							window.location.href = "./noel/index.html";
						}
					}

					if(!this.autoPlay && this.santa.body.bottom >= this.game.world.bounds.bottom){
						this.isGameOver = true;
						this.endGame();

					}

					if(this.cursors.up.isDown && this.santa.body.touching.down || this.spacebar.isDown && this.santa.body.touching.down || this.game.input.mousePointer.isDown && this.santa.body.touching.down || this.game.input.pointer1.isDown && this.santa.body.touching.down){
						this.jumpSound = this.game.add.audio("hop");
						this.jumpSound.play();
						this.santa.body.velocity.y = -700;
					}


					if(this.particleInterval === this.currentFrame){
						this.emitter.makeParticles('snowflake');
						this.currentFrame = 0;
					}

					this.platforms.children.forEach(function(platform) {
						platform.body.position.x -= moveAmount;
						if(platform.body.right <= 0){
							platform.kill();
							var plat = that.platforms.getFirstExists(false);

// Platform gap (random but still jumpable)
var minGap = 150;                // base distance between platform centers
var desiredMaxGap = 520;         // allow bigger gaps as speed increases
var platformHalfWidth = 96;      // platform width is 192px (set in create)
var jumpV = 700;                 // jump impulse (see jump handler)
var gravityY = 2500;             // gravity (see create)
var airTime = (2 * jumpV) / gravityY; // ~0.56s at same height
var pxPerSec = (that.gameSpeed / 100) * 60; // approx @60fps
var maxEmptyGap = pxPerSec * airTime * 0.85; // safety margin
var maxGapSafe = Math.max(minGap, Math.floor(maxEmptyGap + platformHalfWidth));
var maxGap = Math.min(desiredMaxGap, maxGapSafe);

// Mix distributions so it doesn't feel "almost equal" each time
var t = Math.random();
if (Math.random() < 0.35) t = Math.pow(t, 0.55); // bias to larger gaps sometimes
var randomGap = Math.floor(minGap + t * (maxGap - minGap));

// Avoid consecutive gaps being too similar
if (that._lastGap !== undefined && Math.abs(randomGap - that._lastGap) < 28) {
	randomGap = Math.min(maxGap, randomGap + 35 + Math.floor(Math.random() * 55));
}
that._lastGap = randomGap;

plat.reset(that.lastPlatform.body.right + randomGap, that.game.world.height - (Math.floor(Math.random() * 50)) - 24);
							plat.body.immovable = true;
							that.lastPlatform = plat;
						}
					});

				}

			},


			endGame: function(){
				this.music.stop();
				this.music = this.game.add.audio("ho-ho-ho");
				this.music.play();
				this.game.state.start("gameOver");
			}


	},
	gameOver: {

		create: function(){
			this.bg = this.game.add.tileSprite(0, 0, width, height, 'snow-bg');
			this.msg = this.game.add.sprite(this.game.world.width/2 - 280.5, 50, 'game-over');
			this.msg.alpha = 0;
			this.game.add.tween(this.msg).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true, 0);

			this.score = this.game.add.text(this.game.world.width/2 - 100, 200, 'Score: ' + Math.floor(gameScore), { font: "42px Arial", fill: "white" });
			this.score.alpha = 0;
			this.game.add.tween(this.score).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true, 600);

			this.restartBtn = this.game.add.button(this.game.world.width/2 - 183.5, 280, 'restartBtn', this.restartClicked);
			this.restartBtn.alpha = 0;
			this.game.add.tween(this.restartBtn).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true, 1000);
		},

		restartClicked: function(){
			this.game.state.start("play");
		},
	}

};

SantaGame.init();

})();