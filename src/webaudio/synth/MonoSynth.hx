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
import webaudio.utils.NoteFrequencyUtil;

import webaudio.synth.processor.Biquad;

/**
 * A (fairly) simple monosynth
 *
 * 
 * Audio routing:
 * 
 * OSC-0 + OSC-1[Phase Delay]-->
 *  
 * ADSR-->
 * 
 * Filter [BiQuad]-->
 * 
 * Distortion[WaveShaper + Crusher]-->
 * 
 * Delay[level+feedback]-->
 * 
 * Output Gain
 * 
 */

class MonoSynth implements ParameterObserver { //
	
	public var noteIsOn(default, null):Bool = false;
	
	// oscillators
	public var osc0		(default, null):OscillatorGroup;
	public var osc1		(default, null):OscillatorGroup;	
	public var osc0Level(default, null):GainNode;
	public var osc1Level(default, null):GainNode;
	public var osc0Pan	(default, null):LRPanner;
	public var osc1Pan	(default, null):LRPanner;
	
	public var osc0_portamentoTime	:Float 	= 0;
	public var osc0_randomCents		:Float 	= 0;
	public var osc0_detuneCents		(get, set):Int;
	//
	public var osc1_portamentoTime	:Float 	= 0;	
	public var osc1_randomCents		:Float 	= 0;
	public var osc1_detuneCents		(get, set):Int;
	
	
	// OSC A/B phase offset
	public var phase(get, set):Float;
	
	// 
	public var pitchBend(get,set)	:Float; // [-1.0, 1.0]
	public var pitchBendRange		:Float = 200; // cents
	
	
	// Amplitude Envelope Generator
	public var adsr(default, null):ADSR;
	
	
	// fx
	public var filter(default, null):BiquadFilter;
	public var distortionGroup(default, null):DistortionGroup;
	public var delay(default, null):FeedbackDelay;
	
	// output
	public var outputGain(default, null):GainNode;
	
	
	// osc 0/1 phase offset
	var phaseDelay			:DelayNode;
	var _phase				:Float = 0;	
	var _pitchBend			:Float = 0; // [-1.0, 1.0]
	
	var _osc0_detuneCents	:Int = 0;
	var _osc1_detuneCents	:Int = 0;
	
	
	// TODOS: theses LFOses.... apparently we can connect output of LFO (or any node...) as input to an AudioParam
	//var OscPhase_LFO		:OscillatorGroup;
	//var FilterFreq_LFO	:OscillatorGroup;
	//var FM_LFO			:OscillatorGroup;
	//var AM_LFO		:OscillatorGroup;
	
	var context		:AudioContext;
	var freqUtil	:NoteFrequencyUtil;
	
	var noteFreq	:Float = 440; // current/last note frequency
	var osc0Freq	:Float = 440; // actual current osc freq (notefreq+detune+pitchbend+random...etc)
	var osc1Freq	:Float = 440;
	
	/**
	 * 
	 * @param	destination
	 * @param	freqUtil
	 */
	public function new(destination:AudioNode, freqUtil:NoteFrequencyUtil) {
		this.freqUtil = freqUtil;
		
		context = destination.context;
		
		// set up audio process chain in reverse
		
		outputGain = context.createGain();
		outputGain.connect(destination);
		outputGain.gain.value = 1;
		
		delay = new FeedbackDelay(context);
		delay.output.connect(outputGain);	
		
		setupDistortion();
		
		filter	= new BiquadFilter(FilterType.LOWPASS, 1, 1, context, null, distortionGroup.input);
		adsr 	= new ADSR(context, null, filter.biquad);
		
		//var gain = context.createGain();
		//AM_LFO 	= new OscillatorGroup(context, cast adsr.node.node.gain);
		////AM_LFO.oscillator.node.start(context.currentTime);
		//AM_LFO.oscillator.setType(OscillatorType.SINE);
		//AM_LFO.oscillatorNode.frequency.value = 1;
		//
		setupOscillators();
		
		//
		// todo: LFO(s) AM/FM/Filter, Ouput-AnalyserNode (VU Bars etc...)
	}
	
	
	function setupDistortion():Void {
		distortionGroup = new DistortionGroup(context);		
		distortionGroup.pregain.gain.value = 1.0;		
		distortionGroup.output.connect(delay.input); // send to delay
		distortionGroup.output.connect(outputGain);  // master output
	}
	
	
	function setupOscillators():Void {
		
		// osc -> gain -> pan
		
		// osc0 output is routed though this delay - used to offset the waveform by small amounts (ie - from zero to one wavelengths)
		phaseDelay = context.createDelay(1 / freqUtil.noteIndexToFrequency(0)); // set max phase delay (for lowest note playable)
		phaseDelay.connect(adsr.node, 0);
		
		// Pan
		osc0Pan = new LRPanner(context);
		osc1Pan = new LRPanner(context);
		osc0Pan.node.connect(phaseDelay);
		osc1Pan.node.connect(adsr.node);
		
		// Gain
		osc0Level = context.createGain();		
		osc1Level = context.createGain();
		osc0Level.connect(osc0Pan);
		osc1Level.connect(osc1Pan);		
		
		osc0 = new OscillatorGroup(context, osc0Level);
		osc1 = new OscillatorGroup(context, osc1Level);
	}
	
