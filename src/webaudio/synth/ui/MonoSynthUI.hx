package webaudio.synth.ui;

import audio.parameter.mapping.MapFactory;
import audio.parameter.Parameter;
import flambe.animation.Ease;
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
import flambe.math.Rectangle;
import flambe.System;
import flambe.util.Signal0;
import webaudio.Main;
import webaudio.synth.ui.controls.Rotary;
import webaudio.utils.KeyboardNotes;


/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class MonoSynthUI extends Sprite {
	
	//public var modules	(default,null):Array<ModuleUI>;
	public var keyboard	(default,null):KeyboardUI;
	public var ready	(default,null):Signal0;
	
	var textureAtlas	:Map<String,SubTexture>;
	var keyboardNotes	:KeyboardNotes;
	var keyboardContainer:Sprite;
	var keyboardMask	:Sprite;
	
	var outputLevelKnob	:Entity;
	var ouputPanel		:Entity;
	
	public var outputLevelParameter(get, never):Parameter;
	inline function get_outputLevelParameter():Parameter return outputLevelKnob.get(Rotary).value;
	
	
	public function new(textureAtlas:Map<String,SubTexture>, keyboardNotes:KeyboardNotes) {
		super();
		this.textureAtlas = textureAtlas;
		this.keyboardNotes = keyboardNotes;
		ready = new Signal0();
	}
	
	
	override public function onAdded() {
		
		setupBackground();
		
		setupKeyboard();
		
		//osc,filter,env(adsr),output
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
		owner.addChild(
			new Entity()
				.add(keyboardMask = new Sprite())
				.addChild(new Entity().add(keyboardContainer = new Sprite()).add(keyboard))
			);
		
		
		keyboardMask.x._ 		= 64;
		keyboardMask.y._ 		= 520;
		keyboardMask.scissor 	= new Rectangle(0, 0, 1148, 164);
		
		// perhaps create more keys and animate them left/right to change available range...
	}
	
	
	function setupBackground(){
		
		var background;
		
		owner.addChild(new Entity().add(background = NineSlice.fromSubTexture(textureAtlas.get('panel-bg_50%'))));
		
		x._ = -(1240 / 2);//-607;
		y._ = -340;
		
		background.width  = 1240;// 1214;
		background.height = 680;
		background.setTint(.15, .15, .15);
		
		setupOutputPanel();
		
		/*
		var slicedX;
		var slicedY;
		var t = textureAtlas.get('nubbin-button-bg_50%');
		
		owner.addChild(new Entity().add(slicedX = ThreeSliceX.fromSubTexture(t)));
		owner.addChild(new Entity().add(slicedY = ThreeSliceY.fromSubTexture(t)));
		
		slicedX.x = 256;
		slicedX.y = 96;
		slicedX.width = 384;
		
		slicedY.x = 96;
		slicedY.y = 96;
		slicedY.height = 256;
		//*/
	}
	
	function setupOutputPanel() {
		
		// panel ui test...
		outputLevelKnob = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 1.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		outputLevelKnob.get(Rotary).value.name = 'outputLevelRotary';
		
		owner.addChild(
			(ouputPanel = new Entity().add(new ImageSprite(textureAtlas.get('panel-bg_50%')))).addChild(outputLevelKnob)
		);
		
		ouputPanel.get(Sprite).x._ = 64;
		ouputPanel.get(Sprite).y._ = 64;
		outputLevelKnob.get(Sprite).x._ = 35;
		outputLevelKnob.get(Sprite).y._ = 35;
		
	}
}