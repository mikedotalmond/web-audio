package webaudio.synth.ui;

import flambe.Component;
import flambe.display.Sprite;
import flambe.display.SubImageSprite;
import flambe.display.SubImageSprite.SubTextureData;
import flambe.Entity;
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

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class KeyboardUI extends Component {
	
	var whiteKeyData	:SubTextureData;
	var blackKeyData	:SubTextureData;
	
	var naturals		:Entity;
	var sharps			:Entity;
	
	var keyboardNotes	:KeyboardNotes;
	var pointerDown		:Bool;
	
	var noteIndexToKey	:Map<Int, Sprite>;
	var ocataves		:Int;
	
	public var keyDown(default, null):Signal1<Int>;
	public var keyUp(default, null):Signal1<Int>;
	
	public var heldKey(default, null):Int;
	public function keyIsDown() return heldKey != -1;
	
	
	public function new(keyboardNotes:KeyboardNotes, textureAtlas:Map<String,SubTextureData>) {
		
		this.keyboardNotes = keyboardNotes;
		
		keyDown = new Signal1<Int>();
		keyUp 	= new Signal1<Int>();
		
		whiteKeyData = textureAtlas.get('whiteKey');
		blackKeyData = textureAtlas.get('blackKey');
	}
	
	
	override public function onAdded() {
		
		var keyData		= getKeysData(2, 4);
		
		noteIndexToKey 	= new Map<Int,Sprite>();
		
		var keyWidth 	= 40;
		var keyHeight	= 164;
		var marginRight	= 1;
		var keyX 		= Std.int(System.stage.width / 2 - ((keyData.length * keyWidth + keyData.length * marginRight - 1) / 2));
		var keyY 		= 540;
		
		owner.addChild(naturals = new Entity());
		owner.addChild(sharps = new Entity());
		
		for (key in keyData) {
			
			var i = key.index;
			
			var spr:SubImageSprite;
			
			spr = SubImageSprite.fromSubTextureData(whiteKeyData);
			spr.x._ = keyX;
			spr.y._ = keyY;
			noteIndexToKey.set(i, spr);
			spr.userData = i;
			naturals.addChild(new Entity().add(spr));
			
			if (key.hasSharp) {
				spr = SubImageSprite.fromSubTextureData(blackKeyData);
				spr.x._ = keyX + 26;
				spr.y._ = keyY;
				noteIndexToKey.set(i + 1, spr);
				spr.userData = i + 1;
				sharps.addChild(new Entity().add(spr));
			}
			
			keyX += (keyWidth + marginRight);
			//spr.pointerDown.connect(onKeyPointerDown);
		}
		
		heldKey = -1;
	}
	
	
	
	function onKeyMouse(e:MouseEvent) {
		/*
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
		}*/
	}
	
	
	
	function getKeysData(octaveShift:Int = 2, octaveCount:Int=2):Array<UINote> {
		ocataves = octaveCount;
		return getUIKeyNoteData(octaveShift, octaveCount);
	}
	
	
	inline function getKeyForNote(noteIndex:Int):Sprite {
		return noteIndexToKey.get(noteIndex);
	}
	
	public function setNoteState(index:Int, isDown:Bool) {
		setKeyIsDown(cast getKeyForNote(index), isDown);
	}
	
	
	function setKeyIsDown(key:Sprite, isDown:Bool) {
		trace('setKeyIsDown:${isDown} - ${(cast key).userData}');
		
		key.setTint(isDown?2:1, isDown?.666:1, isDown?.666:1);
		
		/*if (key != null) {
			var className = key.getAttribute('data-classname');
			key.className = isDown ? 'key ${className} ${className}-hover' : 'key ${className}';
		}*/
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