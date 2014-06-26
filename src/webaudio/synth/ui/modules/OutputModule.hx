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

class OutputModule {
	
	var _outputLevel:Entity;
	var _pitchBend	:Entity;
	var _panel		:Entity;
	
	public var outputLevel	(default, null):Rotary;
	public var pitchBend	(default, null):Rotary;

	public function new(owner:Entity, textureAtlas:Map<String,SubTexture>) {
		
		// panel ui test...
		_outputLevel 	= Rotary.create(MapFactory.getMapping(MapType.FLOAT, 0, 1), 1.0, 'outputLevel');
		_pitchBend 		= Rotary.create(MapFactory.getMapping(MapType.FLOAT, -1, 1), 0.0, 'pitchBend');
	
		owner.addChild(
			(_panel = new Entity().add(NineSlice.fromSubTexture(textureAtlas.get('InnerPanelBg'), 16, 16, 152, 192/2)))
				.addChild(_outputLevel)
				.addChild(_pitchBend)
		);
		
		outputLevel = cast _outputLevel.get(NumericControl);
		pitchBend 	= cast _pitchBend.get(NumericControl);
		
		var panelX 	= 23;
		var panelY 	= 296;
		
		_panel.get(NineSlice).x = panelX;
		_panel.get(NineSlice).y = panelY;
		
		panelY += 42;
		
		_pitchBend.get(Sprite).x._ = panelX + 40;
		_pitchBend.get(Sprite).y._ = panelY;
		
		_outputLevel.get(Sprite).x._ = panelX + 108;
		_outputLevel.get(Sprite).y._ = panelY;
	}
}