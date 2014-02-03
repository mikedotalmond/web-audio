package webaudio.utils;

import flambe.input.Key;
import flambe.input.KeyboardEvent;
import flambe.platform.KeyCodes;
import flambe.System;
import flambe.util.Signal0;
import flambe.util.Signal1;
import js.Browser;
import webaudio.Main;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class KeyboardInput {
	
	var keyToNote:Map<Int, Int>;
	
	/**
	 * Note on signal - note index
	 */
	public var noteOn(default, null):Signal1<Int>;
	
	/**
	 * Note off signal
	 * */
	
	public var noteOff(default,null):Signal0; // TODO:Move elsewhere

	public var keyDown(default, null):Signal1<Int>;
	public var keyUp(default,null):Signal1<Int>;
	
	public var heldNotes(default, null):Array<Int>;
	// current notes...
	public inline function noteCount():Int 	return heldNotes.length > 0 ? heldNotes.length : -1;
	public inline function hasNotes():Bool 	return noteCount() > 0;
	public inline function firstNote():Int 	return noteCount() > 0 ? heldNotes[0] : -1;
	public inline function lastNote():Int 	return noteCount() > 0 ? heldNotes[noteCount()-1] : -1;
	
	/**
	 *
	 * @param	keyNotes
	 */
	public function new(keyNotes:KeyboardNotes) {
		
		heldNotes 	= [];
		
		noteOn 		= new Signal1<Int>();
		noteOff		= new Signal0();
		
		keyDown 	= new Signal1<Int>();
		keyUp 		= new Signal1<Int>();
		
		keyToNote 	= keyNotes.keycodeToNoteIndex;
	}
	
	public function handleKeyDown(code:Int) {
		if (keyToNote.exists(code)) {
			var noteIndex = keyToNote.get(code);
			var i = Lambda.indexOf(heldNotes, noteIndex);
			if (i == -1) { // not already down?
				noteOn.emit(noteIndex);
				keyDown.emit(noteIndex);
				heldNotes.push(noteIndex);
			}
		}
	}
	
	public function handleKeyUp(code:Int) {
		var n = heldNotes.length;
		if (n > 0) { // a note is down
			var i = Lambda.indexOf(heldNotes, keyToNote.get(code));
			if (i != -1) { // key released was one of the held keys..?
				
				var off  = heldNotes.splice(i, 1)[0];
				var n	 = heldNotes.length; // active note count
				
				keyUp.emit(off);
				
				// TODO:refactor this monophonic noteOn/Off logic elsewhere - just work with keys up/down here (and the keys-ui), and let something else (NotecCntrol) decide whether a noteOn/off occurs
				if (heldNotes.length == 0) noteOff.emit(); // no notes down?
				else noteOn.emit(heldNotes[heldNotes.length - 1]); // retrigger last pressed key
			}
		}
	}
	
	
	public function dispose() {
		heldNotes = null;
		keyToNote = null;
		keyDown = null;
		keyUp = null;
		noteOn = null;
		noteOff = null;
	}
}