package webaudio.synth;

import audio.parameter.ParameterObserver;
import audio.parameter.Parameter;
import haxe.ds.ObjectMap;
import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioParam;
import js.html.audio.BiquadFilterNode;
import js.html.audio.ChannelMergerNode;
import js.html.audio.DelayNode;
import js.html.audio.GainNode;
import js.html.audio.OscillatorNode;
import webaudio.synth.generator.ADSR;
import webaudio.synth.generator.Oscillator.OscillatorType;
import webaudio.synth.generator.OscillatorGroup;
import webaudio.synth.processor.DistortionGroup;
import webaudio.synth.processor.FeedbackDelay;
import webaudio.synth.processor.LRPanner;
import webaudio.synth.processor.Waveshaper;
import webaudio.synth.processor.Waveshaper;
import webaudio.utils.NoteFrequencyUtil;

import webaudio.synth.processor.Biquad;

/**
 * A fairly basic monosynth
 *
 * Audio routing:
 * OSC-0 + OSC-1[Phase Delay] -> ADSR -> BiQuad -> WaveShaper -> Delay[level+feedback] -> Output Gain
	
 *
 *
 * @author Mike Almond - https://github.com/mikedotalmond *
 */

class MonoSynth implements ParameterObserver { //
	
	// generator
	public var osc0				(default, null):OscillatorGroup;
	public var osc1				(default, null):OscillatorGroup;
	public var adsr				(default, null):ADSR;
	
	// fx
	public var biquad			(default, null):Biquad;
	public var distortionGroup	(default, null):DistortionGroup;
	public var delay			(default, null):FeedbackDelay;

	// output
	public var outputGain		(default, null):GainNode;
	
	
	public var adsr_attackTime		:Float = .1;
	public var adsr_decayTime		:Float = 0.2;
	public var adsr_releaseTime		:Float = .25;
	public var adsr_sustain			:Float = .44;
	
	public var osc0_portamentoTime	:Float = 0;
	public var osc0_detuneCents		:Int = 0;
	public var osc1_portamentoTime	:Float = 0;
	public var osc1_detuneCents		:Int = 0;
	
	public var phase(get, set):Float;
	
	public var noteIsOn(default, null):Bool = false;
	
	
	var freqUtil:NoteFrequencyUtil;
	
	// osc 0/1 phase offset (using delaynode)
	var phaseDelay:DelayNode;
	var _phase:Float = 0;
	
	var noteFreq:Float = 440;
	var context:AudioContext;
	
	/** filter */
	public var filterType:Int = 0;
	public var filterFrequency:Float=.001;
	public var filterQ:Float=10;
	public var filterGain:Float = 1;
	
	public var filterEnvEnabled:Bool = true;
	public var filterEnvRange:Float=1;
	public var filterEnvAttack:Float=.1;
	public var filterEnvRelease:Float=1;
	
	
	
	/**
	 * 
	 * @param	destination
	 * @param	freqUtil
	 */
	public function new(destination:AudioNode, freqUtil:NoteFrequencyUtil) {
		this.freqUtil = freqUtil;
		
		context 	= destination.context;
		
		// set  up audio process chain in reverse
		
		outputGain 	= context.createGain();
		outputGain.connect(destination);
		outputGain.gain.value = 1;
		
		delay = new FeedbackDelay(context);
		delay.output.connect(outputGain);			
		
		//var test = new LRPanner(context, delay.output, outputGain);
		//test.setPan(0.0);
		
		
		setupDistortion();
		
		biquad 	= new Biquad(FilterType.LOWPASS, filterFrequency, filterQ, context, null, distortionGroup.input);
		adsr 	= new ADSR(context, null, biquad);
		
		setupOscillators();
		
		// todo: pitch bend, osc pan, amplitude modulation, ouput levels AnalyserNode
	}
	
	
	function setupDistortion():Void {
		
		distortionGroup = new DistortionGroup(context);
		distortionGroup.pregain.gain.value = 2.0;
		
		distortionGroup.waveshaper.setDistortion( .325);
		distortionGroup.crusher.bits = 10;
		
		distortionGroup.output.connect(delay.input); // send to delay
		distortionGroup.output.connect(outputGain);  // master output
	}
	
	
	function setupOscillators():Void {
		
		// osc0 output is routed directly though this delay - used to offset the waveform by small amounts (zero to one wavelength)
		phaseDelay = context.createDelay(1 / freqUtil.noteIndexToFrequency(0));
		phaseDelay.connect(adsr, 0);
		
		osc0 = new OscillatorGroup(context, phaseDelay);
		osc1 = new OscillatorGroup(context, adsr);
	}
	
	
	
