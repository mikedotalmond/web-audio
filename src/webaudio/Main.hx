package webaudio;

import flambe.animation.Ease;
import flambe.asset.AssetPack;
import flambe.asset.Manifest;
import flambe.camera.behaviours.MouseControlBehaviour;
import flambe.camera.behaviours.ZoomLimitBehaviour;
import flambe.camera.Camera;
import flambe.camera.view.CameraBackgroundFill;
import flambe.display.FillSprite;
import flambe.display.Sprite;
import flambe.display.SpriteSheet.StarlingSpriteSheet;
import flambe.display.SubTexture;
import flambe.Entity;
import flambe.input.KeyboardEvent;
import flambe.platform.html.WebAudioSound;
import flambe.platform.KeyCodes;
import flambe.System;
import flambe.util.Promise;
import haxe.ds.Vector;
import haxe.Timer;
import webaudio.synth.generator.Oscillator.OscillatorType;

import js.Browser;

import js.html.Blob;
import js.html.audio.AudioContext;

import webaudio.synth.MonoSynth;
import webaudio.synth.processor.Crusher;
import webaudio.synth.ui.Fonts;
import webaudio.synth.ui.MonoSynthUI;
import webaudio.utils.AudioNodeRecorder;
import webaudio.utils.KeyboardInput;
import webaudio.utils.KeyboardNotes;





/**
 * ...
 * http://www.w3.org/TR/webaudio/
 *
 * @author Mike Almond - https://github.com/mikedotalmond
 */
