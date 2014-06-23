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
import webaudio.synth.ui.modules.OscillatorsModule;
import webaudio.utils.KeyboardNotes;


/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class MonoSynthUI extends Sprite {
	
	//public var modules	(default,null):Array<ModuleUI>;
	public var keyboard	(default,null):KeyboardUI;

	var textureAtlas	:Map<String,SubTexture>;
	var keyboardNotes	:KeyboardNotes;
	var keyboardContainer:Sprite;
	var keyboardMask	:Sprite;
	
	var ouputPanel		:Entity;
	var background		:NineSlice;
	
	public var outputLevel	(default, null):Rotary;	
	public var pitchBend	(default, null):Rotary;
		
	public var oscillators	(default, null):OscillatorsModule;
	
	
	public function new(textureAtlas:Map<String,SubTexture>, keyboardNotes:KeyboardNotes) {
		super();
		this.textureAtlas = textureAtlas;
		this.keyboardNotes = keyboardNotes;
	}
	
	
	override public function onAdded() {
		
		x._ = -(1240 / 2);
		y._ = -348;
		
		setupBackground();
		setupKeyboard();
		setupPanels();
		
	}
	
	function setupPanels() {
		
		var panelBg = new ImageSprite(textureAtlas.get('main-panel-bg')).disablePointer();
		owner.addChild(new Entity().add(panelBg));
		panelBg.x._ = -8;
		panelBg.y._ = -4;
		
		oscillators = new OscillatorsModule(owner, textureAtlas);
		
		setupOutputPanel();
	}
	
	
	
	function setupKeyboard() {
		
		keyboard = new KeyboardUI(keyboardNotes, textureAtlas);
		owner.addChild(
			new Entity()
				.add(keyboardMask = new Sprite())
				.addChild(new Entity().add(keyboardContainer = new Sprite()).add(keyboard))
			);
		
		keyboardMask.x._ = 64;
		keyboardMask.y._ = 530;
		keyboardMask.scissor = new Rectangle(0, 0, 1148, 164);
		// perhaps create more keys and animate them left/right to move the playable range...
	}
	
	
	function setupBackground(){
		
		owner.addChild(new Entity().add(background = NineSlice.fromSubTexture(textureAtlas.get('panel-bg_50%'))));
		
		background.width  = 1240;
		background.height = 680;
		background.setTint(96 / 196,  139 / 196, 139 / 196);
	}
	
	
	function setupOutputPanel() {
		
		// panel ui test...
		var _outputLevel = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 1.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _pitchBend = Rotary.create(MapFactory.getMapping(MapType.FLOAT, -1, 1), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
	
		owner.addChild(
			(ouputPanel = new Entity().add(NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 16, 16, 320, 192)))
				.addChild(_outputLevel)
				.addChild(_pitchBend)
		);
		
		outputLevel = _outputLevel.get(Rotary);
		outputLevel.value.name = 'outputLevel';
	
		pitchBend = _pitchBend.get(Rotary);
		pitchBend.value.name = 'pitchBend';
		
		var panelX = 23;
		var panelY = 96+200;
		
		ouputPanel.get(NineSlice).x = panelX;
		ouputPanel.get(NineSlice).y = panelY;
		
		_outputLevel.get(Sprite).x._ = panelX+35;
		_outputLevel.get(Sprite).y._ = panelY+35;
		
		_pitchBend.get(Sprite).x._ = panelX+128;
		_pitchBend.get(Sprite).y._ = panelY+35;
		
	}
}