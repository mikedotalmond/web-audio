package webaudio.synth.ui;

import flambe.util.Signal1;
import haxe.Http;
import haxe.Template;
import js.Browser;
import js.html.DOMParser;
import js.html.Element;
import js.html.Event;
import js.html.MouseEvent;
import js.html.Node;
import js.html.NodeList;

import webaudio.utils.KeyboardNotes;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class KeyboardUI {
	
	var keyboardNotes	:KeyboardNotes;
	var pointerDown		:Bool;
	
	var keyboardKeys	:NodeList;
	var noteIndexToKey	:Map<Int, Element>;
	var ocataves		:Int;
	
	public var keyDown(default, null):Signal1<Int>;
	public var keyUp(default, null):Signal1<Int>;
	
	public var heldKey(default, null):Int;
	public function keyIsDown() return heldKey != -1;
	
	
	public function new(keyboardNotes:KeyboardNotes) {
		this.keyboardNotes = keyboardNotes;
		keyDown = new Signal1<Int>();
		keyUp 	= new Signal1<Int>();
		ocataves = 2;
	}
	
	public function getKeyboardData(octaveShift:Int = 2, octaveCount:Int=2):Dynamic {
		
		ocataves = octaveCount;
		
		return {
			visible:true,
			keys:getUIKeyNoteData(octaveShift, octaveCount)
		};
	}
	
	
	public function setup(keyboardKeys:NodeList) {
		
		this.keyboardKeys 	= keyboardKeys;
		noteIndexToKey 		= new Map<Int,Element>();
		
		var n 			= keyboardKeys.length;
		var keyWidth 	= 	(ocataves == 1) ? 123:
							(ocataves == 2) ? 60 : 
							(ocataves == 3) ? 39.5 : 30;
							
		var keyHeight	= 	(ocataves == 1) ? 200:
							(ocataves == 2) ? 180 : 
							(ocataves == 3) ? 150 : 128;
							
		var marginRight	=	(ocataves == 1) ? 5 :
							(ocataves == 2) ? 4 : 
							(ocataves == 3) ? 3 : 2;
		
		for (key in keyboardKeys) {
			key.addEventListener("mousedown", onKeyMouse);
			key.addEventListener("mouseup", onKeyMouse);
			key.addEventListener("mouseout", onKeyMouse);
			key.addEventListener("mouseover", onKeyMouse);
			
			var k:Element = cast key;
			if (k.className.indexOf("natural") != -1) {
				k.style.width = '${keyWidth}px';
				k.style.height = '${keyHeight}px';
				k.style.marginRight = '${marginRight}px';
			}
			
			var k:Element = cast key;
			noteIndexToKey.set(Std.parseInt(k.getAttribute('data-noteindex')), k);
		}
		
		heldKey = -1;
		pointerDown = false;
	}
	
	
	function onKeyMouse(e:MouseEvent) {
		
		e.stopImmediatePropagation();
		var node:Element = cast e.target;
		var noteIndex = Std.parseInt(node.getAttribute('data-noteindex'));
		
		switch (e.type) {
			case "mouseover":
				if (pointerDown) {
					setKeyIsDown(node, true);
					heldKey = noteIndex;
					keyDown.emit(noteIndex);
				}
				
			case "mousedown", "touchstart":
				pointerDown = true;
				setKeyIsDown(node, true);
				heldKey = noteIndex;
				keyDown.emit(noteIndex);
				
			case "mouseup", "mouseout", "touchend":
				if (heldKey != -1 && heldKey == noteIndex) {
					
					heldKey 	= -1;
					pointerDown = !(e.type == "mouseup" || e.type == "touchend");
					
					setKeyIsDown(node, false);
					
					keyUp.emit(noteIndex);
				}
		}
	}
	
	
	inline function getKeyForNote(noteIndex:Int) {
		return noteIndexToKey.get(noteIndex);
	}
	
	
	public function setNoteState(index:Int, isDown:Bool) {
		setKeyIsDown(getKeyForNote(index), isDown);
	}
	
	
	function setKeyIsDown(key:Element, isDown:Bool) {
		if (key != null) {
			var className = key.getAttribute('data-classname');
			key.className = isDown ? 'key ${className} ${className}-hover' : 'key ${className}';
		}
	}
	
	
	/**
	 * Key note indices, starting at C-2, up to C6 (120 notes)
	 * @param	octaveShift - shift the keyboard up/down (from C-2) in steps of 1 octave, valid range is from 0 to 8
	 * @param	octaveCount - number of octaves to return
	 * @return
	 */
	function getUIKeyNoteData(octaveShift:Int = 2, octaveCount:Int=2):Array<UINote> {
		octaveShift = octaveShift < 0 ? 0 : (octaveShift > 4 ? 4 : octaveShift);
		var i = keyboardNotes.noteFreq.noteNameToIndex("C-2") + (octaveShift * 12);
		
		var out = [];
		for (oct in 0...octaveCount) {
			out.push({ index:i +  	 12 * oct, hasSharp:true } );
			out.push({ index:i + 2 + 12 * oct , hasSharp:true } );
			out.push({ index:i + 4 + 12 * oct, hasSharp:false } );
			out.push({ index:i + 5 + 12 * oct, hasSharp:true } );
			out.push({ index:i + 7 + 12 * oct, hasSharp:true } );
			out.push({ index:i + 9 + 12 * oct, hasSharp:true } );
			out.push({ index:i + 11 +12 * oct, hasSharp:false } );
		}
		
		return out;
	}
}


typedef UINote = {
	var index:Int;
	var hasSharp:Bool;
}