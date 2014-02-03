package webaudio.synth.ui;

import audio.parameter.mapping.MapFactory;
import flambe.Component;
import flambe.display.FillSprite;
import flambe.display.Sprite;
import flambe.display.SubImageSprite;
import flambe.display.SubImageSprite.NineSlice;
import flambe.Entity;
import flambe.math.FMath;
import flambe.System;
import flambe.util.Signal0;
import haxe.Http;
import haxe.Template;
import js.Browser;
import js.html.DOMParser;
import js.html.Element;
import js.html.NodeList;
import webaudio.synth.ui.controls.Rotary;
import webaudio.synth.ui.KeyboardUI.UINote;

import webaudio.utils.KeyboardNotes;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class MonoSynthUI extends Component {
	
	//public var modules	(default,null):Array<ModuleUI>;
	public var keyboard	(default,null):KeyboardUI;
	public var ready	(default,null):Signal0;
	
	var textureAtlas:Map<String,SubTextureData>;
	var keyboardNotes:KeyboardNotes;
	
	public function new(textureAtlas:Map<String,SubTextureData>, keyboardNotes:KeyboardNotes) {
		this.textureAtlas = textureAtlas;
		this.keyboardNotes = keyboardNotes;
		ready = new Signal0();
	}
	
	
	override public function onAdded() {
		
		setupBackground();
		
		setupKeyboard();
		
		//modules = ModuleUI.setup();
		
		ready.emit();
	}
	
	function setupKeyboard() {
		keyboard = new KeyboardUI(keyboardNotes, textureAtlas);
		owner.addChild(new Entity().add(keyboard));
	}
	
	function setupBackground(){
	
		var background;
		owner.add((background = new NineSlice('panel-bg_50%')));
		background.width  = 1240;
		background.height = 680;
		background.x = 0;
		background.y = 0;
		background.setTint(.15, .15, .15);
		
		/*var sliced9;
		System.root.addChild(new Entity().add(sliced9 = new NineSlice('panel-bg', 36, 36)));
		sliced9.width  = System.stage.width - 16;
		sliced9.height = 128;
		sliced9.x = 8;
		sliced9.y = 256 + 16;*/
		
		
		// panel ui test...
		var panel;
		var knob = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 0.5, -FMath.PI / 1.25, FMath.PI / 1.25);
		
		owner.addChild(
			(panel = new Entity().add(SubImageSprite.fromSubTextureData(textureAtlas.get('panel-bg_50%')))).addChild(knob)
		);
		
		panel.get(Sprite).x._ = 64;
		panel.get(Sprite).y._ = 64;
		
		knob.get(Sprite).x._ = 35;
		knob.get(Sprite).y._ = 35;
		
		/*
		var slicedX;
		var slicedY;
		System.root.addChild(new Entity().add(slicedX = new ThreeSliceX('nubbin-button-bg_50%')));
		System.root.addChild(new Entity().add(slicedY = new ThreeSliceY('nubbin-button-bg_50%')));
		slicedX.x = 256;
		slicedX.y = 96;
		slicedX.width = 384;
		
		slicedY.x = 96;
		slicedY.y = 96;
		slicedY.height = 256;
		*/
	}
}