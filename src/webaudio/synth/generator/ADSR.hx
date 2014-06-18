package webaudio.synth.generator;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.BiquadFilterNode;
import js.html.audio.GainNode;

class ADSR {
	
	public var attack	:Float = .1;
	public var decay	:Float = 0.2;
	public var sustain	:Float = .44;
	public var release	:Float = .25;
	
	public var node(default, null):ADSRNode;
	
	public function new(context:AudioContext, ?input:AudioNode, ?destination:AudioNode) {
		node = new ADSRNode(context, input, destination);
	}
	
	public inline function on(when:Float = .0, level:Float = 1.0, retrigger:Bool = false) {
		node.trigger(when, level, attack, decay, sustain, retrigger);
	}
	
	public inline function off(when:Float = .0):Float {
		return node.release(when, release);
	}
}



/**
 * ADSR Envelope wrapper for GainNode
 * 
 * @author Mike Almond - https://github.com/mikedotalmond
 */
abstract ADSRNode(GainNode) from GainNode to GainNode {
	
	public var node(get, never):GainNode;
	inline function get_node():GainNode return cast this;
	
	/**
	 * 
	 * @param	context
	 * @param	?input
	 * @param	?destination
	 */
	inline public function new(context:AudioContext, ?input:AudioNode, ?destination:AudioNode) {
		this = context.createGain();
		this.gain.value = 0;
		
		if (input != null) input.connect(this);
		if (destination != null) this.connect(destination);
	}
	/**
	 * @param	when = time (audio context) to trigger at
	 * @param	level = 1.0
	 * @param	attackTime=0.2
	 * @param	decayTime=0.0
	 * @param	sustainLevel=1.0
	 */
	inline public function trigger(when=.0, level = 1.0, attackTime=0.2, decayTime = 0.001, sustainLevel=1.0, retrigger:Bool=false) {
		
		this.gain.cancelScheduledValues(when);
		
		// start sequence 
		if(retrigger) this.gain.setValueAtTime(0, when);
		
		// Attack
		this.gain.setTargetAtTime(level, when, rExp(attackTime));
		
		//Decay->Sustain
		if (sustainLevel != 1.0) this.gain.setTargetAtTime(level * sustainLevel, when + attackTime, rExp(decayTime));
	}
	
	
	/**
	 * 
	 * @param	when=.0
	 * @param	releaseDuration=.5
	 * @return 	the time when release will complete and the gain is zero
	 */
	inline public function release(when=.0, releaseDuration=.5):Float {
		var er = Math.exp(releaseDuration);
		this.gain.cancelScheduledValues(when);
		this.gain.setValueAtTime(this.gain.value, when);
		this.gain.setTargetAtTime(0, when, 1-1/er);
		return when + er;
	}
	
	static inline function rExp(v) {
		return  1 - 1 / Math.exp(v);
	}
}