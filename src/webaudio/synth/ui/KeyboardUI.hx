package webaudio.synth.ui;

import flambe.Component;
import flambe.display.Sprite;
import flambe.display.ImageSprite;
import flambe.display.SpriteSheet;
import flambe.display.SubTexture;
import flambe.Entity;
import flambe.input.MouseButton;
import flambe.input.PointerEvent;
import flambe.System;
import flambe.util.Signal1;
import flambe.util.SignalConnection;
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

class KeySprite extends ImageSprite {
	public var isSharp(default, null):Bool;
	public var noteIndex(default, null):Int;
	public function new(texture:SubTexture, noteIndex:Int, isSharp:Bool) {
		this.noteIndex = noteIndex;
		this.isSharp = isSharp;
		super(texture);
	}
}

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class KeyboardUI extends Component {
	
	var container		:Sprite;
	
	var whiteKeyTexture	:SubTexture;
	var blackKeyTexture	:SubTexture;
	
	var naturals		:Entity;
	var sharps			:Entity;
	
	var keyboardNotes	:KeyboardNotes;
	var pointerDown		:Bool;
	
	var noteIndexToKey	:Map<Int, KeySprite>;
	var ocataves		:Int;
	
	public var keyDown(default, null):Signal1<Int>;
	public var keyUp(default, null):Signal1<Int>;
	
	public var heldKey(default, null):Int;
	public function keyIsDown() return heldKey != -1;
	
	
	public function new(keyboardNotes:KeyboardNotes, textureAtlas:Map<String,SubTexture>) {
		
		this.keyboardNotes = keyboardNotes;
		
		keyDown = new Signal1<Int>();
		keyUp 	= new Signal1<Int>();
		
		whiteKeyTexture = textureAtlas.get('WhiteKey');
		blackKeyTexture = textureAtlas.get('BlackKey');
	}
	
	
	override public function onAdded() {
		
		container 		= owner.get(Sprite);
		
		var keyData		= getKeysData(keyboardNotes.startOctave, 4);
		
		noteIndexToKey 	= new Map<Int,KeySprite>();
		
		var keyWidth 	= 40;
		var keyHeight	= 164;
		var marginRight	= 1;
		var keyX 		= 0;
		var keyY 		= 0;
		
		owner.addChild(naturals = new Entity());
		owner.addChild(sharps = new Entity());
		
		for (key in keyData) {
			
			var i = key.index;
			
			var spr:KeySprite;
			
			spr 	= new KeySprite(whiteKeyTexture, i, false);
			spr.x._ = keyX;
			spr.y._ = keyY;
			
			noteIndexToKey.set(i, spr);
			
			naturals.addChild(new Entity().add(spr));
			
			spr.pointerOut.connect(onKeyPointerOut);
			spr.pointerMove.connect(onKeyPointerMove);
			spr.pointerDown.connect(onKeyPointerDown);
			spr.pointerUp.connect(onKeyPointerUp);
			
			if (key.hasSharp) {
				spr 	= new KeySprite(blackKeyTexture, i + 1, true);
				spr.x._ = keyX + 26;
				spr.y._ = keyY;
				noteIndexToKey.set(i + 1, spr);
				sharps.addChild(new Entity().add(spr));
				
				spr.pointerOut.connect(onKeyPointerOut);
				spr.pointerMove.connect(onKeyPointerMove);
				spr.pointerDown.connect(onKeyPointerDown);
				spr.pointerUp.connect(onKeyPointerUp);
			}
			
			keyX += (keyWidth + marginRight);
		}
		
		heldKey = -1;
	}
	
	
	
	function onKeyPointerOut(e:PointerEvent) {
		var key:KeySprite = cast e.hit;
		if (!Std.is(key, KeySprite)) {
			if (heldKey != -1) {
				setKeyIsDown(getKeyForNote(heldKey), false);
				pointerDown = false;
				keyUp.emit(heldKey);
				heldKey = -1;
			}
		}
	}
	
	
	function onKeyPointerMove(e:PointerEvent) {
		pointerDown = (System.mouse.supported && System.mouse.isDown(MouseButton.Left)) || (!System.mouse.supported && System.touch.supported);
		if (pointerDown) {
			var key:KeySprite = cast e.hit;
			if (heldKey != key.noteIndex) {
				
				// a new key is down (pointer drag-in)
				setKeyIsDown(key, true);
				keyDown.emit(key.noteIndex);
				
				if (heldKey != -1) {
					//a key was already down - release it here, after triggering a new note
					setKeyIsDown(getKeyForNote(heldKey), false);
					keyUp.emit(heldKey);
				}
				
				heldKey = key.noteIndex;
			}
		}
	}
	
	
	function onKeyPointerDown(e:PointerEvent) {
		var key:KeySprite = cast e.hit;
		pointerDown = true;
		if (heldKey != key.noteIndex) {
			heldKey = key.noteIndex;
			setKeyIsDown(key, true);
			keyDown.emit(key.noteIndex);
		}
	}
	
	
	function onKeyPointerUp(e:PointerEvent) {
		var key:KeySprite = cast e.hit;
		pointerDown = false;
		
		if (heldKey != -1 && heldKey == key.noteIndex) {
			heldKey 	= -1;
			pointerDown = false;
			setKeyIsDown(key, false);
			keyUp.emit(key.noteIndex);
		}
	}

	
	
	function getKeysData(startOctave:Int = 2, octaveCount:Int=2):Array<UINote> {
		ocataves = octaveCount;
		return getUIKeyNoteData(startOctave, octaveCount);
	}
	
	
	inline function getKeyForNote(noteIndex:Int):KeySprite {
		return noteIndexToKey.get(noteIndex);
	}
	
	
	public function setNoteState(index:Int, isDown:Bool) {
		setKeyIsDown(cast getKeyForNote(index), isDown);
	}
	
	
	function setKeyIsDown(key:KeySprite, isDown:Bool) {
		if (key.isSharp) {
			if (isDown) key.setTint(1.666, 1.666, 1.666);
			else key.setTint(1, 1, 1, .16);
		} else {
			if (isDown) key.setTint(.666, .666, .666);
			else key.setTint(1, 1, 1, .16);
		}
	}
	
	
	/**
	 * Key note indices, starting at C-2, up to C6 (120 notes)
	 * @param	octaveShift - shift the keyboard up/down (from C-2) in steps of 1 octave, valid range is from 0 to 8
	 * @param	octaveCount - number of octaves to return
	 * @return
	 */
	function getUIKeyNoteData(startOctave:Int = 0, octaveCount:Int=2):Array<UINote> {
		var i 	= keyboardNotes.noteFreq.noteNameToIndex('C${startOctave}');
		var out	= [];
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