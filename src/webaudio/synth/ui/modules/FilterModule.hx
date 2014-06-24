package webaudio.synth.ui.modules;
import audio.parameter.mapping.MapFactory;
import flambe.display.NineSlice;
import flambe.display.Sprite;
import flambe.display.SubTexture;
import flambe.Entity;
import flambe.math.FMath;
import webaudio.synth.ui.controls.Rotary;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class FilterModule {

	
	var _attack		:Entity;
	var _release	:Entity;
	var _range		:Entity;
	
	var _type		:Entity;
	var _frequency	:Entity;
	var _Q			:Entity;
	
	var _panel		:NineSlice;
	
	
	public var type			(default, null):Rotary;
	public var frequency	(default, null):Rotary;
	public var Q			(default, null):Rotary;
	
	public var attack		(default, null):Rotary;
	public var release		(default, null):Rotary;
	public var range		(default, null):Rotary;
	
	
	public function new(owner:Entity, textureAtlas:Map<String,SubTexture>) {
		
		init(owner, textureAtlas);
		
		position(700, 312);		
	}
	
	function position(panelX:Float,panelY:Float) {
		
		var rotarySpace = 64;
		
		_panel.x = panelX;
		_panel.y = panelY;

		panelX += 61;
		panelY += 132;
		
		_type.get(Sprite).x._ = panelX;
		_type.get(Sprite).y._ = panelY;
		
		panelX += rotarySpace;
		
		_frequency.get(Sprite).x._ = panelX;
		_frequency.get(Sprite).y._ = panelY;
		
		panelX += rotarySpace;
		
		_Q.get(Sprite).x._ = panelX;
		_Q.get(Sprite).y._ = panelY;
		
		panelX += 16;
		panelX += rotarySpace;
		
		_attack.get(Sprite).x._ = panelX;
		_attack.get(Sprite).y._ = panelY;
		
		panelX += rotarySpace;
		
		_release.get(Sprite).x._ = panelX;
		_release.get(Sprite).y._ = panelY;
		
		panelX += rotarySpace;
		
		_range.get(Sprite).x._ = panelX;
		_range.get(Sprite).y._ = panelY;		
	}
	
	function init(owner:Entity, textureAtlas) {
		
		_type 		= Rotary.create(MapFactory.getMapping(MapType.INT, 0, 1), 0, 'filterType');
		_frequency 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL, 20, 8000), 8000.0, 'filterFrequency');
		_Q 			= Rotary.create(MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL, 0.0001, 128), 1.0, 'filterQ');
		
		_attack 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL, 0, 1), 0.25, 'filterAttack');
		_release 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL, 0, 1), 0.5, 'filterRelease');
		_range	 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL, 0, 1), 0.0, 'filterRange');
		
		_panel 		= NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 8, 8, 470, 192);
		
		owner.addChild(
			new Entity().add(_panel)
				.addChild(_type)
				.addChild(_frequency)
				.addChild(_Q)
				.addChild(_attack)
				.addChild(_release)
				.addChild(_range)
		);
		
		type 		= _type.get(Rotary);
		frequency 	= _frequency.get(Rotary);
		Q 			= _Q.get(Rotary);
		
		attack 		= _attack.get(Rotary);		
		release 	= _release.get(Rotary);		
		range 		= _range.get(Rotary);
	}	
	
}