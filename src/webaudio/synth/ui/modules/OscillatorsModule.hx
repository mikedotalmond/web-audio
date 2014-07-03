package webaudio.synth.ui.modules;

import audio.parameter.mapping.MapFactory;
import audio.parameter.mapping.MapFactory.MapType;
import flambe.display.Sprite;
import webaudio.synth.ui.controls.NumericControl;
import webaudio.synth.ui.controls.OscSlider;

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
	
	var _osc0Type:Entity;
	var _osc0Level:Entity;
	var _osc0Pan:Entity;
	var _osc0Slide:Entity;
	var _osc0Detune:Entity;
	var _osc0Random:Entity;
	var _osc1Type:Entity;
	var _osc1Level:Entity;
	var _osc1Pan:Entity;
	var _osc1Slide:Entity;
	var _osc1Detune:Entity;
	var _osc1Random:Entity;
	var _oscPhase:Entity;
	
	var _oscPanel:NineSlice;
	
	var owner:Entity;
	
	public var osc0Type		(default, null):OscSlider;
	public var osc0Level	(default, null):Rotary;
	public var osc0Pan		(default, null):Rotary;
	public var osc0Slide	(default, null):Rotary;
	public var osc0Detune	(default, null):Rotary;
	public var osc0Random	(default, null):Rotary;
	
	public var osc1Type		(default, null):OscSlider;
	public var osc1Level	(default, null):Rotary;
	public var osc1Pan		(default, null):Rotary;
	public var osc1Slide	(default, null):Rotary;
	public var osc1Detune	(default, null):Rotary;
	public var osc1Random	(default, null):Rotary;
	
	public var oscPhase		(default, null):Rotary;
	
	
	public function new(owner:Entity, textureAtlas:Map<String,SubTexture>) {
	
		this.owner = owner;
		
		init(owner, textureAtlas);
		
		position(24, 96);		
		
	}
	
	function position(panelX:Float,panelY:Float) {
		
		var rotarySpace = 64;
		var labelY = 192;
		var labelColour = 0x323232;
		var labelAlpha = 0.55;
		var label;
		
		label = Fonts.getField(Fonts.Prime20, "waveform", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX+94; label.y._ = labelY-2;
		
		_oscPanel.x = panelX;
		_oscPanel.y = panelY;
		
		panelY += 42;
		
		_osc0Type.get(Sprite).x._ = panelX+38;
		_osc0Type.get(Sprite).y._ = panelY+12;
		
		panelX += 210;
		
		_osc0Level.get(Sprite).x._ = panelX;
		_osc0Level.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "level", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		_osc0Pan.get(Sprite).x._ = panelX += rotarySpace;
		_osc0Pan.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "pan", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		_osc0Slide.get(Sprite).x._ = panelX += rotarySpace+16;
		_osc0Slide.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "slide", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		_osc0Detune.get(Sprite).x._ = panelX += rotarySpace;
		_osc0Detune.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "detune", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		_osc0Random.get(Sprite).x._ = panelX += rotarySpace;
		_osc0Random.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "random", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		//
		_oscPhase.get(Sprite).x._ = panelX += rotarySpace+rotarySpace/4;
		_oscPhase.get(Sprite).y._ = panelY + 54;
		label = Fonts.getField(Fonts.Prime20, "phase", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY+54;
		//
		
		
		panelX = 24;
		panelY += 96;
		
		_osc1Type.get(Sprite).x._ = panelX+38;
		_osc1Type.get(Sprite).y._ = panelY+12;
		
		panelX += 210;
		
		_osc1Level.get(Sprite).x._ = panelX;
		_osc1Level.get(Sprite).y._ = panelY;
		
		_osc1Pan.get(Sprite).x._ = panelX += rotarySpace;
		_osc1Pan.get(Sprite).y._ = panelY;
		
		_osc1Slide.get(Sprite).x._ = panelX += rotarySpace+16;
		_osc1Slide.get(Sprite).y._ = panelY;
		
		_osc1Detune.get(Sprite).x._ = panelX += rotarySpace;
		_osc1Detune.get(Sprite).y._ = panelY;
		
		_osc1Random.get(Sprite).x._ = panelX += rotarySpace;
		_osc1Random.get(Sprite).y._ = panelY;
		
	}
	
	
	function init(owner:Entity, textureAtlas) {
		
		_osc0Type 	= OscSlider.create('osc0Type');
		_osc0Level 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), .5, 'osc0Level');
		_osc0Pan 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, -1, 1), 0.0, 'osc0Pan');
		_osc0Slide 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0.001, 1), 0.1, 'osc0Slide');
		_osc0Detune = Rotary.create(MapFactory.getMapping(MapType.FLOAT, -200, 200), 0.0, 'osc0Detune');
		_osc0Random = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 100), 0.0, 'osc0Random');
		
		_osc1Type 	= OscSlider.create('osc1Type');
		_osc1Level 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), .5, 'osc1Level');
		_osc1Pan 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, -1, 1), 0.0,'osc1Pan');
		_osc1Slide 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0.001, 1), 0.1, 'osc1Slide');
		_osc1Detune = Rotary.create(MapFactory.getMapping(MapType.FLOAT, -200, 200), 0.0, 'osc1Detune');
		_osc1Random = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 100), 0.0, 'osc1Random');
		
		_oscPhase 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 0.0, 'oscPhase');
		
		_oscPanel 	= NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 8, 8, 616, 192);
		
		owner.addChild(
			new Entity().add(_oscPanel)
				.addChild(_osc0Type).addChild(_osc0Level).addChild(_osc0Pan) .addChild(_osc0Slide).addChild(_osc0Detune).addChild(_osc0Random)
				.addChild(_osc1Type).addChild(_osc1Level).addChild(_osc1Pan).addChild(_osc1Slide).addChild(_osc1Detune).addChild(_osc1Random)
				.addChild(_oscPhase)
		);
		
		osc0Type = cast _osc0Type.get(NumericControl);
		osc0Level = cast _osc0Level.get(NumericControl);
		osc0Pan = cast _osc0Pan.get(NumericControl);		
		osc0Slide = cast _osc0Slide.get(NumericControl);		
		osc0Detune = cast _osc0Detune.get(NumericControl);		
		osc0Random	= cast _osc0Random.get(NumericControl);		
		//
		osc1Type = cast _osc1Type.get(NumericControl);		
		osc1Level = cast _osc1Level.get(NumericControl);
		osc1Pan = cast _osc1Pan.get(NumericControl);
		osc1Slide = cast _osc1Slide.get(NumericControl);
		osc1Detune = cast _osc1Detune.get(NumericControl);
		osc1Random = cast _osc1Random.get(NumericControl);
		
		//
		oscPhase = cast _oscPhase.get(NumericControl);
	}	
}