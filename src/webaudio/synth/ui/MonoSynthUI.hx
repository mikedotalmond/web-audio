package webaudio.synth.ui;

import audio.parameter.mapping.MapFactory;
import flambe.Component;
import flambe.display.NineSlice;
import flambe.display.Sprite;
import flambe.display.SpriteSheet;
import flambe.display.ImageSprite;
import flambe.display.SubTexture;
import flambe.display.ThreeSliceX;
import flambe.display.ThreeSliceY;
import flambe.Entity;
import flambe.math.FMath;
import flambe.System;
import flambe.util.Signal0;
import webaudio.Main;
import webaudio.synth.ui.controls.Rotary;
import webaudio.utils.KeyboardNotes;


/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class MonoSynthUI extends Component {
	
	//public var modules	(default,null):Array<ModuleUI>;
	public var keyboard	(default,null):KeyboardUI;
	public var ready	(default,null):Signal0;
	
	var textureAtlas	:Map<String,SubTexture>;
	var keyboardNotes	:KeyboardNotes;
	
	public function new(textureAtlas:Map<String,SubTexture>, keyboardNotes:KeyboardNotes) {
		this.textureAtlas = textureAtlas;
		this.keyboardNotes = keyboardNotes;
		ready = new Signal0();
	}
	
	
	override public function onAdded() {
		
		setupBackground();
		
		setupKeyboard();
		
		//modules = ModuleUI.setup();
		
		resize();
		
		System.stage.resize.connect(resize);
		
		ready.emit();
	}
	
	
	function resize() {
		//var w 	= System.stage.width;
		//var h 	= System.stage.height;
		//var fs 	= System.stage.fullscreen;
	}
	
	
	function setupKeyboard() {
		keyboard = new KeyboardUI(keyboardNotes, textureAtlas);
		owner.addChild(new Entity().add(keyboard));
	}
	
	function setupBackground(){
		var background;
		owner.add(background = NineSlice.fromSubTexture(textureAtlas.get('panel-bg_50%')));
		
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
			(panel = new Entity().add(new ImageSprite(textureAtlas.get('panel-bg_50%')))).addChild(knob)
		);
		
		panel.get(Sprite).x._ = 64;
		panel.get(Sprite).y._ = 64;
		
		knob.get(Sprite).x._ = 35;
		knob.get(Sprite).y._ = 35;
		
		/*
		var slicedX;
		var slicedY;
		var t = textureAtlas.get('nubbin-button-bg_50%');
		
		System.root.addChild(new Entity().add(slicedX = ThreeSliceX.fromSubTexture(t)));
		System.root.addChild(new Entity().add(slicedY = ThreeSliceY.fromSubTexture(t)));
		
		slicedX.x = 256;
		slicedX.y = 96;
		slicedX.width = 384;
		
		slicedY.x = 96;
		slicedY.y = 96;
		slicedY.height = 256;
		//*/
	}
}