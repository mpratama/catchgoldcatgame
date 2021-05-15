import Phaser from 'phaser';
//import TestScene from './TestScene';
//import TestTilemap from './TestTilemap';
import Rect from './Rect';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';
import DragPlugin from 'phaser3-rex-plugins/plugins/drag-plugin.js';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import SpinnerPlugin from 'phaser3-rex-plugins/templates/spinner/spinner-plugin.js';
import GrayScalePostFx from 'phaser3-rex-plugins/plugins/grayscalepipeline.js';
import OutlinePostFx from 'phaser3-rex-plugins/plugins/outlinepipeline.js';
import FlashPlugin from 'phaser3-rex-plugins/plugins/flash-plugin.js';

export default {
	width: 360,
	height: 640,
	title: "Phaser dengan ParcelJS guys",
	url: "yesbesoklibur.com",
	backgroundColor: 0xffffff,
	render: {
		//pixelArt: true,
		roundPixels: true
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: 'arcade',
		arcade: {
			//gravity: { y: 100 },
			debug: true
			}
	},
	/*pipeline: [GrayScalePostFx, OutlinePostFx],
	plugins: {
		scene: [
		{
			key: 'rexSpinner',
			plugin: SpinnerPlugin,
			mapping: 'rexSpinner'
		}
		],
		global: [
		{
			key: 'rexBBCodeTextPlugin',
			plugin: BBCodeTextPlugin,
			start: true
		},
		{
			key: 'rexDrag',
			plugin: DragPlugin,
			start: true
		},
		{
			key: 'rexVirtualJoystick',
			plugin: VirtualJoystickPlugin,
			start: true
		},
		{
			key: 'rexFlash',
			plugin: FlashPlugin,
			start: true
		}
			]
	}, */
	scene: [Rect]
};