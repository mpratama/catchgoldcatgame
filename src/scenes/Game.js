import Phaser from 'phaser';
import fieldMap from '../assets/map.json';
import atlas from '../assets/atlas.png';
import AnimatedTiles from '../js/AnimatedTiles.min.js';
import ShakePosition from 'phaser3-rex-plugins/plugins/shakeposition.js';
import senyum from '../assets/senyum.jpg';

export default class Game extends Phaser.Scene {
	constructor(){
		super({key: "gameScene"});
	}
	
	preload(){
		this.load.spritesheet('cat', atlas, { frameWidth: 8, frameHeight: 8 });
		this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
		this.load.tilemapTiledJSON('map', fieldMap);
		this.load.image('tiles', atlas);
		this.load.image('smile', senyum);
	}
	
	create(){
		
		//generate Tilemap
		this.map = this.make.tilemap({ key: 'map' });
		this.tileset = this.map.addTilesetImage('sprites', 'tiles');
		this.layer1 = this.map.createLayer('base', this.tileset, 0, 0);
		this.layer2 = this.map.createLayer('vegetation', this.tileset, 0, 0);
		this.sys.animatedTiles.init(this.map);
		
		this.startRect = new Phaser.Geom.Rectangle(0, 0, 150, 260);
		this.playArea = this.add.rectangle(0 , 0, 180, 275).setDisplayOrigin(0.5, 0.5).setInteractive();
		
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
		
		for (var i = 0; i < 5; i++){
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
		
		this.shake = this.plugins.get('rexShakePosition').add(this.layer2, {
			mode: 1,
			duration: 5000,
			magnitude: 1,
			magnitudeMode: 1
		});
		
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
			
		});
		
		this.playArea.on('pointermove', (pointer) => {
			if (this.draw){
				this.rect.clear();
				this.rect.lineStyle(2, 0x000000, 0.5);
				this.rect.strokeRect(pointer.downX, pointer.downY, pointer.x - pointer.downX, pointer.y - pointer.downY);
			}
		});
		
		this.footer = this.add.rectangle(0, 270, 185, 50, 0x000000, 1).setDisplayOrigin(0.5, 0.5);
		this.catStats = this.add.text(10, 275, "Life: " + this.catNum, {
			fontSize: 10,
			fontFamily: 'Arial',
			color: '#000000',
			strokeThickness: 2
		});
		
		this.button = this.add.image(100, 285, 'smile').setScale(1.5).setInteractive();
		this.button.on('pointerdown', () => {
			this.cats.getChildren()[0].destroy();
		});
	}
	
	
	
	update(){
		this.catNum = this.cats.getLength();
		this.catStats.setText("Life: " + this.catNum);
		
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
			}
		}
		
		
	}
	
}