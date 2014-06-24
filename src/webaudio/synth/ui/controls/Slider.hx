package webaudio.synth.ui.controls;

import audio.parameter.mapping.Mapping;
import flambe.display.ImageSprite;
import flambe.display.Sprite;
import flambe.display.TextSprite;
import flambe.display.ThreeSliceX;
import flambe.Entity;
import flambe.math.FMath;

/**
 * ...(X)Slider
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class Slider extends NumericControl {
	
	var minX			:Float;
	var maxX			:Float;
	
	var labelFormatter	:Float->String;
	
	
	var display			:ThreeSliceX;
	var track			:Sprite;
	var thumb			:Sprite;
	
	var valueLabel		:TextSprite;
	
	/**
	 * 
	 * @param	name
	 * @param	defaultValue
	 * @param	parameterMapping
	 */
	public function new(name:String, defaultValue:Float, parameterMapping:Mapping) {
		super(name, defaultValue, parameterMapping);
		labelFormatter 	= defaultLabelFormatter;
	}
	
	
	override public function onAdded() {
		
		display = owner.get(ThreeSliceX);
		
		var sprites = owner.firstChild;
		
		thumb = sprites.get(Sprite).centerAnchor().disablePixelSnapping();
		
		minX = 0;
		maxX = display.width;
		
		// value label
		sprites = sprites.next;
		if (sprites != null) { 
			valueLabel = sprites.get(TextSprite);
			if (valueLabel != null && Std.is(valueLabel, TextSprite)) {
				valueLabel.centerAnchor();
			} else {
				valueLabel = null;
			}
		}
		
		super.onAdded();
	}
	
	
	// triggered onParameterChange
	override function updateDisplay() {
		setPosition(value.getValue(true));
		updateLabel();
	}
	
	
	inline function updateLabel() {
		if (valueLabel != null) {
			valueLabel.text = labelFormatter(value.getValue());
			valueLabel.centerAnchor();
			//valueLabel.x._ = centreX;
		}
	}
	
	
	/**
	 * @param	value (normalised position value)
	 */
	inline function setPosition(value:Float) {
		
		value = value < 0 ? 0 : (value > 1 ? 1 : value);
		
		var px 		= value * display.width; 
		
		thumb.x._	= px;
	}
	
	
	/**
	 *
	 * @param	parameterMapping
	 * @param	defaultValue
	 * @param	minAngle
	 * @param	maxAngle
	 * @param	radius
	 * @return
	 */
	public static function create(parameterMapping:Mapping, defaultValue:Float, small:Bool=false, showLabel:Bool=false, name:String='Slider'):Entity {
		
		var textures 	= Main.instance.textureAtlas;
		var ent 		= new Entity();
		
		ent	.add(ThreeSliceX.fromSubTexture(textures.get('slider-track_${small?"25":"50"}%')))
			.addChild(new Entity().add(new ImageSprite(textures.get('slider-thumb_${small?"25":"50"}%'))));
			
		if (showLabel) ent.addChild(new Entity().add(Fonts.getField(Fonts.Prime13, '0.00', 0x212133)));
		
		ent.add(new Slider(name, defaultValue, parameterMapping));
		
		return ent;
	}
	
}