package synth;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.OscillatorNode;

/**
 * Oscillator wrapper for OscillatorNode
 * Provides timeable trigger and release, with optional portamento
 *
 * @author Mike Almond - https://github.com/mikedotalmond
 */

abstract Oscillator(OscillatorNode) from OscillatorNode to OscillatorNode {
	
	public static inline var SINE 		:Int = 0;
	public static inline var SQUARE 	:Int = 1;
	public static inline var SAWTOOTH 	:Int = 2;
	public static inline var TRIANGLE 	:Int = 3;

	/**
	 *
	 * @param	context
	 * @param	?destination
	 */
	inline public function new(context:AudioContext, ?destination:AudioNode, type:Int=0) {
		this = context.createOscillator();
		this.frequency.value = 440;
		this.type = type;
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