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

	var textureAtlas	:Map<String,SubTexture>;
	var keyboardNotes	:KeyboardNotes;
	var keyboardContainer:Sprite;
	var keyboardMask	:Sprite;
	
	var ouputPanel		:Entity;
	var background		:NineSlice;
	
	public function new(textureAtlas:Map<String,SubTexture>, keyboardNotes:KeyboardNotes) {
		super();
		this.textureAtlas = textureAtlas;
		this.keyboardNotes = keyboardNotes;
	}
	
	
	override public function onAdded() {
		
		x._ = -(1240 / 2);//-607;
		y._ = -348;
		
		setupBackground();
		setupKeyboard();
		setupPanels();
		
		//osc,filter,env(adsr),output
		//modules = ModuleUI.setup();
		
	}
	
	function setupPanels() {
		
		var panelBg = new ImageSprite(textureAtlas.get('main-panel-bg')).disablePointer();
		owner.addChild(new Entity().add(panelBg));
		panelBg.x._ = -8;
		panelBg.y._ = -4;
		
		setupOscillators();
		setupOutputPanel();
	}
	
	
	
	function setupKeyboard() {
		keyboard = new KeyboardUI(keyboardNotes, textureAtlas);
		owner.addChild(
			new Entity()
				.add(keyboardMask = new Sprite())
				.addChild(new Entity().add(keyboardContainer = new Sprite()).add(keyboard))
			);
		
		keyboardMask.x._ 		= 64;
		keyboardMask.y._ 		= 530;
		keyboardMask.scissor 	= new Rectangle(0, 0, 1148, 164);
		// perhaps create more keys and animate them left/right to move the playable range...
	}
	
	
	function setupBackground(){
		
		owner.addChild(new Entity().add(background = NineSlice.fromSubTexture(textureAtlas.get('panel-bg_50%'))));
		
		background.width  = 1240;// 1214;
		background.height = 680;
		background.setTint(96 / 196,  139 / 196, 139 / 196);
	}
	
	
	public var osc0Level(default, null):Rotary;
	public var osc0Pan(default, null):Rotary;
	public var osc0Slide(default, null):Rotary;
	public var osc0Detune(default, null):Rotary;
	public var osc0Random(default, null):Rotary;
	
	public var osc1Level(default, null):Rotary;
	public var osc1Pan(default, null):Rotary;
	public var osc1Slide(default, null):Rotary;
	public var osc1Detune(default, null):Rotary;
	public var osc1Random(default, null):Rotary;
	
	public var oscPhase(default, null):Rotary;
	
	public var outputLevel(default, null):Rotary;	
	public var pitchBend(default, null):Rotary;
	
	function setupOscillators() {
		
		var _osc0Level 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), .5, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _osc0Pan 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, -1, 1), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _osc0Slide 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0.001, 1), 0.001, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _osc0Detune  = Rotary.create(MapFactory.getMapping(MapType.FLOAT, -100, 100), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _osc0Random  = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 100), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		
		var _osc1Level 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), .5, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _osc1Pan 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, -1, 1), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _osc1Slide 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0.001, 1), 0.001, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _osc1Detune  = Rotary.create(MapFactory.getMapping(MapType.FLOAT, -100, 100), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _osc1Random  = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 100), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		
		var _oscPhase 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
	
		var oscPanel;
		owner.addChild(
			(oscPanel = new Entity().add(NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 8, 8, 616, 192)))
				.addChild(_osc0Level)
				.addChild(_osc0Pan)
				.addChild(_osc0Slide)
				.addChild(_osc0Detune)
				.addChild(_osc0Random)
				.addChild(_osc1Level)
				.addChild(_osc1Pan)
				.addChild(_osc1Slide)
				.addChild(_osc1Detune)
				.addChild(_osc1Random)
				.addChild(_oscPhase)
		);
		
		osc0Level = _osc0Level.get(Rotary);
		osc0Level.value.name = 'osc0Level';
		
		osc0Pan = _osc0Pan.get(Rotary);
		osc0Pan.value.name = 'osc0Pan';
		
		osc0Slide = _osc0Slide.get(Rotary);
		osc0Slide.value.name = 'osc0Slide';
		
		osc0Detune = _osc0Detune.get(Rotary);
		osc0Detune.value.name = 'osc0Detune';
		
		osc0Random	= _osc0Random.get(Rotary);
		osc0Random.value.name = 'osc0Random';
		
		//
		
		osc1Level = _osc1Level.get(Rotary);
		osc1Level.value.name = 'osc1Level';
		
		osc1Pan = _osc1Pan.get(Rotary);
		osc1Pan.value.name = 'osc1Pan';
		
		osc1Slide = _osc1Slide.get(Rotary);
		osc1Slide.value.name = 'osc1Slide';
		
		osc1Detune = _osc1Detune.get(Rotary);
		osc1Detune.value.name = 'osc1Detune';
		
		osc1Random = _osc1Random.get(Rotary);
		osc1Random.value.name = 'osc1Random';
		
		//
		
		oscPhase 	= _oscPhase.get(Rotary);
		oscPhase.value.name = 'oscPhase';
		
		
		//
		//
		// positioning...
		
		var panelX = 24.0;
		var panelY = 96.0;
		var rotarySpace = 64;
		
		oscPanel.get(NineSlice).x = panelX;
		oscPanel.get(NineSlice).y = panelY;

		panelX += 192;//36;
		panelY += 42;
		
		_osc0Level.get(Sprite).x._ = panelX;
		_osc0Level.get(Sprite).y._ = panelY;
		
		_osc0Pan.get(Sprite).x._ = panelX += rotarySpace;
		_osc0Pan.get(Sprite).y._ = panelY;
		
		_osc0Slide.get(Sprite).x._ = panelX += rotarySpace;
		_osc0Slide.get(Sprite).y._ = panelY;
		
		_osc0Detune.get(Sprite).x._ = panelX += rotarySpace;
		_osc0Detune.get(Sprite).y._ = panelY;
		
		_osc0Random.get(Sprite).x._ = panelX += rotarySpace;
		_osc0Random.get(Sprite).y._ = panelY;
		
		
		_oscPhase.get(Sprite).x._ = panelX += rotarySpace+rotarySpace/2;
		_oscPhase.get(Sprite).y._ = panelY + 54;
		
		
		panelX = 192+24;//36;
		panelY += 96;
		
		_osc1Level.get(Sprite).x._ = panelX;
		_osc1Level.get(Sprite).y._ = panelY;
		
		_osc1Pan.get(Sprite).x._ = panelX += rotarySpace;
		_osc1Pan.get(Sprite).y._ = panelY;
		
		_osc1Slide.get(Sprite).x._ = panelX += rotarySpace;
		_osc1Slide.get(Sprite).y._ = panelY;
		
		_osc1Detune.get(Sprite).x._ = panelX += rotarySpace;
		_osc1Detune.get(Sprite).y._ = panelY;
		
		_osc1Random.get(Sprite).x._ = panelX += rotarySpace;
		_osc1Random.get(Sprite).y._ = panelY;
	}
		
	
	function setupOutputPanel() {
		
		// panel ui test...
		var _outputLevel = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 1.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		var _pitchBend = Rotary.create(MapFactory.getMapping(MapType.FLOAT, -1, 1), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
	
		owner.addChild(
			(ouputPanel = new Entity().add(NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 16, 16, 616, 192)))
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