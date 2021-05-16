import Phaser from 'phaser';

import Game from './Game';
import ShakePositionPlugin from 'phaser3-rex-plugins/plugins/shakeposition-plugin.js';
import FlashPlugin from 'phaser3-rex-plugins/plugins/flash-plugin';

export default {
	width: 180,
	height: 320,
	title: "Untitled Cat Meteor Game",
	pixelArt: true,
	url: "https://github.com/mpratama",
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
		},
		{
			key: 'rexFlash',
			plugin: FlashPlugin,
			start: true
		}
		]
	},
	scene: [Game]
};