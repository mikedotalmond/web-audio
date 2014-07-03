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
class DistortionModule {

	var _pregain			:Entity;
	var _waveshaperAmount	:Entity;
	var _bits				:Entity;
	var _rateReduction		:Entity;
	
	var _panel				:NineSlice;
	var owner				:Entity;
	
	
	public var pregain			(default, null):Rotary;
	public var waveshaperAmount	(default, null):Rotary;
	public var bits				(default, null):Rotary;
	public var rateReduction	(default, null):Rotary;
	
	
	public function new(owner:Entity, textureAtlas:Map<String,SubTexture>) {
		this.owner = owner;
		init(owner, textureAtlas);
		position(937, 96);		
	}
	
	
	function init(owner:Entity, textureAtlas) {
		
		_pregain 			= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 12), 0.0, 'distortionPregain');
		_waveshaperAmount 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, -0.999, 0.999), 0.0, 'distortionWaveshaperAmount');
		_bits 				= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 1, 24), 12, 'distortionBits');
		_rateReduction 		= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 1, 16), 1, 'distortionRateReduction');
		
		_panel 				= NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 8, 8, 272, 192);
		
		owner.addChild(
			new Entity().add(_panel)
				.addChild(_pregain)
				.addChild(_waveshaperAmount)
				.addChild(_bits)
				.addChild(_rateReduction)
		);
		
		pregain 		= cast _pregain.get(NumericControl);
		waveshaperAmount= cast _waveshaperAmount.get(NumericControl);
		bits 			= cast _bits.get(NumericControl);
		rateReduction 	= cast _rateReduction.get(NumericControl);
	}	
	
	
	function position(panelX:Float,panelY:Float) {
		
		var rotarySpace = 64;
		var labelY = panelY+12;
		var labelColour = 0x323232;
		var labelAlpha = 0.55;
		var label;
		
		label = Fonts.getField(Fonts.Prime20, "Distortion", labelColour).setAlpha(labelAlpha);
		owner.addChild(new Entity().add(label));
		label.x._ = panelX+12; label.y._ = labelY;
		
		_panel.x = panelX;
		_panel.y = panelY;

		panelX += 43;
		panelY += 116;
		labelY = panelY + 54;
		
		_pregain.get(Sprite).x._ = panelX;
		_pregain.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "gain", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		panelX += rotarySpace;
		
		_waveshaperAmount.get(Sprite).x._ = panelX;
		_waveshaperAmount.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "shape", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		panelX += rotarySpace;
		
		_bits.get(Sprite).x._ = panelX;
		_bits.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "crush", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
		panelX += rotarySpace;
		
		_rateReduction.get(Sprite).x._ = panelX;
		_rateReduction.get(Sprite).y._ = panelY;
		label = Fonts.getField(Fonts.Prime20, "reduce", labelColour).setAlpha(labelAlpha).centerAnchor();
		owner.addChild(new Entity().add(label));
		label.x._ = panelX; label.y._ = labelY;
		
	}
}