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
 * Uses Parameter, rovides delta mouse drag (x/y) values for the control.
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
	
	
	/**
	 *
	 * @param	name
	 * @param	defaultValue
	 * @param	parameterMapping
	 */
	public function new(name:String, defaultValue:Float, parameterMapping:Mapping) {
		value = new Parameter('${name}_value', defaultValue, parameterMapping);
	}
	
	override public function onAdded() {
		var display = owner.get(Sprite);
		display.pointerDown.connect(pointerDown);
		value.addObserver(this, true);
	}
	
	override public function onRemoved() {
		value.removeObserver(this);
	}
	
	
	function pointerDown(e:PointerEvent) {
		pointerHasMoved = false;
		pX = e.viewX; pY = e.viewY;
		
		if (moveConnection != null) moveConnection.dispose();
		moveConnection = System.pointer.move.connect(pointerMove);
		
		System.pointer.up.connect(pointerUp).once();
	}
	
	
	function pointerMove(e:PointerEvent) {
		
		lastTime 		= 0;
		pointerHasMoved	= true;
		
		var dX = pX - e.viewX;
		var dY = pY - e.viewY;
		pX = e.viewX; pY = e.viewY;
		
		var accuracy = System.keyboard.isDown(Key.Control);
		
		dX *= (accuracy ? .001 : .01);
		dY *= (accuracy ? .001 : .01);
		
		dragDelta(dX, dY);
	}
	
	
	function dragDelta(dX:Float, dY:Float) {
		var val = value.getValue(true) + dY;
		value.setValue(val > 1 ? 1 : (val < 0 ? 0 : val));
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
			if (dt < .5) value.setValue(value.defaultValue);
			lastTime = t;
		}
	}
	
	/* INTERFACE audio.parameter.ParameterObserver */
	public function onParameterChange(p:Parameter):Void {
		if (p == value) updateDisplay();
	}
	
	function updateDisplay() {
		// implement in subclasses
	}
	
	
	//TODO:move elsewhere
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