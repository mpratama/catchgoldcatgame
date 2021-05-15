import Phaser from 'phaser';
import marioTiles from '../assets/super-mario.png';
import marioMap from '../assets/super-mario.json';
import AnimatedTiles from '../js/AnimatedTiles.min.js';

export default class TestTilemap extends Phaser.Scene {
	constructor(){
		super({key: "tilemapScene"});
	}
	
	preload(){
		this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
		this.load.tilemapTiledJSON('map1', marioMap);
		this.load.image('tiles1', marioTiles);
	}
	
	create(){
		this.map1 = this.make.tilemap({ key: 'map1' });
		this.tileset1 = this.map1.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
		this.layer1 = this.map1.createLayer('World1', this.tileset1, 0, 0).setScale(2.5);
		this.layer2 = this.map1.createLayer('Benda', this.tileset1, 0, 0).setScale(2.5);
		this.sys.animatedTiles.init(this.map1);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.controlConfig = {
			camera: this.cameras.main,
			left: this.cursors.left,
			right: this.cursors.right,
			up: this.cursors.up,
			down: this.cursors.down,
			speed: 0.5
		};

		this.controls = new Phaser.Cameras.Controls.FixedKeyControl(this.controlConfig);

		this.cameras.main.setBounds(0, 0, this.layer1.x + this.layer1.width, this.layer1.height * 3);
		
	}
	
	update(time, delta){
		this.controls.update(delta);
	}
}