@:final class Main {
	
	public var keyboardInputs(default,null)	:KeyboardInput;
	public var keyboardNotes(default, null)	:KeyboardNotes;
	
	public var textureAtlas	(default, null)	:Map<String,SubTexture>;
	
	
	var monoSynth		:MonoSynth 		= null;
	var crusher			:Crusher 		= null;
	var monoSynthUI		:MonoSynthUI 	= null;
	
	var activeKeys:Vector<Bool>;
	var stageWidth:Int;
	var stageHeight:Int;
	var recorder:AudioNodeRecorder;
		
	function new() {
		trace('MonoSynth');
		keyboardNotes 	= new KeyboardNotes(2); // util
		keyboardInputs 	= new KeyboardInput(keyboardNotes);
	}	
	
	
    function assetsReady (pack:AssetPack) {
		
		Fonts.setup(pack);
		
		var xml			= Xml.parse(pack.getFile('sprites.xml').toString());
		var texture 	= pack.getTexture('sprites');
		textureAtlas 	= StarlingSpriteSheet.parse(xml, texture);
		
		stageWidth 		= System.stage.width;
		stageHeight 	= System.stage.height;
		
		var scene:Entity;
		var ui	:Entity;
		var uiContainer:Sprite;
		var sceneContainer:Sprite;
		var camera:Camera;
		var mouseControlBehaviour:MouseControlBehaviour;
		var zoomLimitBehaviour:ZoomLimitBehaviour;
		var sceneBackgroundLayer:Entity;
		var sceneContentLayer:Entity;
		var sceneUILayer:Entity;
		
		System.root.addChild(scene = new Entity()); // scene, with camera
		System.root.addChild(ui = new Entity()); // non-game, no camera, on top of everything (HUD)
		
		ui.add(uiContainer = new Sprite());
		
		stageWidth  = System.stage.width;
		stageHeight = System.stage.height;
		
		// world display
		sceneContainer 	= new Sprite();
		camera 			= new Camera();
		
		scene
			// root container + camera
			.add(sceneContainer).add(camera)			
			// in-camera 	bg/scenery
			.addChild(sceneBackgroundLayer = new Entity())			
			// in-camera	nape-world for physics-y things
			.addChild(sceneContentLayer = new Entity())			
			//  in-camera	fg/ui
			.addChild(sceneUILayer = new Entity());			
		
		//setupCamera
		mouseControlBehaviour = new MouseControlBehaviour(camera);
		camera.behaviours.push(mouseControlBehaviour);
		mouseControlBehaviour.enabled = true;
		
		zoomLimitBehaviour = new ZoomLimitBehaviour(camera, .25, 1);
		camera.behaviours.push(zoomLimitBehaviour);
		zoomLimitBehaviour.enabled = true;
		
		camera.controller.zoom._ = 1;
		
		scene.addChild(new Entity().add(new CameraBackgroundFill(0x666666, camera)), false);
		
		System.stage.resize.connect(onResize); 	
		
		
		// setup synth ui
		monoSynthUI	= new MonoSynthUI(textureAtlas, keyboardNotes);
		scene.addChild(new Entity().add(monoSynthUI));	
		initInputs();
		initAudio();
		
		
		monoSynthUI.outputLevelParameter.addObserver(monoSynth);
		
		/*
		recorder = new AudioNodeRecorder(monoSynth.output);
		recorder.wavEncoded.connect(onWavEncoded);
		recorder.start();
		Timer.delay(function() {
			recorder.stop();
			recorder.encodeWAV();
		}, 5000);
		*/
	}
	
	function onWavEncoded(b:Blob) {
		AudioNodeRecorder.forceDownload(b);
		recorder.clear();
	}
	
	
	function initInputs() {
		
		if (System.keyboard.supported) {
			
			activeKeys = new Vector<Bool>(256);
			for (i in 0...activeKeys.length) activeKeys[i] = false;
			
			System.keyboard.up.connect(function(e:KeyboardEvent) {
				var code = KeyCodes.toKeyCode(e.key);
				activeKeys[code] = false;
				keyboardInputs.onQwertyKeyUp(code);
			});
			
			System.keyboard.down.connect(function(e:KeyboardEvent) {
				var code = KeyCodes.toKeyCode(e.key);
				activeKeys[code] = true;
				
				// don't trigger keyboard ui-keys if ctrl||alt are down
				if (!(keyIsDown(KeyCodes.CONTROL) || keyIsDown(KeyCodes.ALT))) {
					keyboardInputs.onQwertyKeyDown(code);
				}
			});
		}
		
		if (System.touch.supported && System.touch.maxPoints > 1) {
			// multitouch
			// System.touch.points
		}
		
		initKeyboardInputs();
		
	}
	
	
	inline function initKeyboardInputs() {
		
		var handleNoteOn = function(i) {
			var f = keyboardNotes.noteFreq.noteIndexToFrequency(i);
			monoSynth.noteOn(audioContext.currentTime, f, .8, !monoSynth.noteIsOn);
			monoSynthUI.keyboard.setNoteState(i, true);
		};
		
		var handleNoteOff = function(i) {
			
			monoSynthUI.keyboard.setNoteState(i, false);
			
			// retrigger note on if any keys/notes are held
			if (keyboardInputs.noteCount > 0) handleNoteOn(keyboardInputs.lastNote);
			else monoSynth.noteOff(audioContext.currentTime);
		};
		
		keyboardInputs.noteOn.connect(handleNoteOn);
		keyboardInputs.noteOff.connect(handleNoteOff);
	}
	

	function initAudio() {
		
		//crusher 		= new Crusher(audioContext, null, WebAudioSound.gain);
		//crusher.bits	= 8;
		
		//var destination = crusher.node; //audioContext.destination
		var destination = audioContext.destination;
		
		// set up monosynth test
		monoSynth = new MonoSynth(destination, keyboardNotes.noteFreq);
		monoSynth.osc0.type = OscillatorType.SQUARE; // TRIANGLE; SQUARE
		monoSynth.osc1.type = OscillatorType.SAWTOOTH; // TRIANGLE; SQUARE
		monoSynth.phase = .123;
		monoSynth.osc0_portamentoTime = .15; //1.0
		monoSynth.osc1_portamentoTime = .15; //1.0
		
		monoSynth.osc0_detuneCents = 0;
		
		monoSynth.adsr_attackTime = .025;
		monoSynth.adsr_decayTime = .1;
		monoSynth.adsr_sustain = 0.8;
		monoSynth.adsr_releaseTime = .08;
		
		monoSynth.filterFrequency = .54;
		monoSynth.filterEnvAttack = .15;
		monoSynth.filterEnvRelease = .2;
		monoSynth.filterQ = 1;
		
		monoSynth.delay.delayTime.value = .45;
		monoSynth.delayLevel.gain.value = .8;
		monoSynth.delayFeedback.gain.value = .17;
	}
	
	
	inline function keyIsDown(code:Int):Bool return activeKeys[code];
	
	
	function onResize() {
		stageWidth  = System.stage.width;
		stageHeight = System.stage.height;
	}
	
	
	/* Entry point */
    static function main () {
		
        System.init();
		
		var noAudio = Browser.document.getElementById("noWebAudio");
		
		if (WebAudioSound.supported) {
			
			noAudio.parentNode.removeChild(noAudio);
			audioContext = cast WebAudioSound.ctx;
			
			instance = new Main();
			
			PreloadMain.init('bootstrap', instance.assetsReady, 0x5A6978);
			
		} else {
			noAudio.className = ""; // show it
			throw('Could not create AudioContext. Sorry, but it looks like your browser does not support the Web-Audio APIs ;(');
		}		
    }
	
	
	static public var instance(default, null)	:Main;
	static public var audioContext(default,null):AudioContext;	
}



/**
 * Loadbar / Helper
 */
@:final class PreloadMain {	
	
	public static function init(packName:String, complete:AssetPack->Void, loadBarColour:Int=0) {
		
		var bar:FillSprite = new FillSprite(loadBarColour, 1, System.stage.height);
		System.root.add(bar);
		
		var loader:Promise<AssetPack> = System.loadAssetPack(Manifest.fromAssets(packName));
		
		loader.progressChanged.connect(function() {
			var v = loader.progress / loader.total;
			bar.width.animateTo(v * System.stage.width, .25, Ease.quadOut);
			bar.height._ = System.stage.height;
		});
		
		loader.success.connect(function(ass) {
			trace('success!');
			bar.width.animateTo(System.stage.width, .25, Ease.quadOut);
			Timer.delay(function() {
				complete(ass);
				bar.dispose();
			}, 250);
		}).once();
		
		loader.error.connect(function(err) {
			bar.color = 0xff0000;
			complete(null);
			throw err;
		});
	}
}