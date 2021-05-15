import Phaser from 'phaser';

export default class extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, texture){
		
		super(scene, x, y, texture);
		this.setTexture(texture);
		this.setPosition(x, y);
		
		this.setInteractive();
		this.on('pointerdown', this.clicked, this);
		scene.physics.add.existing(this);
		scene.add.existing(this);
	}
	
	preUpdate(){
		//console.log("kunyuk");
		//this.x += 1;
	}
	
	clicked(){
		this.x += 1;
	}
	
}