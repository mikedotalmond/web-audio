package webaudio;

import flambe.asset.AssetPack;
import flambe.asset.Manifest;
import flambe.display.FillSprite;
import flambe.display.SpriteSheet.StarlingSpriteSheet;
import flambe.display.SubTexture;
import flambe.Entity;
import flambe.input.KeyboardEvent;
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
	
	
	function new() {
		
		trace('MonoSynth');
		
		keyboardNotes 	= new KeyboardNotes(); // util
		keyboardInputs 	= new KeyboardInput(keyboardNotes);
	}
	
	
    function assetsReady (pack:AssetPack) {
		
		// Add a solid background colour
        System.root.addChild(new Entity().add(new FillSprite(0x666666, System.stage.width, System.stage.height).disablePointer()));
		
		// initialise font/text stuff
		Fonts.setup(pack);
		
		// setup textures
		var xml			= Xml.parse(pack.getFile('sprites.xml').toString());
		var texture 	= pack.getTexture('sprites');
		textureAtlas 	= StarlingSpriteSheet.parse(xml, texture);
		
		monoSynthUI	= new MonoSynthUI(textureAtlas, keyboardNotes);
		monoSynthUI.ready.connect(uiReady).once();
		System.root.addChild(new Entity().add(monoSynthUI));
		
		
		//var testData 	= pack.getFile('test/sprites2.json').toString();
		//var testAtlas	= JSSpriteSheet.parse(testData, pack.getTexture('test/sprites2'));
		//var img 		= new ImageSprite(testAtlas.get("bo"));
		//System.root.addChild(new Entity().add(img));
	}
	
	
	var activeKeys:Vector<Bool>;
	inline function keyIsDown(code:Int):Bool return activeKeys[code];
	
	function uiReady() {
		
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
		initAudio();
	}
	
	function initKeyboardInputs() {
		
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
		monoSynth.oscillatorType = OscillatorType.SQUARE; // TRIANGLE; SQUARE
		
		monoSynth.osc_portamentoTime = .05; //1.0
		monoSynth.adsr_attackTime = 1.05;
		monoSynth.adsr_decayTime = 1;
		monoSynth.adsr_sustain = 0.5;
		monoSynth.adsr_releaseTime = .2;
		
		//monoSynth.filter_frequency=
		//monoSynth.filter_q
	}
	
	
	
	function dispose() {
		
		crusher = null;
		
		if (monoSynth != null) {
			monoSynth.dispose();
			monoSynth = null;
		}
		
		if (keyboardInputs != null) {
			keyboardInputs.dispose();
			keyboardInputs = null;
		}
	}
	


	
	/**
	 * Entry point...
	 */
	static function main() {
			
		System.init();
		
		if (WebAudioSound.supported) {
			
			audioContext 	= cast WebAudioSound.ctx;
			instance 		= new Main();
			
			// Load up the compiled pack in the assets directory named "bootstrap"
			var manifest = Manifest.fromAssets('bootstrap');
			var loader = System.loadAssetPack(manifest).success.connect(instance.assetsReady);
			
			Browser.window.onbeforeunload = function(e) {
				trace('unLoad');
				instance.dispose();
				instance = null;
				audioContext = null;
			};
			
		} else {
			throw('Could not create AudioContext. Sorry, but it looks like your browser does not support the Web-Audio APIs ;(');
		}
	}
	
	public static var instance(default,null):Main;
	public static var audioContext(default,null):AudioContext;
}