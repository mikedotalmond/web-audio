package synth.ui;

import haxe.Http;
import haxe.Template;
import js.Browser;
import js.html.DivElement;
import js.html.DOMParser;
import js.html.Element;
import js.html.Event;
import js.html.MouseEvent;
import js.html.Node;
import js.html.NodeList;
import utils.KeyboardNotes;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class KeyboardUI {
	
	var template		:haxe.Template;
	var keys			:Array<UINote>;
	var keyboardNotes	:KeyboardNotes;
	var keyHeld:Int;
	var pointerDown:Bool;

	public function new(keyboardNotes) {
		
		this.keyboardNotes = keyboardNotes;
		keys = getUIKeyNoteData();
		loadTemplate();
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
		
		var modules		:NodeList = container.getElementsByClassName("module");
		var keyboardKeys:NodeList = container.getElementsByClassName("key");
		
		for (key in keyboardKeys) {
			key.addEventListener("mousedown", onKeyMouse);
			key.addEventListener("mouseup", onKeyMouse);
			key.addEventListener("mouseout", onKeyMouse);
			key.addEventListener("mouseover", onKeyMouse);
		}
		
		keyHeld = -1;
		pointerDown = false;
	}
	
	var lastKey:DivElement = null;
	
	private function onKeyMouse(e:MouseEvent):Void {
		e.stopImmediatePropagation();
		var node:DivElement = cast e.target;
		var noteIndex = Std.parseInt(node.getAttribute('data-noteindex'));
		
		switch (e.type) {
			case "mouseover":
				if (pointerDown) {
					trace('down ${noteIndex}');
					keyDown(noteIndex, node);
				}
			case "mousedown", "touchstart":
				trace('down ${noteIndex}');
				pointerDown = true;
				keyDown(noteIndex, node);
				
			case "mouseup", "mouseout", "touchend":
				if (keyHeld != -1 && keyHeld == noteIndex) {
					keyUp(noteIndex, !(e.type == "mouseup" || e.type == "touchend"));
				}
		}
	}
	
	function keyDown(noteIndex:Int,node:DivElement) {
		if (lastKey != null) lastKey.className = lastKey.getAttribute('data-classes');
		node.className = node.className + ' ${node.className}-hover';
		lastKey = node;
		keyHeld = noteIndex; 
	}
	
	function keyUp(noteIndex:Int, pointerHeld) {
		trace('up ${noteIndex}');
		
		if (lastKey != null) lastKey.className = lastKey.getAttribute('data-classes');
		lastKey = null;
		
		pointerDown = pointerHeld;
		keyHeld = -1;
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