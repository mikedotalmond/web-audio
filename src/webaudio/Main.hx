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
import flambe.input.Key;
import flambe.input.KeyboardEvent;
import flambe.platform.html.WebAudioSound;
import flambe.platform.KeyCodes;

import flambe.System;
import flambe.util.Promise;

import haxe.ds.Vector;
import haxe.Timer;

import js.Browser;
import js.html.audio.AudioContext;
import js.html.Blob;

import webaudio.synth.generator.Oscillator.OscillatorType;
import webaudio.synth.MonoSynth;
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
	
	public var textureAtlas	(default, null)	:Map<String,SubTexture>;
	
	var stageWidth			:Int;
	var stageHeight			:Int;
	
	var scene				:Entity;
	var sceneUILayer		:Entity;
	var sceneContentLayer	:Entity;
	var sceneBackgroundLayer:Entity;
	var sceneContainer		:Sprite;
	
	var ui					:Entity;
	var uiContainer			:Sprite;
	
	var camera				:Camera;
	var cameraMouseControl	:MouseControlBehaviour;
	var cameraZoomLimit		:ZoomLimitBehaviour;
	
	// -----------------------------------------------
	
	
	public var keyboardInputs(default,null)	:KeyboardInput; // VirtualMIDIKeyboard
	public var keyboardNotes(default, null)	:KeyboardNotes;
	
	var activeKeys			:Vector<Bool>;
	
	var monoSynth			:MonoSynth;
	var monoSynthUI			:MonoSynthUI;
	var recorder			:AudioNodeRecorder;
	
	
	function new() {
		trace('MonoSynth');
		keyboardNotes 	= new KeyboardNotes(1); // util
		keyboardInputs 	= new KeyboardInput(keyboardNotes);
	}	
	
	
	function onWavEncoded(b:Blob) {
		AudioNodeRecorder.forceDownload(b);
		recorder.clear();
	}
	
	
    function assetsReady (pack:AssetPack) {
		
		Fonts.setup(pack);
		
		stageWidth 		= System.stage.width;
		stageHeight 	= System.stage.height;
		
		// core flambe setup (scene, camera, ui, ...)
		setupFlambe(pack);
		
		// setup synth ui
		monoSynthUI	= new MonoSynthUI(textureAtlas, keyboardNotes);
		scene.addChild(new Entity().add(monoSynthUI));	
		
		initAudio();
		
		initControl();
		
		//
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
	
	
	function setupFlambe(pack:AssetPack) {
		var xml			= Xml.parse(pack.getFile('sprites.xml').toString());
		var texture 	= pack.getTexture('sprites');
		textureAtlas 	= StarlingSpriteSheet.parse(xml, texture);
		
		
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
		cameraMouseControl = new MouseControlBehaviour(camera);
		camera.behaviours.push(cameraMouseControl);
		cameraMouseControl.enabled = true;
		
		cameraZoomLimit = new ZoomLimitBehaviour(camera, .25, 1);
		camera.behaviours.push(cameraZoomLimit);
		cameraZoomLimit.enabled = true;
		
		camera.controller.zoom._ = 1;
		
		scene.addChild(new Entity().add(new CameraBackgroundFill(0x666666, camera)), false);
		
		System.stage.resize.connect(onResize);
	}
	
	
	
	function initAudio() {
		
		var destination = audioContext.destination;
		
		// set up monosynth test
		monoSynth = new MonoSynth(destination, keyboardNotes.noteFreq);
		monoSynth.osc0.type = OscillatorType.SQUARE; // TRIANGLE; SQUARE
		monoSynth.osc1.type = OscillatorType.SQUARE; // TRIANGLE; SQUARE
		monoSynth.phase = .333;
		
		monoSynth.pitchBendRange = 700;
		
		monoSynth.osc0_portamentoTime = .15; //1.0
		monoSynth.osc1_portamentoTime = .15; //1.0
		
		monoSynth.osc0_detuneCents = 0;
		monoSynth.osc1_detuneCents = 0;
		
		monoSynth.osc0_randomCents = 30;
		monoSynth.osc1_randomCents = 30;
		
		monoSynth.osc0Pan.pan = -.01;
		monoSynth.osc1Pan.pan = .01;
		
		// Env		
		monoSynth.adsr.attack = .025;
		monoSynth.adsr.decay = .1;
		monoSynth.adsr.sustain = 0.8;
		monoSynth.adsr.release = .08;
		
		// Filter
		monoSynth.filter.q = 1;
		monoSynth.filter.frequency = .54;
		monoSynth.filter.envAttack = .15;
		monoSynth.filter.envRelease = .2;
		
		// Distortion
		monoSynth.distortionGroup.pregain.gain.value 	= 1;
		monoSynth.distortionGroup.waveshaper.amount 	= .25;
		monoSynth.distortionGroup.crusher.bits 			= 12;
		monoSynth.distortionGroup.crusher.rateReduction = 1;
		
		// Delay
		monoSynth.delay.time.value = .25;
		monoSynth.delay.level.value = .66;
		monoSynth.delay.feedback.value = .44;
		monoSynth.delay.lpfFrequency.value = 6000;
	}
	
	
	
	function initControl() {
		
		initKeyboardInputs();
		
		// monoSynth observes changes on ui parameters...
		
		monoSynthUI.outputLevel.value.addObserver(monoSynth);
		
		monoSynthUI.pitchBend.returnToDefault = true;
		monoSynthUI.pitchBend.value.addObserver(monoSynth);
		monoSynthUI.pitchBend.labelFormatter = function(val) {
			return monoSynthUI.pitchBend.defaultLabelFormatter((val * monoSynth.pitchBendRange) / 100);
		};
		
		
		var osc = monoSynthUI.oscillators;
		osc.osc0Level.value.addObserver(monoSynth);
		osc.osc0Pan.value.addObserver(monoSynth);
		osc.osc0Slide.value.addObserver(monoSynth);
		osc.osc0Random.value.addObserver(monoSynth);
		osc.osc0Detune.value.addObserver(monoSynth);
		//
		osc.osc1Level.value.addObserver(monoSynth);
		osc.osc1Pan.value.addObserver(monoSynth);
		osc.osc1Slide.value.addObserver(monoSynth);
		osc.osc1Random.value.addObserver(monoSynth);
		osc.osc1Detune.value.addObserver(monoSynth);
		//
		osc.oscPhase.value.addObserver(monoSynth);
		
		var adsr = monoSynthUI.adsr;
		adsr.attack.value.addObserver(monoSynth);
		adsr.decay.value.addObserver(monoSynth);
		adsr.sustain.value.addObserver(monoSynth);
		adsr.release.value.addObserver(monoSynth);
		
	}
	
	
	
	function onKeyDown(e:KeyboardEvent) {
		
		var code = KeyCodes.toKeyCode(e.key);
		activeKeys[code] = true;
		
		switch(e.key) {
			
			case Key.Escape	 		: System.stage.requestFullscreen(false);
			case Key.F, Key.F11		: System.stage.requestFullscreen();
			
			case Key.NumpadAdd		: camera.controller.zoom.animateBy(.2, .25, Ease.quadOut);
			case Key.NumpadSubtract	: camera.controller.zoom.animateBy(-.2, .25, Ease.quadOut);
			
			default:
				// trace(e.key);
				// don't trigger keyboard ui-keys if ctrl||alt are down
				if (!(keyIsDown(KeyCodes.CONTROL) || keyIsDown(KeyCodes.ALT))) {
					keyboardInputs.onQwertyKeyDown(code);
				}
		}
	}
	
	
	function onKeyUp(e:KeyboardEvent) {
		var code = KeyCodes.toKeyCode(e.key);
		activeKeys[code] = false;
		keyboardInputs.onQwertyKeyUp(code);
	}
	
	
	// setup (chromatic) keyboard controller	
	function initKeyboardInputs() {
		
		if (System.keyboard.supported) {
			activeKeys = new Vector<Bool>(256);
			for (i in 0...activeKeys.length) activeKeys[i] = false;
			
			System.keyboard.up.connect(onKeyUp);			
			System.keyboard.down.connect(onKeyDown);
		}
		
		// Mouse / Touch keyboard-controls
		monoSynthUI.keyboard.keyDown.connect(keyboardInputs.onNoteKeyDown);
		monoSynthUI.keyboard.keyUp.connect(keyboardInputs.onNoteKeyUp);
		
		
		// note on/off handlers		
		var handleNoteOn = function(noteIndex:Int) {
			var f = keyboardNotes.noteFreq.noteIndexToFrequency(noteIndex);
			monoSynth.noteOn(audioContext.currentTime, f, .8, !monoSynth.noteIsOn);
			monoSynthUI.keyboard.setNoteState(noteIndex, true);
		}
		
		var handleNoteOff = function(noteIndex:Int) {		
			monoSynthUI.keyboard.setNoteState(noteIndex, false);		
			// retrigger note-on if any keys/notes are held
			if (keyboardInputs.noteCount > 0) handleNoteOn(keyboardInputs.lastNote);
			else monoSynth.noteOff(audioContext.currentTime);
		}
		
		keyboardInputs.noteOn.connect(handleNoteOn);
		keyboardInputs.noteOff.connect(handleNoteOff);
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
		
			//#if debug addConsoleViewer();#end
			
			noAudio.parentNode.removeChild(noAudio);
			audioContext = cast WebAudioSound.ctx;
			
			instance = new Main();
			
			PreloadMain.init('bootstrap', instance.assetsReady, 0x5A6978);
			
		} else {
			noAudio.className = ""; // show it
			throw('Could not create AudioContext. Sorry, but it looks like your browser does not support the Web-Audio APIs ;(');
		}		
    }
	
	
	static function addConsoleViewer() {
		var d = Browser.window.document;
		var head = d.getElementsByTagName('head')[0];
		var script = d.createScriptElement();
		script.src = 'js/console-log-viewer.js?console_at_bottom=true';
		head.appendChild(script);
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