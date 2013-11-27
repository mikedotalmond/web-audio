package ;

import js.Browser;
import js.html.audio.AudioContext;

import synth.MonoSynth;
import synth.Oscillator;
import utils.KeyboardInput;




/**
 * ...
 * http://www.w3.org/TR/webaudio/
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class Main {
	
	static var instance	:Main;
	static var context	:AudioContext;
	
	var keyboardInput	:KeyboardInput;
	var monoSynth		:MonoSynth;
	
	function new() {
		
		initMonoSynth();
		
		keyboardInput = new KeyboardInput();
		keyboardInput.noteOff.add(monoSynth.noteOff);
		keyboardInput.noteOn.add(function(freq, velocity) {
			monoSynth.noteOn(context.currentTime, freq, velocity);
		});
	}
	
	
	/**
	 * set up a little monosynth with keyboard input
	 */
	function initMonoSynth() {
		
		monoSynth = new MonoSynth(context.destination);
		//mono.oscillatorType = Oscillator.TRIANGLE;
		//mono.oscillatorType = Oscillator.SAWTOOTH;
		monoSynth.oscillatorType = Oscillator.SQUARE;
		monoSynth.setOutputGain(.4);
		
		//mono.osc_portamentoTime = .1;
		monoSynth.adsr_attackTime = .01;
		//monoSynth.adsr_decayTime = 1;
		monoSynth.adsr_sustain = 0.5;
		monoSynth.adsr_releaseTime = .2;
	}
	
	
	

	/**
	 * entry point...
	 */
	static function main() {
		
		createContext();
		
		if (context == null) {
			Browser.window.alert("Web Audio API not supported - try a different/better browser");
		} else {
			instance = new Main();
		}
	}
	
	static function createContext() {
		
		// fix for webkit prefix
		untyped __js__('window.AudioContext = window.AudioContext||window.webkitAudioContext');
		
		var c;
		try {
			c = new AudioContext();
		} catch (err:Dynamic) {
			trace("Error creating an AudioContext", err);
			c = null;
		}
		
		context = c;
	}
}