package utils;

import js.Browser;
import js.html.KeyboardEvent;
import msignal.Signal;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class KeyboardInput {
	
	var heldNotes:Array<Int>;
	var keyToNote:Map<Int, Int>;
	
	/**
	 * Note on signal - note index
	 */
	public var noteOn(default, null):Signal1<Int>;
	
	/**
	 * Note off signal
	 * */
	
	public var noteOff(default,null):Signal0;

	public var keyDown(default,null):Signal1<Int>;
	public var keyUp(default,null):Signal1<Int>;
	
	
	public function new(keyNotes:KeyboardNotes) {
		
		heldNotes 	= [];
		
		noteOn 		= new Signal1<Int>();
		noteOff		= new Signal0();
		
		keyDown 	= new Signal1<Int>();
		keyUp 		= new Signal1<Int>();
		
		keyToNote 	= keyNotes.keycodeToNoteIndex;
		
		Browser.document.addEventListener("keydown", handleKeyDown);
		Browser.document.addEventListener("keyup", handleKeyUp);
	}
	
	
	function handleKeyDown(e:KeyboardEvent) {
		if (keyToNote.exists(e.keyCode)) {
			var noteIndex = keyToNote.get(e.keyCode);
			var i = Lambda.indexOf(heldNotes, noteIndex);
			if (i == -1) { // not already down?
				noteOn.dispatch(noteIndex);
				keyDown.dispatch(noteIndex);
				heldNotes.push(noteIndex);
			}
		}
	}
	
	
	function handleKeyUp(e:KeyboardEvent) {
		
		var n = heldNotes.length;
		if (n > 0) { // a note is down
			var i = Lambda.indexOf(heldNotes, keyToNote.get(e.keyCode));
			if (i != -1) { // key released was one of the held keys..?
				
				var off  = heldNotes.splice(i, 1)[0];
				var n	 = heldNotes.length; // active note count
				
				keyUp.dispatch(off);
				
				// TODO:refactor this monophonic noteOn/Off logic elsewhere - just work with keys up/down here (and the keys-ui), and let something else (NotecCntrol) decide whether a noteOn/off occurs
				if (heldNotes.length == 0) noteOff.dispatch(); // no notes down?
				else noteOn.dispatch(heldNotes[heldNotes.length - 1]); // retrigger last pressed key
				
			}
		}
	}
	
	
	public function dispose() {
		heldNotes = null;
		keyToNote = null;
		keyDown.removeAll(); keyDown = null;
		keyUp.removeAll(); keyUp = null;
		noteOn.removeAll(); noteOn = null;
		noteOff.removeAll(); noteOff = null;
		Browser.document.removeEventListener("keydown", handleKeyDown);
		Browser.document.removeEventListener("keyup", handleKeyUp);
	}
}