package ;

import haxe.Http;
import haxe.Template;
import js.Browser;
import js.html.audio.AudioContext;
import js.html.audio.AudioProcessingEvent;
import js.html.audio.ScriptProcessorNode;
import js.html.DOMParser;
import synth.processor.Crusher;
import synth.ui.MonoSynthUI;
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
	
	var crusher			:Crusher;
	
	var monoSynthUI		:MonoSynthUI;
	
	function new() {
		
		trace('MonoSynth');
		
		keyboardNotes 	= new KeyboardNotes(); // util
		keyboardInput 	= new KeyboardInput(keyboardNotes);
		monoSynthUI		= new MonoSynthUI(keyboardNotes);
		
		initAudio();
		initKeyboardInputs();
		
		monoSynthUI.ready.addOnce(uiReady);
	}
	
	
	function uiReady() {
		for (module in monoSynthUI.modules) {
			module.sliderChange.add(onModuleSliderChange);
		}
	}
	
	
	function onModuleSliderChange(id:String, value:Float) {
		trace('${id}: ${value}');
		var now = context.currentTime;
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
		crusher 		= new Crusher(context, null, context.destination); 
		crusher.bits	= 4;
		
		initMonoSynth(crusher.node);
		//initMonoSynth(context.destination);
	}
	
	function initKeyboardInputs() {
		
		// Monophonic key / note control setup
		var handleNoteOff = function() {
			monoSynth.noteOff(context.currentTime);
		}
		
		var handleNoteOn = function(i) {
			var f = keyboardNotes.noteFreq.noteIndexToFrequency(i);
			monoSynth.noteOn(context.currentTime, f, .8, !monoSynth.noteIsOn);
		};
		
		
		// bind to ui keyboard signals
		monoSynthUI.keyboard.keyDown.add(handleNoteOn);
		monoSynthUI.keyboard.keyUp.add(function(i) { 
			if (keyboardInput.hasNotes()) { // key up on ui keyboard, check for any (HID) keyboard keys
				handleNoteOn(keyboardInput.lastNote()); // retrigger last pressed key
			} else {
				handleNoteOff(); // nothing held? note off.
			}
		});
		
		// bind to hardware keyboard signals
		keyboardInput.noteOn.add(handleNoteOn);
		keyboardInput.noteOff.add(function() {
			if (monoSynthUI.keyboard.keyIsDown()) { // still got a ui key pressed?
				handleNoteOn(monoSynthUI.keyboard.heldKey);  // retrigger the held key
			} else {
				handleNoteOff(); // no keys down? note off
			}
		});
		
		// HID keyboard inputs, update ui-keys...
		keyboardInput.keyDown.add(monoSynthUI.keyboard.setNoteState.bind(_, true));
		keyboardInput.keyUp.add(monoSynthUI.keyboard.setNoteState.bind(_, false));
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