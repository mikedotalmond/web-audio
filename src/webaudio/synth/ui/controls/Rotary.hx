package webaudio.synth.ui.controls;

import audio.parameter.mapping.MapFactory;
import audio.parameter.mapping.Mapping;
import audio.parameter.ParameterObserver;
import audio.parameter.Parameter;
import flambe.display.Sprite;
import flambe.display.ImageSprite;
import flambe.display.TextSprite;
import flambe.Entity;
import flambe.input.Key;
import flambe.input.PointerEvent;
import flambe.math.FMath;
import flambe.System;
import flambe.util.SignalConnection;
import math.FloatRange;
import webaudio.Main;
import webaudio.synth.ui.Fonts;

import flambe.Component;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond - https://github.com/MadeByPi
 */

class Rotary extends NumericControl {
	
	public var radius			:Float;
	public var minAngle			:Float;
	public var maxAngle			:Float;
	
	public var labelFormatter	:Float->String;
	var centreX			:Float;
	var centreY			:Float;
	
	var display			:Sprite;
	var knobDot			:Sprite;
	var valueLabel		:TextSprite;
	
	
	/**
	 *
	 * @param	controlName
	 * @param	minAngle
	 * @param	maxAngle
	 * @param	radius
	 */
	public function new(defaultValue:Float, parameterMapping:Mapping, minAngle:Float, maxAngle:Float, radius:Float) {
		super('rotary', defaultValue, parameterMapping);
		this.minAngle 	= minAngle;
		this.maxAngle 	= maxAngle;
		this.radius 	= radius;
		labelFormatter 	= defaultLabelFormatter;
	}
	
	
	override public function onAdded() {
		
		display = owner.get(Sprite).centerAnchor();		
		centreX = display.anchorX._;
		centreY = display.anchorY._;
		
		// knob nipple-dot setup..
		knobDot = owner.firstChild.get(Sprite)
			.centerAnchor()
			.disablePixelSnapping()
			.disablePointer();
		
		// value label
		valueLabel = owner.firstChild.next.get(TextSprite);
		if (Std.is(valueLabel, TextSprite)) {
			valueLabel.centerAnchor();
			valueLabel.y._ = centreY + display.getNaturalHeight() / 2 + 7;
		} else {
			valueLabel = null;
		}
		
		super.onAdded();
	}
	
	
	// triggered onParameterChange
	override function updateDisplay() {
		setKnobPosition(value.getValue(true));
		updateLabel();
	}
	
	
	inline function updateLabel() {
		if (valueLabel != null) {
			valueLabel.text = labelFormatter(value.getValue());
			valueLabel.centerAnchor();
			valueLabel.x._ = centreX;
		}
	}
	
	
	/**
	 * @param	value (normalised position value)
	 */
	inline function setKnobPosition(value:Float) {
		
		if (value > 1) value = 1;
		if (value < 0) value = 0;
		
		var range 	= Math.abs(maxAngle - minAngle);
		var angle 	= minAngle + value * range;
		
		var px 		= centreX + Math.cos(angle - FMath.PI / 2) * radius;
		var py 		= centreY + Math.sin(angle - FMath.PI / 2) * radius;
		
		knobDot.setXY(px, py);
	}
	
	
	public function defaultLabelFormatter(value:Float):String {
		return NumericControl.roundValueForDisplay(value, 3);
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
	public static function create(parameterMapping:Mapping, defaultValue:Float, minAngle:Float, maxAngle:Float, small:Bool=false, showLabel:Bool=true):Entity {
		
		var textures = Main.instance.textureAtlas;
		var ent = new Entity();
		
		ent	.add(new ImageSprite(textures.get('knob_${small?"25":"50"}%')))
			.addChild(new Entity().add(new ImageSprite(textures.get('knob-nipple_50%'))));
			
		if (showLabel) ent.addChild(new Entity().add(Fonts.getField(Fonts.Prime13, '0.00', 0x212133)));
		
		ent.add(new Rotary(defaultValue, parameterMapping, minAngle, maxAngle, small ? 5.25 : 12));
		
		return ent;
	}
}