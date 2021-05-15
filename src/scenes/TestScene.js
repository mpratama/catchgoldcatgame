//import Phaser from 'phaser';
import Phaser from 'phaser';
import Senyum from './Senyum';
import senyum from '../assets/senyum.jpg';
import GrayScalePostFx from 'phaser3-rex-plugins/plugins/grayscalepipeline.js';
import OutlinePostFx from 'phaser3-rex-plugins/plugins/outlinepipeline.js';

export default class TestScene extends Phaser.Scene {
	constructor(){
		super({key: "bootScene"});
	}
	
	init(data){
		this.dt1 = data.kata;
	}
	
	preload(){
		this.load.image('smile', senyum);
	}
	
	create(){
		this.gambar = this.add.image(100, 100, 'smile').setInteractive();
		this.gbr = new Senyum(this, 200, 200, 'smile');
		
		// rex BBCode
		this.txt = this.add.rexBBCodeText(100, 150, this.dt1);
		
		//rex Drag Object
		this.drag = this.plugins.get('rexDrag').add(this.gambar, {
			enable: true,
			axis: 1,
			rotation: Phaser.Math.DegToRad(45)
		});
		
		//rex joystick
		this.joystick = this.plugins.get('rexVirtualJoystick').add(this, {
			x: 70,
			y: 290,
			radius: 30,
			fixed: true,
			dir: 1,
			forceMin: 25
		});
		
		//rex Spinner
		this.spinner = this.rexSpinner.add.spinner({
			x: 200,
			y: 100,
			width: 60,
			height: 60,
			color: 0xffffff,
			duration: 1000,
			start: true
		});
		
		//rex shader
		//this.gambar.setPostPipeline(GrayScalePostFx);
		
		//rex Flash behaviour
		this.flash = this.plugins.get('rexFlash').add(this.gambar, {
			duration: 200,
			repeat: 8
		});
		
		this.gambar.once('pointerdown', () => {
			console.log("Terpencet");
			this.flash.flash();
		});
	}
	
	update(){
		this.checkJoystick();
	}
	
	checkJoystick(){
		if (this.joystick.left) {
			//console.log("atas");
			this.gambar.x -= 1;
			this.gbr.clicked();
		}
		else if (this.joystick.right){
			//console.log("bawah");
			this.gambar.x += 1;
		}
		//console.log(this.joystick.pointerX);
	}
}