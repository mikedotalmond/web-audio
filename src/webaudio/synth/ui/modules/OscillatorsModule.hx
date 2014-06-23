package webaudio.synth.ui.modules;

import audio.parameter.mapping.MapFactory;
import audio.parameter.mapping.MapFactory.MapType;
import flambe.display.Sprite;

import flambe.display.NineSlice;
import flambe.display.SubTexture;
import flambe.Entity;
import flambe.math.FMath;

import webaudio.synth.ui.controls.Rotary;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class OscillatorsModule {
	
	var _osc0Level:Entity;
	var _osc0Pan:Entity;
	var _osc0Slide:Entity;
	var _osc0Detune:Entity;
	var _osc0Random:Entity;
	var _osc1Level:Entity;
	var _osc1Pan:Entity;
	var _osc1Slide:Entity;
	var _osc1Detune:Entity;
	var _osc1Random:Entity;
	var _oscPhase:Entity;
	
	var _oscPanel:NineSlice;
	
	public var osc0Level	(default, null):Rotary;
	public var osc0Pan		(default, null):Rotary;
	public var osc0Slide	(default, null):Rotary;
	public var osc0Detune	(default, null):Rotary;
	public var osc0Random	(default, null):Rotary;
	
	public var osc1Level	(default, null):Rotary;
	public var osc1Pan		(default, null):Rotary;
	public var osc1Slide	(default, null):Rotary;
	public var osc1Detune	(default, null):Rotary;
	public var osc1Random	(default, null):Rotary;
	
	public var oscPhase		(default, null):Rotary;
	
	
	public function new(owner:Entity, textureAtlas:Map<String,SubTexture>) {
		
		init(owner, textureAtlas);
		
		position(24, 96);		
	}
	
	function position(panelX:Float,panelY:Float) {
		
		var rotarySpace = 64;
		
		_oscPanel.x = panelX;
		_oscPanel.y = panelY;

		panelX += 192;
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
	
	function init(owner:Entity, textureAtlas) {
		
		_osc0Level 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), .5, -FMath.PI / 1.25, FMath.PI / 1.25);
		_osc0Pan 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, -1, 1), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		_osc0Slide 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0.001, 1), 0.001, -FMath.PI / 1.25, FMath.PI / 1.25);
		_osc0Detune = Rotary.create(MapFactory.getMapping(MapType.FLOAT, -100, 100), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		_osc0Random = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 100), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		
		_osc1Level 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), .5, -FMath.PI / 1.25, FMath.PI / 1.25);
		_osc1Pan 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, -1, 1), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		_osc1Slide 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0.001, 1), 0.001, -FMath.PI / 1.25, FMath.PI / 1.25);
		_osc1Detune = Rotary.create(MapFactory.getMapping(MapType.FLOAT, -100, 100), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		_osc1Random = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 100), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		
		_oscPhase 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 0.0, -FMath.PI / 1.25, FMath.PI / 1.25);
		
		_oscPanel 	= NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 8, 8, 616, 192);
		
		owner.addChild(
			new Entity().add(_oscPanel)
				.addChild(_osc0Level).addChild(_osc0Pan) .addChild(_osc0Slide).addChild(_osc0Detune).addChild(_osc0Random)
				.addChild(_osc1Level).addChild(_osc1Pan).addChild(_osc1Slide).addChild(_osc1Detune).addChild(_osc1Random)
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
		
	
	}	
}