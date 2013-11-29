package ;

import haxe.Http;
import haxe.Template;
import js.Browser;
import js.html.audio.AudioContext;
import js.html.audio.AudioProcessingEvent;
import js.html.audio.ScriptProcessorNode;
import js.html.DOMParser;

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
typedef UINote = {
	var note:String;
	var octave:Int;
	var hasSharp:Bool;
}

class Main {
	
	static var instance	:Main;
	static var context	:AudioContext;
	
	var keyboardInput	:KeyboardInput;
	var monoSynth		:MonoSynth;
	
	var crusher			:ScriptProcessorNode;
	
	function new() {
		initUI();
		initAudio();
	}
	
	
	function initUI() {
		
		var keys:Array<UINote> = [
			{ note:"C", octave:2, hasSharp:true },
			{ note:"D", octave:2, hasSharp:true},
			{ note:"E", octave:2, hasSharp:false},
			{ note:"F", octave:2, hasSharp:true},
			{ note:"G", octave:2, hasSharp:true},
			{ note:"A", octave:2, hasSharp:true},
			{ note:"B", octave:2, hasSharp:false},
			{ note:"C", octave:3, hasSharp:true },
			{ note:"D", octave:3, hasSharp:true},
			{ note:"E", octave:3, hasSharp:false},
			{ note:"F", octave:3, hasSharp:true},
			{ note:"G", octave:3, hasSharp:true},
			{ note:"A", octave:3, hasSharp:true},
			{ note:"B", octave:3, hasSharp:false},
		];
		
		var http:Http = new Http('synth.tpl');
		http.async = true;
		http.onError = function(err) { trace('Error loading synth template: ${err}'); };
		http.onData = function(data:String) {
			var tpl = new Template(data);
			var markup = tpl.execute({
				modules: {
					visible:true,
					osc:{visible:true},
					portamento:{visible:true},
					adsr:{visible:true},
					filter:{visible:true},
					outGain:{visible:true},
				},
				keyboard: {
					visible:true,
					keys:keys
				}
			});
			
			Browser.document.body.appendChild(new DOMParser().parseFromString(markup, 'text/html').firstChild);			
		};
		
		http.request();
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
		
		keyboardInput = new KeyboardInput();
		keyboardInput.noteOff.add(monoSynth.noteOff);
		keyboardInput.noteOn.add(function(freq, velocity) {
			monoSynth.noteOn(context.currentTime, freq, velocity, !monoSynth.noteIsOn);
		});
		
		trace('Start');
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
		
		//monoSynth.osc_portamentoTime = .05;
		monoSynth.adsr_attackTime = .05;
		monoSynth.adsr_decayTime = 1;
		monoSynth.adsr_sustain = 0.5;
		monoSynth.adsr_releaseTime = .2;
		
		//monoSynth.filter_frequency=
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