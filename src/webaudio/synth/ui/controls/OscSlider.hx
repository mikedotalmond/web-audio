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
 * ...(X)Slider
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class OscSlider extends NumericControl {
	
	var minX			:Float;
	var maxX			:Float;
	
	var display			:Sprite; //track
	var knobHash		:Sprite;
	
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
		thumb.pointerEnabled = true;
		thumb.y._ = 6;
		
		sprites = sprites.next;
		knobHash= sprites.get(Sprite).centerAnchor();
		knobHash.y._ = 3;
		knobHash.alpha._ = 0;
		//knobHash.setTint(.6, 1.2, 1.8);
		
		var iconX = -17;
		var iconSpace = 37;
		var iconY = -32;
		
		sprites = sprites.next;
		sine 	= sprites.get(Sprite);
		sine.x._ = iconX;
		sine.y._ = iconY;
		sine.alpha._ = .5;
		
		iconX += iconSpace;
		sprites = sprites.next;
		square 	= sprites.get(Sprite);
		square.x._ = iconX;
		square.y._ = iconY - 2;
		square.alpha._ = .5;
		
		iconX += iconSpace;
		sprites = sprites.next;
		sawtooth = sprites.get(Sprite);
		sawtooth.x._ = iconX+1;
		sawtooth.y._ = iconY;
		sawtooth.alpha._ = .5;
		
		iconX += iconSpace;
		sprites = sprites.next;
		triangle = sprites.get(Sprite);
		triangle.x._ = iconX+1;
		triangle.y._ = iconY - 1;
		triangle.alpha._ = .5;
		
		minX = 0;
		maxX = display.getNaturalWidth();
		
		thumb.pointerDown.connect(pointerDown);
		super.onAdded();
	}
	
	override function pointerDown(e:PointerEvent) {
		knobHash.alpha.animateTo(1, .5, Ease.quadOut);
		super.pointerDown(e);
	}
	
	override function pointerUp(e:PointerEvent) {
		knobHash.alpha.animateTo(0, .5, Ease.quadOut);
		super.pointerUp(e);
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
		var val = value.getValue(true) - dX / display.getNaturalWidth();
		value.setValue(val > 1 ? 1 : (val < 0 ? 0 : val), true);
	}
	
	
	// triggered onParameterChange
	override function updateDisplay() {
		setPosition(Math.round(value.getValue()));
	}
	
	
	function getIcon(type:Int):Sprite {
		return switch(type) {
			case OscillatorType.SINE	: sine;
			case OscillatorType.SQUARE	: square;
			case OscillatorType.SAWTOOTH: sawtooth;
			case OscillatorType.TRIANGLE: triangle;
			default						: null;
		}
	}
	
	var lastPosition:Int = -1;
	
	/**
	 * @param	value (normalised position value)
	 */
	inline function setPosition(value:Int) {
		
		if (lastPosition != -1) {
			//getIcon(lastPosition).setTint(1, 1, 1, .5, Ease.quartOut);
			getIcon(lastPosition).alpha.animateTo(.5, .5, Ease.quartOut);
		}
		
		//getIcon(value).setTint(1.2, 1.52, 1.66, .25, Ease.quadOut);
		getIcon(value).alpha.animateTo(1, .25, Ease.quadOut);
		
		var px = value / 3 * display.getNaturalWidth();
		thumb.x.animateTo(px, .1, Ease.quadOut);
		knobHash.x.animateTo(px, .1, Ease.quadOut);
		
		lastPosition = value;
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
			.addChild(new Entity().add(new ImageSprite(textures.get('knob-hash_25%')).disablePointer()))
			.addChild(new Entity().add(new ImageSprite(textures.get('Icon_Sine')).disablePointer()))
			.addChild(new Entity().add(new ImageSprite(textures.get('Icon_Square')).disablePointer()))
			.addChild(new Entity().add(new ImageSprite(textures.get('Icon_Sawtooth')).disablePointer()))
			.addChild(new Entity().add(new ImageSprite(textures.get('Icon_Triangle')).disablePointer()));
		
		ent.add(new OscSlider(name, 0, MapFactory.getMapping(MapType.INT, OscillatorType.SINE, OscillatorType.TRIANGLE)));
		
		return ent;
	}
	
}