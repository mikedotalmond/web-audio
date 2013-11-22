package synth;
import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.GainNode;

/**
 * ADSR Envelope wrapper for the GainNode
 * 
 * @author Mike Almond - https://github.com/mikedotalmond
 */

abstract ADSR(GainNode) from GainNode to GainNode {
		
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
		this.gain.setValueAtTime(retrigger ? 0 : this.gain.value, when);
		
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
		this.gain.setTargetAtTime(0, when, 1-1/er);
		return when + er;
	}
	
	inline function rExp(v) {
		return  1 - 1 / Math.exp(v);
	}
}