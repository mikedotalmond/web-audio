package ;

import js.Browser;
import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioProcessingEvent;
import js.html.KeyboardEvent;
import js.html.XMLHttpRequest;

import utils.KeyboardNotes;

import synth.Oscillator;
import synth.MonoSynth;


/**
 * ...
 * http://www.w3.org/TR/webaudio/
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class Main {
	
	static var instance	:Main;
	static var context	:AudioContext;
	
	var timerId			:Int = -1;
	var startTime		:Float;
	
	function new() {
		
		//bufferSourceTest();
		
		//scriptProcessorTest();
		
		monoSynthTest();
	}
	
	
	/**
	 * set up a little monosynth with keyboard input
	 */
	function monoSynthTest() {
		
		var keys 		= new KeyboardNotes();
		var noteFreq	= keys.keycodeToNoteFreq;
		var heldKeys	= [];
		
		var mono 		= new MonoSynth(context.destination);
		//mono.oscillatorType = Oscillator.TRIANGLE;
		//mono.oscillatorType = Oscillator.SAWTOOTH;
		mono.oscillatorType = Oscillator.SQUARE;
		
		//mono.osc_portamentoTime = .1;
		mono.adsr_attackTime = .01;
		//mono.adsr_decayTime = 1;
		mono.adsr_sustain = 1;
		mono.adsr_releaseTime = .2;
		
		Browser.document.addEventListener("keydown", function(e:KeyboardEvent) {
			var i = Lambda.indexOf(heldKeys, e.keyCode);
			if (i == -1) {
				if(noteFreq.exists(e.keyCode)){
					mono.noteOn(context.currentTime, noteFreq.get(e.keyCode), .66);
					heldKeys.push(e.keyCode);
				}
			}
		});
		
		Browser.document.addEventListener("keyup", function(e:KeyboardEvent) {
			heldKeys.splice(Lambda.indexOf(heldKeys, e.keyCode), 1)[0];
			if (heldKeys.length == 0) mono.noteOff(context.currentTime);
			else mono.noteOn(context.currentTime, noteFreq.get(heldKeys[heldKeys.length - 1]), .66);
		});
	}
	
	
	/**
	 * http://www.w3.org/TR/webaudio/#ScriptProcessorNode-section
	 */
	function scriptProcessorTest() {
		
		var node;
		
		try {
			node = context.createScriptProcessor();
		} catch (err:Dynamic) {
			node =  context.createScriptProcessor(2048);
		}
		
		node.onaudioprocess = function (e:AudioProcessingEvent) {
			var output	= e.outputBuffer.getChannelData(0);
			var n 		= output.length;
			for (i in 0...n) {
				output[i] = (Math.random() - .5);
			}
		}
		
		node.connect(context.destination);
		//trace(node.bufferSize); // chrome 2048, firefox 4096
	}
	
	
	/**
	 * Test loading an external audio resource
	 */
	function bufferSourceTest() {
		
		var url = "test.ogg";
		
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.responseType = "arraybuffer";
		
		req.onload = function(e) {
			
			trace('loaded: ${req.status}');
			
			context.decodeAudioData(req.response,
			
				function(buffer) { //success
				
					trace('decoded to buffer...');
					trace('duration:${buffer.duration}, gain:${buffer.gain}, numberOfChannels:${buffer.numberOfChannels}, sampleRate:${buffer.sampleRate}, length:${buffer.length}');
					
					var bufferSource = context.createBufferSource();
					bufferSource.buffer = buffer;
					bufferSource.connect(context.destination);
					bufferSource.start(context.currentTime + .5);
					
					return true;
				},
				
				function(buffer) { // error
					trace("error decoding to buffer");
					return false;
				}
			);
		}
		
		req.send();
	}
	
	
	
	
	/**
	 * start-up
	 */
	static function main() {
		
		createContext();
		
		if (context == null) {
			Browser.window.alert("Web Audio API not supported - try a better browser");
		} else {
			instance = new Main();
		}
	}
	
	static function createContext() {
		
		// fix for webkit prefix
		untyped __js__('window.AudioContext = window.AudioContext||window.webkitAudioContext');
		
		try {
			context = new AudioContext();
		} catch (err:Dynamic) {
			trace("Error creating an AudioContext", err);
			context = null;
		}
	}
}

