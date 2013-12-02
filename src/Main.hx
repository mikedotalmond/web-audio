package ;

import haxe.Http;
import haxe.Template;
import js.Browser;
import js.html.audio.AudioContext;
import js.html.audio.AudioProcessingEvent;
import js.html.audio.ScriptProcessorNode;
import js.html.DOMParser;
import synth.ui.KeyboardUI;
import utils.KeyboardNotes;

import synth.MonoSynth;
import synth.Oscillator;
import utils.KeyboardInput;




/**
 * ...
 * http://www.w3.org/TR/webaudio/
 *
 *
 * @author Mike Almond - https://github.com/mikedotalmond
 */
@:final class Main {
	
	static var context:AudioContext;
	
	public static var instance(default,null):Main;
	
	public var keyboardInput(default,null):KeyboardInput;
	public var keyboardNotes(default,null):KeyboardNotes;
	
	var monoSynth		:MonoSynth;
	
	var crusher			:ScriptProcessorNode;
	
	var keyboardUI		:KeyboardUI;
	
	function new() {
		
		trace('MonoSynth');
		
		keyboardNotes 	= new KeyboardNotes(); // util
		keyboardInput 	= new KeyboardInput(keyboardNotes);
		keyboardUI 		= new KeyboardUI(keyboardNotes);
		
		initAudio();
	}
	
	
	function initAudio() {
		
		try {
			crusher = context.createScriptProcessor(); //ff
		} catch (err:Dynamic) {
			crusher =  context.createScriptProcessor(2048); //chrome
		}
		crusher.onaudioprocess = crusherImpl;
		crusher.connect(context.destination);
		initMonoSynth(crusher);
		
		//initMonoSynth(context.destination);
		
		var handleNoteOff = function() {
			monoSynth.noteOff(context.currentTime);
		};
		
		var handleNoteOn = function(i) {
			var f = keyboardNotes.noteFreq.noteIndexToFrequency(i);
			monoSynth.noteOn(context.currentTime, f, .8, !monoSynth.noteIsOn);
		};
		
		
		// setup keyboardInput(HID) and keyboardUI(UI) inputs
		keyboardUI.noteOn.add(handleNoteOn);
		keyboardUI.noteOff.add(handleNoteOff);
		
		keyboardInput.noteOn.add(handleNoteOn);
		keyboardInput.noteOff.add(handleNoteOff);
		
		
		// HID keybopard inputs, update ui-keys...
		keyboardInput.keyDown.add(function(i) {
			keyboardUI.setKeyIsDown(keyboardUI.getKeyForNote(i), true);
		});
		keyboardInput.keyUp.add(function(i) {
			keyboardUI.setKeyIsDown(keyboardUI.getKeyForNote(i), false);
		});
	}
	
	
	function crusherImpl(e:AudioProcessingEvent) {
		var inL		= e.inputBuffer.getChannelData(0);
		var inR		= e.inputBuffer.getChannelData(1);
		var outL	= e.outputBuffer.getChannelData(0);
		var outR	= e.outputBuffer.getChannelData(1);
		
		var n 		= outR.length;
		var bits 	= 4.0;
		var exp 	= Math.pow(2, bits);
		var iexp 	= (1 / exp);
		
		// bit-crusher...
		for (i in 0...n) {
			outL[i] = iexp * Std.int(exp * inL[i]);
			outR[i] = iexp * Std.int(exp * inR[i]);
		}
	}
	
	/**
	 * set up a little monosynth with keyboard input
	 */
	function initMonoSynth(destination) {
		
		monoSynth = new MonoSynth(destination);
		//monoSynth.oscillatorType = Oscillator.TRIANGLE;
		monoSynth.oscillatorType = Oscillator.SAWTOOTH;
		//monoSynth.oscillatorType = Oscillator.SQUARE;
		monoSynth.setOutputGain(.66);
		
		monoSynth.osc_portamentoTime = .1;
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
	 * entry point...
	 */
	static function main() {
		
		Browser.window.onload = function(e) {
			trace('onLoad');
			
			createContext();
			
			if (context == null) {
				Browser.window.alert('Web Audio API not supported - try a different/better browser');
			} else {
				instance = new Main();
			}
		};
		
		Browser.window.onbeforeunload = function(e) {
			trace('unLoad');
			instance.dispose();
			instance = null;
			context  = null;
		};
	}
	
	static function createContext() {
		
		// fix for webkit prefix
		untyped __js__('window.AudioContext = window.AudioContext||window.webkitAudioContext');
		
		var c;
		try {
			c = new AudioContext();
		} catch (err:Dynamic) {
			trace('Error creating an AudioContext', err);
			c = null;
		}
		
		context = c;
	}
}