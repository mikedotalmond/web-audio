package webaudio.synth.ui.modules;

import audio.parameter.mapping.MapFactory;
import flambe.display.NineSlice;
import flambe.display.Sprite;
import flambe.display.SubTexture;
import flambe.Entity;
import flambe.math.FMath;
import webaudio.synth.ui.controls.NumericControl;

import webaudio.synth.ui.controls.Rotary;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class DelayModule {

	var _level		:Entity;
	var _time		:Entity;
	var _feedback	:Entity;
	var _lfpFreq	:Entity;
	var _lfpQ		:Entity;
	
	var _panel		:NineSlice;
	var owner:Entity;
	
	public var level	(default, null):Rotary;
	public var time		(default, null):Rotary;
	public var feedback	(default, null):Rotary;
	public var lfpFreq	(default, null):Rotary;
	public var lfpQ		(default, null):Rotary;
	
	
	public function new(owner:Entity, textureAtlas:Map<String,SubTexture>) {
		this.owner = owner;
		init(owner, textureAtlas);
		position(420, 296);		
	}
	
	
	function init(owner:Entity, textureAtlas) {
		
		_level 		= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 0.25, 'delayLevel');
		_time 		= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0.0001, 1), .333, 'delayTime');
		_feedback 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 0.9999), 0.25, 'delayFeedback');
		_lfpFreq 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 20, 8000), 8000, 'delayLFPFreq');
		_lfpQ 		= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0.0001, 10), 1, 'delayLFPQ');
		
		_panel 		= NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 8, 8, 360, 192);
		
		owner.addChild(
			new Entity().add(_panel)
				.addChild(_level)
				.addChild(_time).addChild(_feedback)
				.addChild(_lfpFreq).addChild(_lfpQ)
		);
		
		level 	= cast _level.get(NumericControl);
		time	= cast _time.get(NumericControl);
		feedback= cast _feedback.get(NumericControl);
		lfpFreq = cast _lfpFreq.get(NumericControl);
		lfpQ 	= cast _lfpQ.get(NumericControl);
	}
	
	
	function position(panelX:Float,panelY:Float) {
		
		var rotarySpace = 64;
		var labelY = panelY+12;
		var labelColour = 0x323232;
		var labelAlpha = 0.55;
		var label;
		
		label = Fonts.getField(Fonts.Prime20, "Delay", labelColour).setAlpha(labelAlpha);
		owner.addChild(new Entity().add(label));
		label.x._ = panelX+12; label.y._ = labelY;
		
		
		_panel.x = panelX;
		_panel.y = panelY;

		panelX += 43;
		panelY += 116;
		labelY = panelY + 54;
		
		_level.get(Sprite).x._ = panelX;
		_level.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "level", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		panelX += rotarySpace;
		_time.get(Sprite).x._ = panelX;
		_time.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "time", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		
		panelX += rotarySpace;
		_feedback.get(Sprite).x._ = panelX;
		_feedback.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "feedback", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		
		panelX += rotarySpace+16;
		_lfpFreq.get(Sprite).x._ = panelX;
		_lfpFreq.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "freq", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		panelX += rotarySpace;
		_lfpQ.get(Sprite).x._ = panelX;
		_lfpQ.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "q", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
	}
}