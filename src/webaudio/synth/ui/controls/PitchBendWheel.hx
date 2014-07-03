package webaudio.synth.ui.controls;

import audio.parameter.mapping.MapFactory;
import audio.parameter.mapping.Mapping;
import flambe.animation.Ease;
import flambe.display.ImageSprite;
import flambe.display.Sprite;
import flambe.display.TextSprite;
import flambe.Entity;
import flambe.input.PointerEvent;
import flambe.math.FMath;
import flambe.math.Rectangle;
import flambe.System;
import webaudio.synth.generator.Oscillator.OscillatorType;

/**
 * PitchBendWheel
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class PitchBendWheel extends NumericControl {
	
	var minY			:Float;
	var thumbRange		:Float;
	
	var display			:Sprite; //track
	var thumb			:Sprite;
	
	/**
	 * 
	 * @param	name
	 * @param	defaultValue
	 * @param	parameterMapping
	 */
	public function new(name:String, defaultValue:Float, parameterMapping:Mapping) {
		super(name, defaultValue, parameterMapping);
		normalAccuracy = 1;
		highAccuracy = .5;
		minY = 20;
	}
	
	
	override public function onAdded() {
		var display = owner.get(Sprite);
		
		thumbRange = display.getNaturalHeight() - minY - minY;
		
		var sprites = owner.firstChild;
		
		thumb = sprites.get(Sprite);
		thumb.x._ = 6;
		thumb.anchorY._ = thumb.getNaturalHeight() / 2;
		
		super.onAdded();		
	}
	
	override function dragDelta(dX:Float, dY:Float) {
		var val = value.getValue(true) - dY / thumbRange;
		value.setValue(val > 1 ? 1 : (val < 0 ? 0 : val), true);
	}
	
	
	// triggered onParameterChange
	override function updateDisplay() {
		setPosition(value.getValue(true));
	}
	
	/**
	 * @param	value (normalised position value)
	 */
	inline function setPosition(value:Float) {
		var py = minY + value * thumbRange;
		thumb.x._ = 5;
		thumb.y.animateTo(py, .1, Ease.quadOut);
	}
	
	
	/**
	 *
	 * @param	name
	 * @return
	 */
	public static function create(name:String='Slider'):Entity {
		
		var textures 	= Main.instance.textureAtlas;
		var ent 		= new Entity();
		
		ent	.add(new ImageSprite(textures.get('PitchBendBg')))
			.addChild(new Entity().add(new ImageSprite(textures.get('PitchBendDrag'))));
			
		ent.add(new PitchBendWheel(name, 0, MapFactory.getMapping(MapType.FLOAT,-1,1)));
		
		return ent;
	}
	
}