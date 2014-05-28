package webaudio;

import flambe.animation.Ease;
import flambe.asset.AssetPack;
import flambe.asset.Manifest;
import flambe.camera.behaviours.LimitBoundsBehaviour;
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
import flambe.math.Rectangle;
import flambe.platform.html.WebAudioSound;
import flambe.platform.KeyCodes;
import flambe.System;
import haxe.ds.Vector.Vector;
import js.Browser;
import js.html.audio.AudioContext;
import webaudio.synth.MonoSynth;
import webaudio.synth.Oscillator;
import webaudio.synth.processor.Crusher;
import webaudio.synth.ui.Fonts;
import webaudio.synth.ui.MonoSynthUI;
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
	
	
	function new() {
		trace('MonoSynth');
		keyboardNotes 	= new KeyboardNotes(); // util
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
		var ui:Entity;
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
		monoSynth = new MonoSynth(destination);
		monoSynth.oscillator0Type = OscillatorType.SAWTOOTH; // TRIANGLE; SQUARE
		monoSynth.oscillator1Type = OscillatorType.SQUARE; // TRIANGLE; SQUARE
		
		monoSynth.osc0_portamentoTime = .15; //1.0
		monoSynth.osc1_portamentoTime = .15; //1.0
		
		monoSynth.adsr_attackTime = .05;
		monoSynth.adsr_decayTime = 1;
		monoSynth.adsr_sustain = 0.5;
		monoSynth.adsr_releaseTime = .2;
		
		//monoSynth.filter_frequency=
		//monoSynth.filter_q
	}
	
	
	inline function keyIsDown(code:Int):Bool return activeKeys[code];
	
	
	function onResize() {
		stageWidth  = System.stage.width;
		stageHeight = System.stage.height;
	}
	
	

	
	/**
	 * Entry point...
	 */
	static function main() {
		
		System.init();
		
		var noAudio = Browser.document.getElementById("noWebAudio");
		
		if (WebAudioSound.supported) {
			
			noAudio.parentNode.removeChild(noAudio);
			
			audioContext 	= cast WebAudioSound.ctx;
			instance 		= new Main();
			
			System.loadAssetPack(Manifest.fromAssets('bootstrap')).get(instance.assetsReady);
			
			
		} else {
			noAudio.className = ""; // show it
			throw('Could not create AudioContext. Sorry, but it looks like your browser does not support the Web-Audio APIs ;(');
		}
	}
	
	public static var instance(default,null):Main;
	public static var audioContext(default,null):AudioContext;
}