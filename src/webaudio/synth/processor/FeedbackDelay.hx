package webaudio.synth.processor;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.BiquadFilterNode;
import js.html.audio.DelayNode;
import js.html.audio.GainNode;
import webaudio.synth.processor.Biquad.FilterType;

import webaudio.synth.processor.Biquad.FilterTypeShim;

/**
 * 
 * @author Mike Almond - https://github.com/mikedotalmond
 * 
 */

class FeedbackDelay {
	
	var _level	:GainNode;
	var _delay	:DelayNode;
	var _feedback:GainNode;
	var _lpf	:BiquadFilterNode;
	
	
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
	 * lowpass filter freq
	 */
	public var lpfFrequency(get, never):AudioParam;
	
	
	/**
	 * lowpass filter q
	 */
	public var lpfQ(get, never):AudioParam;
	
	
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
		
		_level 		= context.createGain();
		_feedback 	= context.createGain();
		_delay 		= context.createDelay(maxDelay);
		
		_level.gain.value 		= .25;
		_feedback.gain.value 	= .5;
		
		_lpf 					= context.createBiquadFilter();
		_lpf.type 				= cast FilterType.get(FilterType.LOWPASS);
		_lpf.frequency.value	= 4000;
		_lpf.Q.value			= 1; //default is 1 - valid range is 0.0001 to 1000
		
		_level.connect(_delay);
		
		_delay.connect(_lpf);
		_lpf.connect(_feedback);
		
		_feedback.connect(_delay);
	}
	
	inline function get_time()		:AudioParam return _delay.delayTime; 
	inline function get_level()		:AudioParam return _level.gain; 
	inline function get_feedback()	:AudioParam return _feedback.gain; 
	inline function get_lpfFrequency():AudioParam return _lpf.frequency; 
	inline function get_lpfQ()		:AudioParam return _lpf.Q; 
	
	inline function get_input()		:AudioNode return _level; 
	inline function get_output()	:AudioNode return _delay;
}