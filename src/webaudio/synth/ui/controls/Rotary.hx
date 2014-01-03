package webaudio.synth.ui.controls;

import audio.parameter.ParameterObserver;
import audio.parameter.Parameter;
import flambe.display.Sprite;
import flambe.input.PointerEvent;
import flambe.math.FMath;
import flambe.System;
import flambe.util.SignalConnection;

import flambe.Component;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond - https://github.com/MadeByPi
 */
class Rotary extends Component implements ParameterObserver {
	
	var radius:Float;
	var minAngle:Float;
	var maxAngle:Float;
	
	var cx:Float;
	var cy:Float;
	
	public function new(minAngle:Float, maxAngle:Float, radius:Float) {
		this.minAngle 	= minAngle;
		this.maxAngle 	= maxAngle;
		this.radius 	= radius;
	}
	
	override public function onAdded() {
		
		var display = owner.get(Sprite);
		
		// align knob...
		display.centerAnchor();
		cx = display.anchorX._;
		cy = display.anchorY._;
		
		// align knob nipple... and disable mouse/touch on it...
		owner.firstChild.get(Sprite)
			.centerAnchor()
			.disablePixelSnapping()
			.disablePointer();
		
		var moveConnection:SignalConnection = null;
		var uiRoot = System.root.get(Sprite); // the bg FillSprite
		
		var dy = .0;
		display.pointerDown.connect(function(e:PointerEvent) {
			trace('down');
			
			if (moveConnection != null) moveConnection.dispose();
			
			dy = e.viewY;
			
			moveConnection = uiRoot.pointerMove.connect(function(e:PointerEvent) {
				
				var dt = dy - e.viewY;
				dy = e.viewY;
				
				setPosition(_position + (dt * .005));
			});
			
			// listen once for pointer-up
			uiRoot.pointerUp.connect(function(e:PointerEvent) {
				trace('up');
				if (moveConnection != null) {
					moveConnection.dispose();
					moveConnection = null;
				}
			}).once();
		});
		
		
		setPosition(0);
	}
	
	var _position:Float;//0-1
	public function setPosition(value:Float) {
		
		if (value > 1) value = 1;
		if (value < 0) value = 0;
		_position = value;
		
		var range 	= Math.abs(maxAngle - minAngle);
		var angle 	= minAngle + value * range;
		
		var px 		= cx + Math.cos(angle-FMath.PI / 2) * radius;
		var py 		= cy + Math.sin(angle-FMath.PI / 2) * radius;
		
		owner.firstChild.get(Sprite).setXY(px, py);
	}
	
	override public function onRemoved() {
		
	}
	
	/* INTERFACE audio.parameter.IParameterObserver */
	public function onParameterChange(parameter:Parameter) {
		
	}
}