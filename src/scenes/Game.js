import Phaser from 'phaser';
import fieldMap from '../assets/map.json';
import atlas from '../assets/atlas.png';
import AnimatedTiles from '../js/AnimatedTiles.min.js';
import ShakePosition from 'phaser3-rex-plugins/plugins/shakeposition.js';
//import senyum from '../assets/senyum.jpg';

export default class Game extends Phaser.Scene {
	constructor(){
		super({key: "gameScene"});
	}
	
	preload(){
		this.load.spritesheet('cat', atlas, { frameWidth: 8, frameHeight: 8 });
		this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
		this.load.tilemapTiledJSON('map', fieldMap);
		this.load.image('tiles', atlas);
		//this.load.image('smile', senyum);
	}
	
	create(){
		
		//generate Tilemap
		this.map = this.make.tilemap({ key: 'map' });
		this.tileset = this.map.addTilesetImage('sprites', 'tiles');
		this.layer1 = this.map.createLayer('base', this.tileset, 0, 0);
		this.layer2 = this.map.createLayer('vegetation', this.tileset, 0, 0);
		this.sys.animatedTiles.init(this.map);
		
		this.groundShake = this.plugins.get('rexShakePosition').add(this.layer2, {
			mode: 1,
			duration: 500,
			magnitude: 1,
			magnitudeMode: 0
		});
		
		this.startRect = new Phaser.Geom.Rectangle(0, 0, 150, 260);
		this.playArea = this.add.rectangle(0 , 0, 180, 275).setDisplayOrigin(0.5, 0.5).setInteractive();
		//this.gold = this.physics.add.image(100, 100, 'smile');
		
		this.cats = this.add.group();
		
		this.targets = [0,0,0,0,0,0,0,0,0];
		this.distances = [0,0,0,0,0,0,0,0,0];
		this.colors = [0xff595e, 0xb4f8c8, 0xffaebc, 0xa49393, 0xff75d8, 0xffca3a, 0x4d6cfa];
		
		this.animIdle = this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('cat', { frames: [ 8, 9 ] }),
            frameRate: 3,
            repeat: -1
        });
		
		this.animRunRight = this.anims.create({
            key: 'runRight',
            frames: this.anims.generateFrameNumbers('cat', { frames: [ 6, 7 ] }),
            frameRate: 8,
            repeat: -1
        });
		this.animRunLeft = this.anims.create({
            key: 'runLeft',
            frames: this.anims.generateFrameNumbers('cat', { frames: [ 10, 11 ] }),
            frameRate: 8,
            repeat: -1
        });
		
		for (var i = 0; i < 9; i++){
			this.cat = this.physics.add.sprite(null, null, 'cat', 2);
			this.cat.setTint(Phaser.Math.RND.pick(this.colors));
			this.cats.add(this.cat);
			this.cat.play('idle');
		}
		
		Phaser.Actions.RandomRectangle(this.cats.getChildren(), this.startRect);

		this.rect = this.add.graphics();
		this.draw = false;
		this.pdX = 0;
		this.pdY = 0;
		this.pX = 0;
		this.pY = 0;
		this.catNum = 0;
		this.points = 0;
		
		// start drawing (player start touch the screen)
		this.playArea.on('pointerdown', (pointer) => {
			this.draw = true;
		});
		
		this.playArea.on('pointerup', (pointer) => {
			this.draw = false;
			this.pdX = pointer.downX;
			this.pdY = pointer.downY;
			this.pX = pointer.x;
			this.pY = pointer.y;
			
			for (var i = 0; i < this.cats.getLength(); i++){
				this.target = new Phaser.Math.Vector2();
				this.target.x = Phaser.Math.Between(this.pX - 10, this.pdX + 10);
				this.target.y = Phaser.Math.Between(this.pY - 10, this.pdY + 10);
				this.targets[i] = this.target;
				
			}
			
			for (var i = 0; i < this.cats.getLength(); i++){
				this.rad = this.physics.moveToObject(this.cats.getChildren()[i], this.targets[i], 100);
				if (Phaser.Math.RadToDeg(this.rad) > 90 || Phaser.Math.RadToDeg(this.rad) < -90){
					this.cats.getChildren()[i].play('runLeft');
				}
				else if (Phaser.Math.RadToDeg(this.rad) > -90 || Phaser.Math.RadToDeg(this.rad) < 90){
					this.cats.getChildren()[i].play('runRight');
				}
				
			}
			
			this.rect.clear();
			this.summonButton.setVisible(false);
			
		});
		
		this.playArea.on('pointermove', (pointer) => {
			if (this.draw){
				this.rect.clear();
				this.rect.lineStyle(2, 0x000000, 0.5);
				this.rect.strokeRect(pointer.downX, pointer.downY, pointer.x - pointer.downX, pointer.y - pointer.downY);
			}
		});
		
		this.footer = this.add.rectangle(0, 270, 185, 50, 0x000000, 1).setDisplayOrigin(0.5, 0.5);
		this.catStats = this.add.text(115, 271, "Cat: " + this.catNum, {
			fontSize: 11,
			fontFamily: 'Arial',
			color: '#000000',
			strokeThickness: 2
		});
		this.lifeShake = this.plugins.get('rexShakePosition').add(this.catStats, {
			mode: 1,
			duration: 100,
			magnitude: 2,
			magnitudeMode: 0
		});
		
		this.scoreText = this.add.text(10, 271, "Score: " + this.points, {
			fontSize: 11,
			fontFamily: 'Arial',
			color: '#000000',
			strokeThickness: 2
		});
		
		this.summonButton = this.add.text(65, 290, "Clone 1 Cat\n\(-50 point\)", {
			fontSize: 10,
			fontFamily: 'Arial',
			color: '#000000',
			strokeThickness: 1,
			backgroundColor: '#ffffff'
		}).setInteractive();
		
		this.summonButton.on('pointerdown', () => {			
			if (this.cats.getLength() < 9 && this.points >= 50){
				this.points -= 50;
				this.cat = this.physics.add.sprite(Phaser.Math.Between(this.pX - 10, this.pX + 10), Phaser.Math.Between(this.pY - 10, this.pY + 10), 'cat', 2);
				this.cat.setTint(Phaser.Math.RND.pick(this.colors));
				this.cats.add(this.cat);
				this.cat.play('idle');
				this.lifeShake.shake();
			}
		});
		
		this.time.delayedCall(3000, this.spawnCoin, [], this);
		
		
	}
	
	spawnCoin(){
		this.spawnX = Phaser.Math.Between(20, 150);
		this.spawnY = Phaser.Math.Between(-10, -50);
		this.gold = this.physics.add.sprite(this.spawnX, this.spawnY, 'cat', 4).setScale(1.5);
		this.overlapCoin = this.physics.add.overlap(this.cats, this.gold, () => {
			this.points += 10;
			this.gold.destroy();
			this.timedEvent = this.time.delayedCall(2000, this.spawnCoin, [], this);
		}, null, this);
		
		this.tweens.add({
			targets: this.gold,
			x: Phaser.Math.Between(20, 160),
			y: Phaser.Math.Between(20, 260),
			ease: 'Quint.easeIn',
			duration: 1500,
			onStart: () => {
				this.overlapCoin.active = false;
			},
			onComplete: () => {
				this.overlapCoin.active = true;
				this.groundShake.shake();
				this.gold.setTint(0xf8d210);
			},
			onCompleteScope: this
			//onCompleteParams: [ image ]
		});
		
	}	
	
	update(){
		
		this.catNum = this.cats.getLength();
		this.catStats.setText("Life: " + this.catNum);
		if (this.catNum == 9){
			this.catStats.setText("Life: " + this.catNum + " MAX!");
		}
		this.scoreText.setText("Score: " + this.points);
		
		//calculate distance between cats and target
		for (var i = 0; i < this.cats.getLength(); i++){
			this.distance = Phaser.Math.Distance.Between(this.cats.getChildren()[i].x, this.cats.getChildren()[i].y, this.targets[i].x, this.targets[i].y);
			this.distances[i] = this.distance;
		}
		
		
		// stop the cats
		for (var i = 0; i < this.cats.getLength(); i++){
			if (this.distances[i] < 4){
				this.cats.getChildren()[i].body.reset(this.targets[i].x, this.targets[i].y);
				this.cats.getChildren()[i].play('idle', true);
				
				if (!this.draw && this.distance == 0){
					this.summonButton.setVisible(true);
				}
			}
		}
	}
	
}