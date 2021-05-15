import Phaser from 'phaser';
import red from '../assets/red.png';

export default class Rect extends Phaser.Scene {
	constructor(){
		super({key: "rectScene"});
	}
	
	preload(){
		this.load.image('red', red);
	}
	
	create(){
		this.startRect = new Phaser.Geom.Rectangle(0, 0, 360, 600);
		this.cats = this.add.group();
		for (var i = 0; i < 5; i++){
			this.ngana = this.physics.add.image(null, null, 'red');
			this.cats.add(this.ngana);
		}
		Phaser.Actions.RandomRectangle(this.cats.getChildren(), this.startRect);
		
		//this.catGroup = this.add.group({ key: 'red', frameQuantity: 5 });
		//this.startRect = new Phaser.Geom.Rectangle(0, 0, 360, 600);
		//Phaser.Actions.RandomRectangle(this.catGroup.getChildren(), this.startRect);
		
		this.target = new Phaser.Math.Vector2();
		this.gambar = this.physics.add.image(100, 100, 'red');
		//this.physics.add.image(100, 100, 'red');
		
		this.rect = this.add.graphics();
		this.draw = false;
		this.pdX = 0;
		this.pdY = 0;
		this.pX = 0;
		this.pY = 0;
		
		// start drawing (player start touch the screen)
		this.input.on('pointerdown', (pointer) => {
			this.draw = true;
		});
		
		this.input.on('pointerup', (pointer) => {
			this.draw = false;
			this.pdX = pointer.downX;
			this.pdY = pointer.downY;
			this.pX = pointer.x;
			this.pY = pointer.y;
			this.target.x = Phaser.Math.Between(this.pX - 10, this.pdX + 10);
			this.target.y = Phaser.Math.Between(this.pY - 10, this.pdY + 10);
			/* for (var i = 0; i < this.cats.getLength(); i++){
				this.physics.moveToObject(this.cats.getChildren()[i], this.target, 100);
			} */
			this.physics.moveToObject(this.gambar, this.target, 100);
		});
		
		this.input.on('pointermove', (pointer) => {
			if (this.draw){
				this.rect.clear();
				this.rect.lineStyle(2, 0x000000, 1);
				this.rect.strokeRect(pointer.downX, pointer.downY, pointer.x - pointer.downX, pointer.y - pointer.downY);
			}
		});
	}
	
	update(){
		
		//calculate distance between cats and target
		this.distance = Phaser.Math.Distance.Between(this.gambar.x, this.gambar.y, this.target.x, this.target.y);
		
		// stop the cat
		if (this.distance < 4){
			this.gambar.body.reset(this.target.x, this.target.y);
		}
		
	}
	
}