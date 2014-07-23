package webaudio.utils;

import flambe.util.Signal1;

/**
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class KeyboardInput {
	
	public var noteOn(default, null):Signal1<Int>;
	public var noteOff(default, null):Signal1<Int>;
	
	public var heldNotes(default, null):Array<Int>;
	
	//
	
	public var noteCount(get, never):Int;
	public var firstNote(get, never):Int;
	public var lastNote(get, never)	:Int;
	
	public var octaveShift:Int = 0;
	
	//
	
	var keyToNote:Map<Int, Int>;
	
	
	/**
	 *
	 * @param	keyNotes
	 */
	public function new(keyNotes:KeyboardNotes) {
		
		heldNotes 	= [];
		
		noteOn 		= new Signal1<Int>();
		noteOff		= new Signal1<Int>();
		
		keyToNote 	= keyNotes.keycodeToNoteIndex;
	}
	
	public inline function qwertyKeyIsNote(code:Int) {
		return keyToNote.exists(code);
	}
	
	public function onQwertyKeyDown(code:Int) {
		if (qwertyKeyIsNote(code)) {
			onNoteKeyDown(shiftedNote(keyToNote.get(code)));
		}
	}
	
	public function onQwertyKeyUp(code:Int) {
		if (noteCount > 0 && keyToNote.exists(code)) { // a note is down
			onNoteKeyUp(shiftedNote(keyToNote.get(code)));
		}
	}
	
	
	public function onNoteKeyDown(noteIndex:Int) {
		var i = Lambda.indexOf(heldNotes, noteIndex);
		if (i == -1) { // not already down?
			heldNotes.push(noteIndex);
			noteOn.emit(noteIndex);
		}
	}
	
	public function onNoteKeyUp(noteIndex:Int) {
		var i = Lambda.indexOf(heldNotes, noteIndex);
		if (i != -1) { // key released was one of the held keys..?
			noteOff.emit(heldNotes.splice(i, 1)[0]);
		}
	}
	
	public function allNotesOff() {
		while (heldNotes.length > 0) {
			noteOff.emit(heldNotes.pop());
		}
	}
	
	public function dispose() {
		heldNotes = null;
		keyToNote = null;
		noteOn = null;
		noteOff = null;
	}
	
	
	inline function shiftedNote(noteIndex:Int) return noteIndex + octaveShift * 12;
	
	// getters
	inline function get_noteCount()	:Int return heldNotes.length;
	inline function get_firstNote()	:Int return noteCount > 0 ? heldNotes[0] : -1;
	inline function get_lastNote()	:Int return noteCount > 0 ? heldNotes[noteCount-1] : -1;
}