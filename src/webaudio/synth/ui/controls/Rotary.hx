package webaudio.synth.ui.controls;

import audio.parameter.mapping.MapFactory;
import audio.parameter.mapping.Mapping;
import audio.parameter.ParameterObserver;
import audio.parameter.Parameter;
import flambe.animation.Ease;
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
	
	 var radius		:Float;
	 var minAngle	:Float;
	 var maxAngle	:Float;
	
	var centreX		:Float;
	var centreY		:Float;
	
	var display		:Sprite;
	var knobDot		:Sprite;
	var knobHash	:Sprite;
	var valueLabel	:TextSprite;
	
	public var labelFormatter:Float->String;
	
	
	/**
	 *
	 * @param	controlName
	 * @param	minAngle
	 * @param	maxAngle
	 * @param	radius
	 */
	public function new(name:String, defaultValue:Float, parameterMapping:Mapping, minAngle:Float, maxAngle:Float, radius:Float) {
		super(name, defaultValue, parameterMapping);
		this.minAngle 	= minAngle;
		this.maxAngle 	= maxAngle;
		this.radius 	= radius;
		labelFormatter 	= defaultLabelFormatter;
	}
	
	
	override public function onAdded() {
		
		display = owner.get(Sprite).centerAnchor();		
		centreX = display.anchorX._;
		centreY = display.anchorY._;
		
		var sprites = owner.firstChild;
		
		// knob nipple-dot setup..
		knobDot = sprites.get(Sprite)
			.centerAnchor()
			.disablePixelSnapping()
			.disablePointer();
		
		sprites = sprites.next;
		knobHash = sprites.get(Sprite);
		knobHash.x._ = 6;
		knobHash.y._ = 6;
		knobHash.alpha._ = 0;
		knobHash.setTint(.6, 1.2, 1.8);
		
		// value label
		sprites = sprites.next;
		valueLabel = sprites.get(TextSprite);
		if (Std.is(valueLabel, TextSprite)) {
			valueLabel.centerAnchor();
			valueLabel.y._ = centreY + display.getNaturalHeight() / 2 + 7;
		} else {
			valueLabel = null;
		}
		
		super.onAdded();
	}
	
	override function pointerDown(e:PointerEvent) {
		knobHash.alpha.animateTo(.8, .5, Ease.quadOut);
		super.pointerDown(e);
	}
	
	override function pointerUp(e:PointerEvent) {
		super.pointerUp(e);
		if (doubleClicked) {
			knobHash.alpha._ = 1;
			knobHash.alpha.animateTo(0, 1, Ease.quadOut);
		} else {
			knobHash.alpha.animateTo(0, .5, Ease.quadOut);
		}
		
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
	
	
	/**
	 *
	 * @param	parameterMapping
	 * @param	defaultValue
	 * @param	minAngle
	 * @param	maxAngle
	 * @param	radius
	 * @return
	 */
	public static function create(parameterMapping:Mapping, defaultValue:Float, minAngle:Float=MinRotaryAngle, maxAngle:Float=MaxRotaryAngle, small:Bool=false, showLabel:Bool=true, name:String='Rotary'):Entity {
		
		var textures 	= Main.instance.textureAtlas; 
		var ent 		= new Entity();
		
		ent	.add(new ImageSprite(textures.get('knob_${small?"25":"50"}%')))
			.addChild(new Entity().add(new ImageSprite(textures.get('knob-nipple_50%'))))
			.addChild(new Entity().add(new ImageSprite(textures.get('knob-hash_50%'))));
			
		if (showLabel) ent.addChild(new Entity().add(Fonts.getField(Fonts.Prime13, '0.00', 0x212133)));
		
		ent.add(new Rotary(name, defaultValue, parameterMapping, minAngle, maxAngle, small ? 5.25 : 12));
		
		return ent;
	}
	
	static inline var MaxRotaryAngle:Float = FMath.PI / 1.25;
	static inline var MinRotaryAngle:Float = -MaxRotaryAngle;
}