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
class ADSRModule {

	var _attack	:Entity;
	var _decay	:Entity;
	var _sustain:Entity;
	var _release:Entity;
	
	var _panel	:NineSlice;
	
	
	public var attack		(default, null):Rotary;
	public var decay		(default, null):Rotary;
	public var sustain		(default, null):Rotary;
	public var release		(default, null):Rotary;
	
	
	public function new(owner:Entity, textureAtlas:Map<String,SubTexture>) {
		
		init(owner, textureAtlas);
		
		position(648, 96);		
	}
	
	function position(panelX:Float,panelY:Float) {
		
		var rotarySpace = 64;
		
		_panel.x = panelX;
		_panel.y = panelY;

		panelX += 43;
		panelY += 132;
		
		_attack.get(Sprite).x._ = panelX;
		_attack.get(Sprite).y._ = panelY;
		
		_decay.get(Sprite).x._ = panelX += rotarySpace;
		_decay.get(Sprite).y._ = panelY;
		
		_sustain.get(Sprite).x._ = panelX += rotarySpace;
		_sustain.get(Sprite).y._ = panelY;
		
		_release.get(Sprite).x._ = panelX += rotarySpace;
		_release.get(Sprite).y._ = panelY;		
	}
	
	function init(owner:Entity, textureAtlas) {
		
		_attack = Rotary.create(MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL, 0, 1), .1, 'adsrAttack');
		_decay 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL, 0, 1), 1.0, 'adsrDecay');
		_sustain= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 1.0, 'adsrSustain');
		_release= Rotary.create(MapFactory.getMapping(MapType.FLOAT_EXPONENTIAL, 0, 1), 0.25, 'adsrRelease');
		
		_panel 	= NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 8, 8, 280, 192);
		
		owner.addChild(
			new Entity().add(_panel)
				.addChild(_attack)
				.addChild(_decay)
				.addChild(_sustain)
				.addChild(_release)
		);
		
		attack = _attack.get(Rotary);		
		decay = _decay.get(Rotary);		
		sustain = _sustain.get(Rotary);		
		release = _release.get(Rotary);
	}	
}