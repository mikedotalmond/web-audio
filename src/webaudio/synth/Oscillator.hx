package webaudio.synth;

 import js.Browser;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.OscillatorNode;

/**
 * Oscillator wrapper for OscillatorNode
 * Provides timeable trigger and release, with optional portamento
 *
 * @author Mike Almond - https://github.com/mikedotalmond
 */

// the implementation of is generated at runtime in the OscillatorType __init__ below...
@:native("OscillatorTypeShim")
extern enum OscillatorTypeShim {
	SINE; SQUARE; TRIANGLE; SAWTOOTH; CUSTOM;
}


@:final class OscillatorType {
	
	public static var SINE:Int = 0;
	public static var SQUARE:Int = 1;
	public static var SAWTOOTH:Int = 2;
	public static var TRIANGLE:Int = 3;
	public static var CUSTOM:Int = 4;
	
	public static function get(type:Int):Dynamic {
		return switch(type) {
			case OscillatorType.SINE		: OscillatorTypeShim.SINE;
			case OscillatorType.SQUARE		: OscillatorTypeShim.SQUARE;
			case OscillatorType.SAWTOOTH	: OscillatorTypeShim.SAWTOOTH;
			case OscillatorType.TRIANGLE	: OscillatorTypeShim.TRIANGLE;
			case OscillatorType.CUSTOM		: OscillatorTypeShim.CUSTOM;
			default							: null;
		}
	}
	
	static function __init__() {
		// init shim -- fix up current differences in chrome/firefox
		var Node:Dynamic = Reflect.getProperty(js.Browser.window, "OscillatorNode");
		if (Node != null) {
			if (Reflect.hasField(Node, "SINE") && Std.is(Node.SINE, Int)) {
				untyped __js__('window.OscillatorTypeShim = {SINE:Node.SINE, SQUARE:Node.SQUARE, TRIANGLE:Node.TRIANGLE, SAWTOOTH:Node.SAWTOOTH, CUSTOM:Node.CUSTOM}');
			} else {
				untyped __js__('window.OscillatorTypeShim = {SINE:"sine", SQUARE:"square", TRIANGLE:"triangle", SAWTOOTH:"sawtooth", CUSTOM:"custom"}');
			}
		}
	}
}


abstract Oscillator(OscillatorNode) from OscillatorNode to OscillatorNode {
	
	
	/**
	 *
	 * @param	context
	 * @param	?destination
	 */
	inline public function new(context:AudioContext, ?destination:AudioNode, type:Int = 0) {
		this = context.createOscillator();
		this.frequency.value = 440;
		this.type = OscillatorType.get(type);
		this.start(0);
		if (destination != null) this.connect(destination);
	}

	
	/**
	 * set freq at a defined time
	 * @param	when
	 * @param	freq
	 * @param	portamentoTime - when > 0 the oscillator will ramp (exponentially) to the next frequency over the given time.
	 */
	inline public function trigger(when:Float, freq:Float = 440, portamentoTime:Float=0, retrigger:Bool=false) {
		this.frequency.cancelScheduledValues(when);
		if (portamentoTime > 0 && !retrigger && freq != this.frequency.value) {
			this.frequency.setValueAtTime(this.frequency.value, when);
			this.frequency.exponentialRampToValueAtTime(freq, when + portamentoTime);
		} else {
			this.frequency.setValueAtTime(freq, when);
		}
	}
	
	
	/**
	 * stop ongoing freq automation at a defined time
	 * @param when
	 */
	inline public function release(when:Float) {
		this.frequency.cancelScheduledValues(when);
		//this.stop(when); // can't restart... so keep running
	}
}