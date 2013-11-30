﻿package utils;

import haxe.ds.Vector.Vector;

/**
* ...
* @author Mike Almond  - MadeByPi
*/
class NoteFrequencyUtil {
	
	static inline var defaultTuning	:Float = 440.0;
	
	static inline var LOG2E			:Float = 1.4426950408889634; //Math.LOG2E
	
	static inline var Twelveth		:Float = 1 / 12;
	static inline var centExp		:Float = 1 / 1200;
	
	static var pitchNames	:Array<String>;
	static var altPitchNames:Array<String>;
	
	var noteFrequencies		:Array<Float>;
	var noteNames			:Array<String>;
	var invTuningBase		:Float;
	
	public function new() {
		if (pitchNames == null) {
			pitchNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
			altPitchNames = [null, 'Db#', null, 'Eb', null, null, 'Gb', null, 'Ab', null, 'Bb', null];
		}
		
		noteFrequencies	= [];
		noteNames = [];

		_octaveMiddleC = 3;
		tuningBase = defaultTuning;
	}
	
	function reset() {
		for(i in 0...128) {
			noteNames[i] 		= indexToName(i);
			noteFrequencies[i] 	= indexToFrequency(i);
		}
	}
	
	public function noteIndexToFrequency(index:Int, cents:Int = 0):Float {
		if (index >= 0 && index < 128) {
			if (cents == 0) return noteFrequencies[index];				
			else if (cents < 0) return noteFrequencies[index] / Math.pow(2, -cents * centExp);
			else return noteFrequencies[index] * Math.pow(2, cents * centExp);
		}
		return Math.NaN;
	}
	
	
	public function frequencyToNoteIndex(frequency:Float):Int {
		return Std.int(frequencyToNote(frequency));
	}
	
	public function noteIndexToName(index:Int):String {
		if (index>=0 && index < 128) return noteNames[index];
		return null;
	}
	
	public function noteNameToIndex(name:String):Int{
		var hasAlternate = name.indexOf("/");
		if (hasAlternate != -1) name = name.substring(0, hasAlternate);
		var s;
		var i = noteNames.length;
		while(--i > -1){
			s = noteNames[i];
			if (s.indexOf(name) > -1) return i;
		}
		return -1;
	}
	
	
	/**
	 * conversion functions
	 * */
	inline function indexToFrequency(index:Int):Float {
		//(index - 69.0) == distance in tones to A440 / A3 -- taking note index-zero to be the lowest note, C-2
		return tuningBase * Math.pow(2, (index - 69.0) * Twelveth);
	}
	
	inline function frequencyToNote(frequency:Float):Float {
		return 12 * (Math.log(frequency * invTuningBase) * LOG2E) + 57;
	}
	
	function indexToName(index:Int):String{
		var	pitch	:Int 	= index % 12;
		var octave	:Int 	= (Std.int(index * Twelveth) - (5 - octaveMiddleC));
		var noteName:String = pitchNames[pitch] + octave;
		if (altPitchNames[pitch]!=null) noteName += "/" + altPitchNames[pitch] + octave;
		return noteName;
	}
	
	
	
	/**
	 * Get/Set the base frequency for tuning - defaults to 440Hz (A440)
	 */
	var _tuningBase:Float;
	public var tuningBase(get_tuningBase,set_tuningBase):Float;
	function get_tuningBase():Float { return _tuningBase; }
	function set_tuningBase(value:Float):Float {
		_tuningBase 	= value;
		invTuningBase 	= 1.0 / (_tuningBase * 0.5);
		reset();
		return _tuningBase;
	}
	
	/**
	 * 
	 */
	var _octaveMiddleC:Int;
	public var octaveMiddleC(get_octaveMiddleC, set_octaveMiddleC):Int;
	function get_octaveMiddleC():Int { return _octaveMiddleC; }
	function set_octaveMiddleC(value:Int):Int {
		_octaveMiddleC = value;
		reset();
		return value;
	}
	
	
	
	/**
	 * transpose a sample
	 * @param	dest	The destination key
	 * @param	root	The root key
	 * @return	Playback rate for the destination key, given the root key
	 */
	public static inline function rateFromNote(note:Float, cents:Float, root:Float):Float {
		return (12 + note + (cents*0.01) - root) * Twelveth;
	}
	
	/**
	 * get the note value of a sample playing at [rate] with the root key of [root]
	 * @param	rate
	 * @param	root
	 * @return	Note index of the sample
	 */
	public static inline function noteFromRate(rate:Float, root:Int):Int {
		return Std.int(root + (rate * 12));
	}
	
	/**
	 * Typically used to get the playback rate for a sample generator being used as a waveform PCM synthesis / waveform generator
	 * @param	frequency		- required frequency
	 * @param	rootFrequency	- root frequency of the waveform
	 * @return
	 * */
	public static inline function rateFromFrequency(frequency:Float, rootFrequency:Float):Float {
		return frequency / rootFrequency;
	}
}