package utils;

import js.Browser;
import js.html.KeyboardEvent;
import msignal.Signal;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

class KeyboardInput {
	
	var heldKeys:Array<Int>;
	var keyNotes:KeyboardNotes;
	
	
	/**
	 * Note on signal - KeyNoteData > time, freq, velocity (level)
	 */
	public var noteOn(default,null):Signal2<Float,Float>;
	
	
	/**
	 * Note off signal - time
	 */
	public var noteOff(default,null):Signal1<Float>;
	
	
	public function new() {
		
		heldKeys 	= [];
		keyNotes 	= new KeyboardNotes();
		noteOn 		= new Signal2<Float,Float>();
		noteOff		= new Signal1<Float>();
		
		Browser.document.addEventListener("keydown", handleKeyDown);
		Browser.document.addEventListener("keyup", handleKeyUp);
	}
	
	
	function handleKeyDown(e:KeyboardEvent) {
		var i = Lambda.indexOf(heldKeys, e.keyCode);
		if (i == -1) { // not already down?
			var nf = keyNotes.keycodeToNoteFreq;
			if(nf.exists(e.keyCode)){
				noteOn.dispatch(nf.get(e.keyCode), .8);
				heldKeys.push(e.keyCode);
			}
		}
	}
	
	
	function handleKeyUp(e:KeyboardEvent) {
		var n = heldKeys.length;
		if (n > 0) {
			var i = Lambda.indexOf(heldKeys, e.keyCode);
			if (i != -1) { // key released was one of the held keys..?
				heldKeys.splice(i, 1)[0];
				if (heldKeys.length == 0) noteOff.dispatch(0); // no notes down?
				else noteOn.dispatch(keyNotes.keycodeToNoteFreq.get(heldKeys[heldKeys.length - 1]),	.8);
			}
		}
	}
	
	
	public function dispose() {
		heldKeys = null;
		keyNotes.dispose(); keyNotes = null;
		noteOn.removeAll(); noteOn = null;
		noteOff.removeAll(); noteOff = null;
		Browser.document.removeEventListener("keydown", handleKeyDown);
		Browser.document.removeEventListener("keyup", handleKeyUp);
	}	
}