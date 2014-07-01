package webaudio.synth.ui.modules;
import audio.parameter.mapping.MapFactory;
import flambe.display.ImageSprite;
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
class ADSRModule {

	var _attack	:Entity;
	var _decay	:Entity;
	var _sustain:Entity;
	var _release:Entity;
	
	var _panel	:NineSlice;
	var _diagram:flambe.display.ImageSprite;
	var owner:Entity;
	
	
	public var attack		(default, null):Rotary;
	public var decay		(default, null):Rotary;
	public var sustain		(default, null):Rotary;
	public var release		(default, null):Rotary;
	
	
	public function new(owner:Entity, textureAtlas:Map<String,SubTexture>) {
		
		init(owner, textureAtlas);
		
		position(651, 96);		
	}
	
	function init(owner:Entity, textureAtlas) {
		this.owner = owner;
		
		_attack = Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 10), .1, 'adsrAttack');
		_decay 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 10), 1.0, 'adsrDecay');
		_sustain= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 1.0, 'adsrSustain');
		_release= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 10), 0.25, 'adsrRelease');
		
		_panel 	= NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 8, 8, 280, 192);
		
		_diagram = new ImageSprite(textureAtlas.get('ADSRDiagram'));
		
		owner.addChild(
			new Entity().add(_panel)
				.addChild(_attack)
				.addChild(_decay)
				.addChild(_sustain)
				.addChild(_release)
				.addChild(new Entity().add(_diagram))
		);
		
		attack = cast _attack.get(NumericControl);		
		decay = cast _decay.get(NumericControl);		
		sustain = cast _sustain.get(NumericControl);		
		release = cast _release.get(NumericControl);
	}	
	
	
	function position(panelX:Float,panelY:Float) {
		
		var rotarySpace = 64;
		var labelY = panelY+22;
		var labelColour = 0x323232;
		var labelAlpha = 0.55;
		var label;
		
		label = Fonts.getField(Fonts.Prime20, "AEG", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX+28; label.y._ = labelY;
		
		
		_panel.x = panelX;
		_panel.y = panelY;

		panelX += 43;
		panelY += 116;
		labelY = panelY + 54;
		
		_diagram.x._ = panelX;
		_diagram.y._ = panelY-84;
		
		_attack.get(Sprite).x._ = panelX;
		_attack.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "attack", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		_decay.get(Sprite).x._ = panelX += rotarySpace;
		_decay.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "decay", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		_sustain.get(Sprite).x._ = panelX += rotarySpace;
		_sustain.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "sustain", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		_release.get(Sprite).x._ = panelX += rotarySpace;
		_release.get(Sprite).y._ = panelY;	
		label = Fonts.getField(Fonts.Prime20, "release", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
	}
}