	/**
	 * 
	 * @param	when
	 * @param	freq
	 * @param	velocity
	 * @param	retrigger
	 */
	public function noteOn(when:Float, freq:Float, velocity:Float = 1, retrigger:Bool = false) {
		
		// (re)set current freq
		noteFreq = osc0Freq = osc1Freq = freq;
		
		// various processes can detune the oscillators and need to be checked here...
		var detune0:Float = _osc0_detuneCents;
		var detune1:Float = _osc1_detuneCents;
		
		// random detune
		if (osc0_randomCents > 0) detune0 += (osc0_randomCents * (Math.random() - .5));
		if (osc1_randomCents > 0) detune1 += (osc1_randomCents * (Math.random() - .5));
		
		if (_pitchBend != 0) {
			var pbCents = _pitchBend * pitchBendRange;
			detune0 += pbCents;
			detune1 += pbCents;
		}
		
		// calculate new oscillator frequencies after detuning
		if (detune0 != 0) osc0Freq = freqUtil.detuneFreq(osc0Freq, detune0);
		if (detune1 != 0) osc1Freq = freqUtil.detuneFreq(osc1Freq, detune1);
		
		// update phase offset time - depends on the played freq (and will only work (well) when osc0Freq == osc1Freq)
		var p = (1 / osc0Freq) * _phase;
		phaseDelay.delayTime.cancelScheduledValues(when);		
		if (osc0_portamentoTime > 0) {
			// make phase-change match portamento
			if (p > 0) {
				phaseDelay.delayTime.setValueAtTime(phaseDelay.delayTime.value, when);
				phaseDelay.delayTime.exponentialRampToValueAtTime(p, when + osc0_portamentoTime);
			} else {
				phaseDelay.delayTime.setValueAtTime(p, when);
			}
		} else {
			phaseDelay.delayTime.setValueAtTime(p, when);
		}
		
		
		// trigger oscillators
		osc0.oscillator.trigger(when, osc0Freq, osc0_portamentoTime, retrigger);
		osc1.oscillator.trigger(when, osc1Freq, osc1_portamentoTime, retrigger);
		
		
		// (re)trigger the AEG (ADSR) and FEG (ASR)
		if (!noteIsOn || retrigger) {
			adsr.on(when, velocity, retrigger);
			if (filter.envEnabled) filter.on(when, retrigger);
		}
		
		noteIsOn = true;
	}
	
	
	
	/**
	 * 
	 * @param	when
	 */
	public function noteOff(when) {
		if (noteIsOn) {
			
			var r = adsr.off(when);
			
			if (filter.envEnabled) filter.off(when);
			
			osc0.oscillator.release(r);
			osc1.oscillator.release(r);
			phaseDelay.delayTime.cancelScheduledValues(r);
			
			noteIsOn = false;
		}
	}
	
	
	
