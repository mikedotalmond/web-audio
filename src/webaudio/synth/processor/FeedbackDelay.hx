package webaudio.synth.processor;
import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.DelayNode;
import js.html.audio.GainNode;

/**
 * 
 * @author Mike Almond - https://github.com/mikedotalmond
 * 
 * TODO: Other delay types? ping-pong / panning delay / dub-delay (this + lp filter in the chain)
 */

class FeedbackDelay {
	
	var _gain	:GainNode;
	var _delay	:DelayNode;
	var _feedback:GainNode;
	
	
	/**
	 * DelayTime, seconds
	 */
	public var time(get, never):AudioParam;
	
	
	/**
	 * Delay (wet) mix level
	 */
	public var level(get, never):AudioParam;
	
	
	/**
	 * Delay feedback amount
	 */
	public var feedback(get, never):AudioParam;	
	
	
	/**
	 *  1st node in chain (connect input here)
	 */ 
	public var input(get, never):AudioNode; 
	
	
	/**
	 *  last node in chain (read output from here)
	 */ 
	public var output(get, never):AudioNode;
	
	
	/**
	 * 
	 * @param	context
	 * @param	maxDelay
	 */
	public function new(context:AudioContext, maxDelay:Float=1.0) {
		
		_gain 		= context.createGain();
		_feedback 	= context.createGain();
		_delay 		= context.createDelay(maxDelay);
		
		_gain.gain.value 		= .5;
		_feedback.gain.value 	= .5;
		
		_gain.connect(_delay);
		_delay.connect(_feedback);
		_feedback.connect(_delay);
	}
	
	inline function get_time()		:AudioParam return _delay.delayTime; 
	inline function get_level()		:AudioParam return _gain.gain; 
	inline function get_feedback()	:AudioParam return _feedback.gain; 
	
	inline function get_input()		:AudioNode return _gain; 
	inline function get_output()	:AudioNode return _delay;
}