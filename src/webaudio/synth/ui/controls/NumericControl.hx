package webaudio.synth.ui.controls;
import audio.parameter.mapping.Mapping;
import audio.parameter.Parameter;
import audio.parameter.ParameterObserver;
import flambe.Component;
import flambe.display.Sprite;
import flambe.display.TextSprite;
import flambe.input.Key;
import flambe.input.PointerEvent;
import flambe.System;
import flambe.util.SignalConnection;

/**
 * Base for numeric input types; rotary knob, slider, etc.
 *
 * Uses Parameter, provides delta mouse drag (x/y) values for the control.
 * Ctrl-click-drag to increase accuracy,
 * Double-click to reset to default value
 *
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class NumericControl extends Component implements ParameterObserver {

	public var value(default, null):Parameter;
	
	// pointer related
	var pointerHasMoved	:Bool = false;
	var lastTime		:Float = 0.0;
	var pX				:Float = .0;
	var pY				:Float = .0;
	var moveConnection	:SignalConnection = null;
	
	var returningToDefault	:Bool = false;
	
	// return to default once user releases control?
	public var returnToDefault		:Bool = false;
	public var returnToDefaultSpeed	:Float = 16;
	public var returnToDefaultMin	:Float = 1e-6; // min abs normalised value
	
	public var normalAccuracy 	= 0.01;
	public var highAccuracy 	= 0.001;
	
	public var labelFormatter:Float->String;
	
	
	
	/**
	 *
	 * @param	name
	 * @param	defaultValue
	 * @param	parameterMapping
	 */
	public function new(name:String, defaultValue:Float, parameterMapping:Mapping) {
		value 			= new Parameter(name, defaultValue, parameterMapping);
		labelFormatter 	= defaultLabelFormatter;
	}
	
	
	override public function onAdded() {
		var display = owner.get(Sprite);
		display.pointerDown.connect(pointerDown);
		value.addObserver(this, true);
	}
	
	
	override public function onUpdate(dt:Float) {
		if (returningToDefault) {
			
			var now 	= value.getValue(true);
			var delta	= value.normalisedDefaultValue - now;
			
			delta = (delta < 0 ? -delta : delta) < returnToDefaultMin ? 0 : delta;
			
			if (delta != 0) {
				value.setValue(now + delta * dt * returnToDefaultSpeed, true);
			} else {
				returningToDefault = false;
				value.setToDefault();
			}
		}
	}
	
	
	override public function onRemoved() {
		value.removeObserver(this);
	}
	
	
	function pointerDown(e:PointerEvent) {
		pointerHasMoved = returningToDefault = false;
		pX = e.viewX; pY = e.viewY;
		
		if (moveConnection != null) moveConnection.dispose();
		moveConnection = System.pointer.move.connect(pointerMove);
		
		System.pointer.up.connect(pointerUp).once();
	}
	
	function pointerMove(e:PointerEvent) {
		
		// hmm. something has changed (in Chrome at least) - mouse-down fires off a mosue-move immediately afterward, without moving...
		
		if (e.viewX != pX || e.viewY != pY) {
		
			var dX = pX - e.viewX;
			var dY = pY - e.viewY;
			
			pX = e.viewX; pY = e.viewY;
			
			pointerHasMoved = true;
			lastTime 		= 0;
			
			var accuracy = System.keyboard.isDown(Key.Control);
			
			dX *= (accuracy ? highAccuracy : normalAccuracy);
			dY *= (accuracy ? highAccuracy : normalAccuracy);
			
			dragDelta(dX, dY);
		}
	}
	
	// override if needed in subclasses....
	function dragDelta(dX:Float, dY:Float) {
		var val = value.getValue(true) + dY;
		value.setValue(val > 1 ? 1 : (val < 0 ? 0 : val), true);
	}
	
	function doubleClicked() {
		value.setValue(value.defaultValue);
	}
	
	function pointerUp(e:PointerEvent) {
		
		if (moveConnection != null) {
			moveConnection.dispose();
			moveConnection = null;
		}
		
		// test for double click (if no movement between 2 clicks, that fall within .5 seconds of each other)
		if (!pointerHasMoved) {
			var t = System.time;
			var dt = t - lastTime;
			if (dt < .5) doubleClicked();
			lastTime = t;
		} else if(returnToDefault) {
			returningToDefault = true;
		}
	}
	
	
	public function defaultLabelFormatter(value:Float):String {
		return NumericControl.roundValueForDisplay(value, 3);
	}
	
	
	/* INTERFACE audio.parameter.ParameterObserver */
	public function onParameterChange(p:Parameter):Void {
		if (p == value) updateDisplay();
	}
	
	
	/**
	 * Called when the value Parameter changes - implement in subclasses
	 */
	function updateDisplay() { }
	
	
	public static function roundValueForDisplay(value:Float, sigfig:Int):String {
		
		if (sigfig < 1) sigfig = 1;
		if (sigfig > 8) sigfig = 8;
		
		var e  = Math.pow(10, sigfig);
		var vr = Math.round(value * e) / e;
		var vs = '${vr}';
		
		if (sigfig > 1 && vs.indexOf('.') == -1) vs = '${vr}.0';
		
		return vs;
	}
}