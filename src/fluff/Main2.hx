package ;

import js.Browser;
import js.html.audio.AudioContext;



/**
 * ...
 * http://www.w3.org/TR/webaudio/
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class Main2 {
	
	static var instance	:Main;
	static var context	:AudioContext;
	
	var timerId			:Int = -1;
	var startTime		:Float;
	
	var tempo = 100.0;
	var scheduleLookAhead = .125; // seconds
	
	var nextNoteTime = 0.0;
	var currentNoteStartTime = 0.0;
	
	var current16thNote = 0;
	
	
	function new() {
		start();
	}
	
	
	function start() {
		startTime = context.currentTime;
		timerId = Browser.window.requestAnimationFrame(enterFrame);
	}
	
	
	function stop() {
		if(timerId != -1){
			Browser.window.cancelRequestAnimationFrame(timerId);
			timerId = -1;
		}
	}
	
	
	function enterFrame(t:Float) {
		
		scheduleSounds();
		//scheduleAudio.dispatch(context.currentTime);
		//requestDraw.dispatch(t);
		
		Browser.window.requestAnimationFrame(enterFrame);
		
		return true;
	}
	
	
	inline function scheduleSounds() {
		
		while (nextNoteTime < context.currentTime + scheduleLookAhead ) {
			
			scheduleNote( current16thNote, nextNoteTime );
			nextNote();
		}
	}
	
	
	inline function scheduleNote(beatFloat, time) {
		
		currentNoteStartTime = time;
		
		// create an oscillator
		var osc = context.createOscillator();
		osc.connect( context.destination );
	
		osc.frequency.value = 440 + beatFloat * 20;// 880.0;
		//if (beatFloat == 0) 	osc.frequency.value = 880.0;
		//else if ((beatFloat % 8) == 0)	osc.frequency.value = 440.0;
		
		osc.start( time );
		osc.stop( time + .1 ); // time + noteLength
	}
	
	
	inline function nextNote() {
		var secondsPerBeat = 60.0 / tempo;	// current tempo
		nextNoteTime += 1/8 * secondsPerBeat;	// Add 1/4 of quarter-note beat length to time
		
		current16thNote++;	// Advance the beat number, wrap to zero
		if (current16thNote == 16) current16thNote = 0;
	}

	
	
	
	/**
	 *
	 */
	static function main() {
		
		createContext();
		
		if (context == null) {
			Browser.window.alert("Web Audio API not supported - use a better browser");
		} else {
			instance = new Main2();
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

