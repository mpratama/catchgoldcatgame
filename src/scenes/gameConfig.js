import Phaser from 'phaser';

import Game from './Game';
import ShakePositionPlugin from 'phaser3-rex-plugins/plugins/shakeposition-plugin.js';

export default {
	width: 180,
	height: 320,
	title: "Phaser dengan ParcelJS guys",
	pixelArt: true,
	url: "yesbesoklibur.com",
	backgroundColor: 0xffffff,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: 'arcade',
		arcade: {
			//gravity: { y: 100 },
			debug: false
			}
	},
	plugins: {
		global: [
		{
			key: 'rexShakePosition',
			plugin: ShakePositionPlugin,
			start: true
		}
		
			]
	},
	scene: [Game]
};