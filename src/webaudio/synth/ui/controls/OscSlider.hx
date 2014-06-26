package webaudio.synth.ui.controls;

import audio.parameter.mapping.MapFactory;
import audio.parameter.mapping.Mapping;
import flambe.display.ImageSprite;
import flambe.display.Sprite;
import flambe.display.TextSprite;
import flambe.Entity;
import flambe.input.PointerEvent;
import flambe.math.FMath;
import flambe.System;
import webaudio.synth.generator.Oscillator.OscillatorType;

/**
 * ...(X)Slider
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class OscSlider extends NumericControl {
	
	var minX			:Float;
	var maxX			:Float;
	
	var display			:Sprite; //track
	
	var thumb			:Sprite;
	
	var sine			:Sprite;
	var square			:Sprite;
	var sawtooth		:Sprite;
	var triangle		:Sprite;
	
	/**
	 * 
	 * @param	name
	 * @param	defaultValue
	 * @param	parameterMapping
	 */
	public function new(name:String, defaultValue:Float, parameterMapping:Mapping) {
		super(name, defaultValue, parameterMapping);
	}
	
	
	override public function onAdded() {
		
		display = owner.get(Sprite);
		
		var sprites = owner.firstChild;
		
		thumb = sprites.get(Sprite).centerAnchor();
		thumb.y._ = 6;
		//thumb.alpha._ = .5;
		thumb.pointerEnabled = true;
		
		var iconX = -17;
		var iconSpace = 37;
		var iconY = -32;
		
		sprites = sprites.next;
		sine 	= sprites.get(Sprite);
		sine.x._ = iconX;
		sine.y._ = iconY;
		
		iconX += iconSpace;
		sprites = sprites.next;
		square 	= sprites.get(Sprite);
		square.x._ = iconX;
		square.y._ = iconY-2;
		
		iconX += iconSpace;
		sprites = sprites.next;
		sawtooth = sprites.get(Sprite);
		sawtooth.x._ = iconX+1;
		sawtooth.y._ = iconY;
		
		iconX += iconSpace;
		sprites = sprites.next;
		triangle = sprites.get(Sprite);
		triangle.x._ = iconX+1;
		triangle.y._ = iconY-1;
		
		minX = 0;
		maxX = display.getNaturalWidth();
		
		
		thumb.pointerDown.connect(pointerDown);
		value.addObserver(this, true);
	}
	
	override function pointerMove(e:PointerEvent) {
		
		if (e.viewX != pX || e.viewY != pY) {
		
			var dX = pX - e.viewX;
			var dY = pY - e.viewY;
			
			pX = e.viewX; pY = e.viewY;
			
			pointerHasMoved = true;
			lastTime 		= 0;
			
			dragDelta(dX, dY);
		}
	}
	
	override function dragDelta(dX:Float, dY:Float) {
		var val = value.getValue(true) - dX/display.getNaturalWidth();
		value.setValue(val > 1 ? 1 : (val < 0 ? 0 : val), true);
	}
	
	
	// triggered onParameterChange
	override function updateDisplay() {
		setPosition(Math.round(value.getValue()));
	}
	
	/**
	 * @param	value (normalised position value)
	 */
	inline function setPosition(value:Int) {
		
		sine.setTint(1,1,1);
		square.setTint(1,1,1);
		sawtooth.setTint(1,1,1);
		triangle.setTint(1,1,1);
		
		switch(value) {
			case OscillatorType.SINE: sine.setTint(1.2,1.52,1.66);
			case OscillatorType.SQUARE: square.setTint(1.2,1.52,1.66);
			case OscillatorType.SAWTOOTH: sawtooth.setTint(1.2,1.52,1.66);
			case OscillatorType.TRIANGLE: triangle.setTint(1.2,1.52,1.66);
		}
		
		var px 		= value / 3 * display.getNaturalWidth();
		thumb.x._	= px;
	}
	
	
	/**
	 *
	 * @param	name
	 * @return
	 */
	public static function create(name:String='Slider'):Entity {
		
		var textures 	= Main.instance.textureAtlas;
		var ent 		= new Entity();
		
		ent	.add(new ImageSprite(textures.get('OscSliderTrack')))
			.addChild(new Entity().add(new ImageSprite(textures.get('slider-thumb_50%'))))
			.addChild(new Entity().add(new ImageSprite(textures.get('Icon_Sine')).disablePointer()))
			.addChild(new Entity().add(new ImageSprite(textures.get('Icon_Square')).disablePointer()))
			.addChild(new Entity().add(new ImageSprite(textures.get('Icon_Sawtooth')).disablePointer()))
			.addChild(new Entity().add(new ImageSprite(textures.get('Icon_Triangle')).disablePointer()));
		
		ent.add(new OscSlider(name, 0, MapFactory.getMapping(MapType.INT, OscillatorType.SINE, OscillatorType.TRIANGLE)));
		
		return ent;
	}
	
}