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
	inline public function trigger(when=.0, level = 1.0, attackTime=0.2, decayTime = 0.0001, sustainLevel=1.0, retrigger:Bool=false) {
		
		attackTime 	= attackTime < 0.0001 ? 0.0001 : attackTime;
		decayTime 	= decayTime < 0.0001 ? 0.0001 : decayTime;
		
		//this.gain.cancelScheduledValues(when);
		if(retrigger) this.gain.setValueAtTime(0, when);
		
		// Attack
		this.gain.setTargetAtTime(level, when, getTimeConstant(attackTime));
		
		// Decay->Sustain
		if (sustainLevel != 1.0) {
			if (decayTime > 0) {
				this.gain.setTargetAtTime(level * sustainLevel, when + attackTime, getTimeConstant(decayTime));
			} else {
				this.gain.setValueAtTime(level * sustainLevel, when + attackTime);
			}
		}
	}
	
	
	/**
	 * 
	 * @param	when=.0
	 * @param	releaseDuration=.5
	 * @return 	the time when release will complete and the gain is zero
	 */
	inline public function release(when = .0, releaseDuration = .5):Float {
		releaseDuration = releaseDuration < 0.0001 ? 0.0001 : releaseDuration;
		this.gain.setTargetAtTime(0, when, getTimeConstant(releaseDuration));
		return when + releaseDuration;
	}
	
	static inline var TimeConstDivider = 4.605170185988092; // Math.log(100);
	static inline function getTimeConstant(time:Float) return Math.log(time + 1.0) / TimeConstDivider;
	static inline function rExp(v) return 1.0 - 1.0 / Math.exp(v);
}