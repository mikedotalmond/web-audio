package webaudio;

import audio.parameter.mapping.MapFactory;
import audio.parameter.mapping.Mapping;
import flambe.asset.AssetPack;
import flambe.asset.Manifest;
import flambe.display.FillSprite;
import flambe.display.Sprite;
import flambe.display.SubImageSprite;
import flambe.Entity;
import flambe.math.FMath;
import flambe.System;
import flambe.platform.html.WebAudioSound;
import math.Complex;
import webaudio.synth.ui.controls.Rotary;

import js.Browser;
import js.html.audio.AudioContext;

import webaudio.synth.MonoSynth;
import webaudio.synth.Oscillator;
import webaudio.synth.processor.Crusher;
import webaudio.synth.ui.MonoSynthUI;
import webaudio.utils.KeyboardInput;
import webaudio.utils.KeyboardNotes;

import audio.parameter.Parameter;
import audio.parameter.ParameterObserver;

import audio.time.Clock;
import audio.time.TimeSignature;
import audio.time.Timecode.TimecodeData;


/**
 * ...
 * http://www.w3.org/TR/webaudio/
 *
 * @author Mike Almond - https://github.com/mikedotalmond
 */
@:final class Main implements ParameterObserver {
	
	public var keyboardInput(default,null):KeyboardInput;
	public var keyboardNotes(default,null):KeyboardNotes;
	
	var monoSynth		:MonoSynth;
	
	var crusher			:Crusher;
	
	var monoSynthUI		:MonoSynthUI;
	
	function new() {
		
		trace('MonoSynth');
		
		keyboardNotes 	= new KeyboardNotes(); // util
		keyboardInput 	= new KeyboardInput(keyboardNotes);
		//monoSynthUI		= new MonoSynthUI(keyboardNotes);
		
		initAudio();
		initKeyboardInputs();
		
		//testClock();
		//testComplex();
		testParameterMapping();
	}
	
	function testParameterMapping() {
		
		var mapb = MapFactory.getMapping(MapType.BOOL);
		var mapi = MapFactory.getMapping(MapType.INT);
		var mapf = MapFactory.getMapping(MapType.FLOAT,0,6);
		var mapfe = MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL,0,6);
		
		trace(mapb.map(1)==1); //true
		trace(mapb.map(0)==1); //false
		trace(mapb.map(.5)==1); //false
		trace(mapb.map(.51)==1); //true
		trace(mapb.map(.499)==1); //false
		
		trace(mapi.map(.5)); //1
		trace(mapi.map(5.5)); //6
		
		trace(mapf.map(.5));//3
		trace(mapf.map(5.5));//33
		
		trace(mapfe.map(.5));//1.6457513110645903
		trace(mapfe.map(1)); //6
		trace(mapfe.map(1) == 6); //true
		trace(mapfe.mapInverse(6) == 1);//true
		
		var testParameter = new Parameter("test parameter", .5, MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL,-1,1));
		var testParameter2 = new Parameter("test parameter 2", 0, MapFactory.getMapping(MapType.FLOAT,-1,1));
		//monoSynthUI.ready.connect(uiReady).once();
		
		testParameter.addObserver(this);
		//testParameter.addObserver(monoSynth);
		testParameter2.addObserver(this, true);
		//testParameter2.addObserver(monoSynth, true);
		
		testParameter.setValue(.25);//change
		testParameter.setValue(-.5); //change
		testParameter.setValue(-.5); //no-change
		testParameter.setValue(-.5, true);//change
	}
	
	public function onParameterChange(parameter:Parameter) {
		trace('[Main] onParameterChange');
		trace('${parameter.name} - value:${parameter.getValue()}, normalised:${parameter.getValue(true)}');
	}
	
	
	
	/* Test the operators */
	function testComplex() {
		
		var test	:Complex = new Complex(.5, .25);
		var test2	:Complex = new Complex(1, -.5);
		
		trace(test2.phase);
		trace(test2.magnitude);
		trace(test2.squaredMagnitude);
		trace(test2);
		
		var test3 = test - test2;
		var test4 = test / test2;
		var test5 = test * test2;
		
		trace(test5);
		var test6 = test / Complex.zero();
	}
	
	
	function testClock() {
		var clock = new Clock();
		System.root.addChild(
			new Entity()
			.add(clock)
			//.add(new Clock(133, new TimeSignature(3, 4)))
			//.add(new Clock(133, new TimeSignature(16, 8)))
		);
		
		clock.timecode.beatChange.connect(function(t:TimecodeData) {
			trace('${clock.timecode}');
		});
		
		//clock.tick.connect(function(t:TimecodeData) {
			//trace(t);
		//});
		
		//clock.timeSignature.set(3,4);
		//clock.timeSignature.set(4,4);
		//clock.timeSignature.set(5,4);
		//clock.timeSignature.set(16,8);
		//clock.bpm = 134.5;
		//clock.goto(61.897);
		//clock.start();
		//clock.start(5.15);
	}
	
	
    function assetsReady (pack:AssetPack) {
		
        // Add a solid color background
        var background = new FillSprite(0x202020, System.stage.width, System.stage.height);
        System.root.add(background);
		
		
		var xml			= Xml.parse(pack.getFile('sprites.xml').toString());
		var texture 	= pack.getTexture('sprites');
		var textureAtlas= StarlingSpriteSheet.parse(xml, texture);
		
		//var test 		= SubImageSprite.fromSubTextureData(textureAtlas.get('panel-bg_50%'));
		//var test2 		= SubImageSprite.fromSubTextureData(textureAtlas.get('whiteKey'));
		//var test2 		= SubImageSprite.fromSubTextureData(textureAtlas.get('blackKey'));
	
		var panel;
		var knobington;
		var nipppler;
		
		System.root.addChild(
			(panel = new Entity()
				.add(SubImageSprite.fromSubTextureData(textureAtlas.get('panel-bg_50%')))
			)
			.addChild(
				(knobington = new Entity()
					.add(SubImageSprite.fromSubTextureData(textureAtlas.get('knob_50%')))
					.addChild(
						nipppler = new Entity().add(SubImageSprite.fromSubTextureData(textureAtlas.get('knob-nipple_50%')))
					)
					.add(new Rotary(-FMath.PI/1.25, FMath.PI/1.25, 12))
				)
			)
		);
		
		
		knobington.get(Sprite).x._ = 64;
		knobington.get(Sprite).y._ = 40;
		
		/*
		var font = new Font(pack, "font/prime32");
		var myTextField:TextSprite = new TextSprite(font, "Hello world!");
		System.root.addChild(new Entity().add(myTextField));
		// change the text using .text property:
		myTextField.text = "Flambe";
		*/
	}
	
	function uiReady() {
		for (module in monoSynthUI.modules) {
			module.sliderChange.connect(onModuleSliderChange);
		}
	}
	
	
	function onModuleSliderChange(id:String, value:Float) {
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
	}
	
	static inline function remapExpo(value) {
		return (Math.exp(value) - 1) / 2.718281828459045 / 0.6321205588285577;
	}
	
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