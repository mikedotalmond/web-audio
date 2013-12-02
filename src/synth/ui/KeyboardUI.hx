package synth.ui;

import haxe.Http;
import haxe.Template;
import js.Browser;
import js.html.DOMParser;
import js.html.Element;
import js.html.Event;
import js.html.MouseEvent;
import js.html.Node;
import js.html.NodeList;
import msignal.Signal.Signal0;
import msignal.Signal.Signal1;
import utils.KeyboardNotes;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class KeyboardUI {
	
	var template		:Template;
	var keys			:Array<UINote>;
	var keyboardNotes	:KeyboardNotes;
	var pointerDown		:Bool;
	
	var modules			:NodeList;
	var keyboardKeys	:NodeList;
	var noteIndexToKey	:Map<Int, Element>;
	
	public var keyDown(default, null):Signal1<Int>;
	public var keyUp(default, null):Signal1<Int>;
	
	public var heldKey(default, null):Int;
	public function keyIsDown() return heldKey != -1;
	
	public function new(keyboardNotes:KeyboardNotes) {
		this.keyboardNotes = keyboardNotes;
		keys = getUIKeyNoteData();
		loadTemplate();
		
		keyDown = new Signal1<Int>();
		keyUp 	= new Signal1<Int>();
	}
	
	
	function loadTemplate():Void {
		var http:Http = new Http('synth.tpl');
		http.async = true;
		http.onError = function(err) { trace('Error loading synth ui-template: ${err}'); };
		http.onData = renderTemplate;
		http.request();
	}
	
	
	function renderTemplate(data:String) {
		
		template = new Template(data);
		
		var tData = {
			modules: {
				visible:true,
				osc:{visible:true},
				adsr:{visible:true},
				filter:{visible:true},
				outGain:{visible:true},
			},
			keyboard: {
				visible:true,
				keys:keys
			}
		};
		
		var markup 		= template.execute(tData);
		var container 	= new DOMParser().parseFromString(markup, 'text/html').getElementById('container');
		
		while (Browser.document.body.firstChild != null) Browser.document.body.removeChild(Browser.document.body.firstChild);
		Browser.document.body.appendChild(container);
		
		setupControls(container);
	}
	
	
	function setupControls(container:Element) {
		
		modules 		= container.getElementsByClassName("module");
		keyboardKeys 	= container.getElementsByClassName("key");
		noteIndexToKey 	= new Map<Int,Element>();
		
		for (key in keyboardKeys) {
			key.addEventListener("mousedown", onKeyMouse);
			key.addEventListener("mouseup", onKeyMouse);
			key.addEventListener("mouseout", onKeyMouse);
			key.addEventListener("mouseover", onKeyMouse);
			
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
					keyDown.dispatch(noteIndex);
				}
				
			case "mousedown", "touchstart":
				pointerDown = true;
				setKeyIsDown(node, true);
				heldKey = noteIndex;
				keyDown.dispatch(noteIndex);
				
			case "mouseup", "mouseout", "touchend":
				if (heldKey != -1 && heldKey == noteIndex) {
					
					heldKey 	= -1;
					pointerDown = !(e.type == "mouseup" || e.type == "touchend");
					
					setKeyIsDown(node, false);
					
					keyUp.dispatch(noteIndex);
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