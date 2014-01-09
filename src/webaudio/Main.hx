package webaudio;

import audio.parameter.mapping.MapFactory;
import audio.parameter.mapping.Mapping;
import flambe.asset.AssetPack;
import flambe.asset.Manifest;
import flambe.Component;
import flambe.display.FillSprite;
import flambe.display.Font;
import flambe.display.Sprite;
import flambe.display.SubImageSprite;
import flambe.display.TextSprite;
import flambe.Entity;
import flambe.math.FMath;
import flambe.System;
import flambe.platform.html.WebAudioSound;
import math.Complex;
import webaudio.synth.ui.controls.Rotary;
import webaudio.synth.ui.Fonts;

import js.Browser;
import js.html.audio.AudioContext;

import webaudio.synth.MonoSynth;
import webaudio.synth.Oscillator;
import webaudio.synth.processor.Crusher;
import webaudio.synth.ui.MonoSynthUI;
import webaudio.utils.KeyboardInput;
import webaudio.utils.KeyboardNotes;

import audio.parameter.Parameter;


/**
 * ...
 * http://www.w3.org/TR/webaudio/
 *
 * @author Mike Almond - https://github.com/mikedotalmond
 */
@:final class Main {
	
	public var keyboardInput(default,null)	:KeyboardInput;
	public var keyboardNotes(default, null)	:KeyboardNotes;
	
	public var textureAtlas	(default, null)	:Map<String,SubTextureData>;
	
	
	var monoSynth		:MonoSynth;
	
	var crusher			:Crusher;
	
	var monoSynthUI		:MonoSynthUI;
	
	
	function new() {
		
		trace('MonoSynth');
		
		keyboardNotes 	= new KeyboardNotes(); // util
		keyboardInput 	= new KeyboardInput(keyboardNotes);
		
		initAudio();
		initKeyboardInputs();
	}
	
	
    function assetsReady (pack:AssetPack) {
		
		// initialise font/text stuff
		Fonts.setup(pack);
		
		// setup textures
		var xml			= Xml.parse(pack.getFile('sprites.xml').toString());
		var texture 	= pack.getTexture('sprites');
		textureAtlas 	= StarlingSpriteSheet.parse(xml, texture);
		
		monoSynthUI	= new MonoSynthUI(textureAtlas, keyboardNotes);
		monoSynthUI.ready.connect(uiReady).once();
		System.root.add(monoSynthUI);
	}
	
	
	function uiReady() {
		/*for (module in monoSynthUI.modules) {
			module.sliderChange.connect(onModuleSliderChange);
		}*/
	}
	
	
	/*function onModuleSliderChange(id:String, value:Float) {
		trace('${id}: ${value}');
		var now = audioContext.currentTime;
		var m = monoSynth;
		
		if (id.indexOf('osc-') == 0) {
			switch(id) {
				case 'osc-shape': m.oscillatorType = Std.int(value);
				case 'osc-slide': m.osc_portamentoTime = value;
			}
		} else if (id.indexOf('filter-') == 0) {
			switch(id) {
				case 'filter-type': cast(m.biquad).type = Std.int(value);
				case 'filter-freq': m.filterFrequency = remapExpo(value);
				case 'filter-res': m.filterQ = value;
				case 'filter-gain': m.filterGain = remapExpo(value);
				case 'filter-env-range': m.filterEnvRange = remapExpo(value);
				case 'filter-env-attack': m.filterEnvAttack = value;
				case 'filter-env-release': m.filterEnvRelease = value;
			}
		} else if (id.indexOf('adsr-') == 0) {
			switch(id) {
				case 'adsr-attack': m.adsr_attackTime = value;
				case 'adsr-decay': m.adsr_decayTime = value;
				case 'adsr-sustain': m.adsr_sustain = value;
				case 'adsr-release': m.adsr_releaseTime = value;
			}
		} else if (id.indexOf('out-') == 0) {
			switch(id) {
				case 'out-gain': m.setOutputGain(remapExpo(value));
			}
		}
	}*/
	
	function initAudio() {
		
		crusher 		= new Crusher(audioContext, null, WebAudioSound.gain);
		crusher.bits	= 4;
		
		initMonoSynth(crusher.node);
		//initMonoSynth(audioContext.destination);
	}
	
	function initKeyboardInputs() {
		
		// Monophonic key / note control setup
		var handleNoteOff = function() {
			monoSynth.noteOff(audioContext.currentTime);
		}
		
		var handleNoteOn = function(i) {
			var f = keyboardNotes.noteFreq.noteIndexToFrequency(i);
			monoSynth.noteOn(audioContext.currentTime, f, .8, !monoSynth.noteIsOn);
		};
		
		keyboardInput.noteOn.connect(handleNoteOn);
		keyboardInput.noteOff.connect(handleNoteOff);
		
		
		/*// bind to ui keyboard signals
		monoSynthUI.keyboard.keyDown.connect(handleNoteOn);
		monoSynthUI.keyboard.keyUp.connect(function(i) {
			if (keyboardInput.hasNotes()) { // key up on ui keyboard, check for any (HID) keyboard keys
				handleNoteOn(keyboardInput.lastNote()); // retrigger last pressed key
			} else {
				handleNoteOff(); // nothing held? note off.
			}
		});//*/
		
		/*// bind to hardware keyboard signals
		keyboardInput.noteOn.connect(handleNoteOn);
		keyboardInput.noteOff.connect(function() {
			if (monoSynthUI.keyboard.keyIsDown()) { // still got a ui key pressed?
				handleNoteOn(monoSynthUI.keyboard.heldKey);  // retrigger the held key
			} else {
				handleNoteOff(); // no keys down? note off
			}
		});
		
		// HID keyboard inputs, update ui-keys...
		keyboardInput.keyDown.connect(monoSynthUI.keyboard.setNoteState.bind(_, true));
		keyboardInput.keyUp.connect(monoSynthUI.keyboard.setNoteState.bind(_, false));
		//*/
	}
	

	/**
	 * set up a little monosynth with keyboard input
	 */
	function initMonoSynth(destination) {
		
		monoSynth = new MonoSynth(destination);
		//monoSynth.oscillatorType = Oscillator.TRIANGLE;
		monoSynth.oscillatorType = Oscillator.SAWTOOTH;
		//monoSynth.oscillatorType = Oscillator.SQUARE;
		
		monoSynth.osc_portamentoTime = .05;
		//monoSynth.osc_portamentoTime = 1;
		monoSynth.adsr_attackTime = .05;
		monoSynth.adsr_decayTime = 1;
		monoSynth.adsr_sustain = 0.5;
		monoSynth.adsr_releaseTime = .2;
		
		//monoSynth.filter_frequency=
		//monoSynth.filter_q
	}
	
	
	function dispose() {
		
		crusher = null;
		
		monoSynth.dispose();
		monoSynth = null;
		
		keyboardInput.dispose();
		keyboardInput = null;
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
			var manifest = Manifest.build('bootstrap');
			var loader = System.loadAssetPack(manifest);
			loader.get(instance.assetsReady);
			
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