	/** INTERFACE audio.parameter.IParameterObserver 
	 * Handle UI parameter changes 
	 **/
	public function onParameterChange(parameter:Parameter) {
		
		trace('[MonoSynth] ${parameter.name} - value:${parameter.getValue()}, normalised:${parameter.getValue(true)}');
		
		var now = context.currentTime;
		var val = parameter.getValue();
		
		switch(parameter.name) {
			
			// OUTPUT
			case 'outputLevel'		: outputGain.gain.setValueAtTime(val, now);
			
			// OSCILLATORS
			case 'osc0Type'			: osc0.type = Std.int(val);
			case 'osc0Level'		: osc0Level.gain.setValueAtTime(val, now);
			case 'osc0Pan'			: osc0Pan.pan = val;
			case 'osc0Slide'		: osc0_portamentoTime = val;
			case 'osc0Detune'		: osc0_detuneCents = Std.int(val);
			case 'osc0Random'		: osc0_randomCents = val;
			
			case 'osc1Type'			: osc1.type = Std.int(val);
			case 'osc1Level'		: osc1Level.gain.setValueAtTime(val, now);
			case 'osc1Pan'			: osc1Pan.pan = val;
			case 'osc1Slide'		: osc1_portamentoTime = val;
			case 'osc1Detune'		: osc1_detuneCents = Std.int(val);
			case 'osc1Random'		: osc1_randomCents = val;
			
			case 'oscPhase'			: phase 	= val;
			case 'pitchBend'		: pitchBend = val;
			
			//ADSR
			case 'adsrAttack'		: adsr.attack 	= val;
			case 'adsrDecay'		: adsr.decay 	= val;
			case 'adsrSustain'		: adsr.sustain 	= val;
			case 'adsrRelease'		: adsr.release 	= val;
			
			// AM  LFO
			case 'am_lfo_type'		:
			case 'am_lfo_freq'		:
			case 'am_lfo_depth'		:
			
			//Filter
			case 'filter_enabled'	: filter.envEnabled	= Std.int(val) == 1;
			case 'filter_type'		: filter.type 		= Std.int(val);
			case 'filter_freq'		: filter.frequency 	= val;
			case 'filter_q'			: filter.q 			= val;
			case 'filter_attack'	: filter.envAttack 	= val;
			case 'filter_release'	: filter.envRelease = val;
			case 'filter_env_range'	: filter.envRange 	= val;
			
			//Distortion
			case 'dist_pregain' 		: distortionGroup.pregain.gain.setValueAtTime(val, now);
			case 'dist_waveshape_amount': distortionGroup.waveshaper.amount = val;
			case 'dist_bitcrush_bits'	: distortionGroup.crusher.bits = val;
			case 'dist_bitcrush_rate'	: distortionGroup.crusher.rateReduction = val;
			
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
		filter = null;
		delay = null;
		phaseDelay = null;
		outputGain = null;
	}
	
	
	//
	
	
	inline function get_phase():Float return _phase;
	function set_phase(value:Float):Float {
		var now = context.currentTime;
		phaseDelay.delayTime.cancelScheduledValues(now);
		phaseDelay.delayTime.setValueAtTime((1 / noteFreq) * value, now);
		return _phase = value;
	}
	
	
	function get_pitchBend():Float return _pitchBend;
	function set_pitchBend(value:Float):Float {
		value = value <-1.0 ? -1.0 : (value > 1.0 ? 1.0 : value);
		
		if (noteIsOn) { // playing a note?
			
			var dP = (value - _pitchBend) * pitchBendRange; // pitchBend delta - cents
			var f0  = freqUtil.detuneFreq(osc0Freq, dP);
			var f1  = freqUtil.detuneFreq(osc1Freq, dP);
			var now = context.currentTime;
			
			osc0.oscillator.node.frequency.cancelScheduledValues(now);
			osc0.oscillator.node.frequency.exponentialRampToValueAtTime(f0, now + frameTime);
			
			osc1.oscillator.node.frequency.cancelScheduledValues(now);
			osc1.oscillator.node.frequency.exponentialRampToValueAtTime(f1, now + frameTime);
			
			osc0Freq = f0;
			osc1Freq = f1;
		}
		
		return _pitchBend = value;
	}
	
	
	inline function get_osc0_detuneCents() return _osc0_detuneCents;	
	function set_osc0_detuneCents(value:Int):Int {		
		value = value <-100 ? -100 : (value > 100 ? 100 : value);
		
		if (noteIsOn) { // playing a note?
			var dt = value - _osc0_detuneCents;
			var f  = freqUtil.detuneFreq(osc0Freq, dt);
			var now = context.currentTime;
			
			osc0.oscillator.node.frequency.cancelScheduledValues(now);
			osc0.oscillator.node.frequency.exponentialRampToValueAtTime(f, now + frameTime);		
			osc0Freq = f;	
		}
		
		return _osc0_detuneCents = value;
	}
	
	
	inline function get_osc1_detuneCents() return _osc1_detuneCents;
	function set_osc1_detuneCents(value:Int):Int {		
		value = value <-100 ? -100 : (value > 100 ? 100 : value);
		
		if (noteIsOn) { // playing a note?
			var dt = value - _osc1_detuneCents;
			var f  = freqUtil.detuneFreq(osc1Freq, dt);
			var now = context.currentTime;
			
			osc1.oscillator.node.frequency.cancelScheduledValues(now);
			osc1.oscillator.node.frequency.exponentialRampToValueAtTime(f, now + frameTime);	
			osc1Freq = f;
		}
		
		return _osc1_detuneCents = value;
	}
	
	static inline var frameTime = 1 / 60;
}