	/**
	 * 
	 * @param	when
	 * @param	freq
	 * @param	velocity
	 * @param	retrigger
	 */
	public function noteOn(when:Float, freq:Float, velocity:Float = 1, retrigger:Bool = false) {
		
		noteFreq = freq;
		
		var p = (1 / freq) * _phase;
		phaseDelay.delayTime.cancelScheduledValues(when);
		if (osc0_portamentoTime > 0) {
			// make phase-change match portamento
			phaseDelay.delayTime.setValueAtTime(phaseDelay.delayTime.value, when);
			phaseDelay.delayTime.exponentialRampToValueAtTime(p, when + osc0_portamentoTime);
		} else {
			phaseDelay.delayTime.setValueAtTime(p, when);
		}
		
		
		if (osc0_detuneCents != 0) {
			osc0.oscillator.trigger(when, freqUtil.detuneFreq(freq, osc0_detuneCents), osc0_portamentoTime, retrigger);
		} else {
			osc0.oscillator.trigger(when, freq, osc0_portamentoTime, retrigger);
		}
		
		if (osc1_detuneCents != 0) {
			osc1.oscillator.trigger(when, freqUtil.detuneFreq(freq, osc1_detuneCents), osc1_portamentoTime, retrigger);
		} else {
			osc1.oscillator.trigger(when, freq, osc1_portamentoTime, retrigger);
		}
		
		if (!noteIsOn || retrigger) {
			adsr.trigger(when, velocity, adsr_attackTime, adsr_decayTime, adsr_sustain, retrigger);
			if (filterEnvEnabled) { 
				var start = filterFrequency * 6000;
				var dest  = start + filterEnvRange * 8000;
				biquad.trigger(when, start, filterEnvAttack, dest, retrigger);
			}
		}
		
		noteIsOn = true;
	}
	
	
	
	/**
	 * 
	 * @param	when
	 */
	public function noteOff(when) {
		if (noteIsOn) {
			var r = adsr.release(when, adsr_releaseTime);
			
			osc0.oscillator.release(r);
			osc1.oscillator.release(r);
			phaseDelay.delayTime.cancelScheduledValues(r);
			
			if (filterEnvEnabled) biquad.release(when, filterFrequency * 6000, filterEnvRelease);
			
			noteIsOn = false;
		}
	}
	
	
	
	/** INTERFACE audio.parameter.IParameterObserver 
	 * Handle UI parameter changes 
	 **/
	public function onParameterChange(parameter:Parameter) {
		
		trace('[MonoSynth] onParameterChange - ${parameter.name} - value:${parameter.getValue()}, normalised:${parameter.getValue(true)}');
		
		var now = context.currentTime;
		var val = parameter.getValue();
		
		switch(parameter.name) {
			// OUTPUT
			case 'outputLevelRotary': outputGain.gain.setValueAtTime(parameter.getValue(), now);
			
			// OSCILLATORS
			case 'osc0_type'		:
			case 'osc0_level'		:
			case 'osc0_pan'			:
			case 'osc0_slide'		:
			case 'osc0_detune'		:
			case 'osc0_random'		:
			
			case 'osc1_type'		:
			case 'osc1_level'		:
			case 'osc1_pan'			:
			case 'osc1_slide'		:
			case 'osc1_detune'		:
			case 'osc1_random'		:
			
			case 'osc_phase'		: phase = val;
			
			//ADSR
			case 'adsr_attack'		:
			case 'adsr_decay'		:
			case 'adsr_sustain'		:
			case 'adsr_release'		:			
			// AM  LFO
			case 'am_lfo_type'		:
			case 'am_lfo_freq'		:
			case 'am_lfo_depth'		:
			
			//Filter
			case 'filter_type'		:
			case 'filter_freq'		:
			case 'filter_q'			:
			case 'filter_attack'	:
			case 'filter_release'	:
			
			//Distortion
			case 'dist_pregain' 		: distortionGroup.pregain.gain.setValueAtTime(val, now);
			case 'dist_waveshape_amount': distortionGroup.waveshaper.setDistortion(val);
			case 'dist_bitcrush_bits'	: distortionGroup.crusher.bits = val;
			case 'dist_bitcrush_rate'	: /*distortionGroup.crusher.rate = val;*/
			
			//Delay
			case 'delay_time'			: delay.time.setValueAtTime(val, now);
			case 'delay_level'			: delay.level.setValueAtTime(val, now);
			case 'delay_feedback'		: delay.feedback.setValueAtTime(val, now);
		}
	}
	
	
	
	public function dispose() {
		adsr = null;
		osc0 = null;
		osc1 = null;
		biquad = null;
		delay = null;
		phaseDelay = null;
		outputGain = null;
	}
	
	
	inline function get_phase():Float return _phase;
	function set_phase(value:Float):Float {
		phaseDelay.delayTime.value = (1 / noteFreq) * value;
		return _phase = value;
	}
	
}