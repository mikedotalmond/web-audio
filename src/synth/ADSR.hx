package synth;
import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.BiquadFilterNode;
import js.html.audio.GainNode;


/**
 * Wraps the Biquad Filter, giving it an ASR envelope
 * http://www.w3.org/TR/webaudio/#BiquadFilterNode-section
 */
abstract BiquadEnvelope(BiquadFilterNode) from BiquadFilterNode to BiquadFilterNode {
	
	inline public function new(type:Int, f:Float=350.0, q:Float=1.0, context:AudioContext, ?input:AudioNode, ?destination:AudioNode) {
		this 					= context.createBiquadFilter();
		this.type 				= type;
		this.frequency.value 	= f;
		this.Q.value	 		= q;
		this.gain.value 		= 0;
		
		if (input != null) input.connect(this);
		if (destination != null) this.connect(destination);
	}
	
	/**
	 * 
	 * @param	when=.0 time (audio context) to trigger at
	 * @param	startFreq = 350.0
	 * @param	attackTime=1.0
	 * @param	sustainFreq=1000.0
	 * @param	retrigger
	 */
	inline public function trigger(when=.0, startFreq = 350.0, attackTime=1.0, sustainFreq=1000.0, retrigger:Bool=false) {
		startFreq = retrigger ? startFreq : this.frequency.value;
		rampToFreqAtTime(when, attackTime, startFreq, sustainFreq);
	}
	
	/**
	 * 
	 * @param	when=.0
	 * @param	destinationFreq=350.0
	 * @param	releaseDuration=.5
	 * @return
	 */
	inline public function release(when=.0, destinationFreq=350.0, releaseDuration=.5):Float {
		rampToFreqAtTime(when, releaseDuration, this.frequency.value, destinationFreq);
		return when + releaseDuration;
	}
	
	
	inline function rampToFreqAtTime(when, duration, startFreq, destFreq) {
		this.frequency.cancelScheduledValues(when);
		this.frequency.setValueAtTime(startFreq, when);
		this.frequency.exponentialRampToValueAtTime(destFreq, when + duration);
	}
}


/**
 * ADSR Envelope wrapper for GainNode
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