package webaudio.synth.processor;

import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.AudioProcessingEvent;
import js.html.audio.ScriptProcessorNode;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

abstract ScriptProcessor(ScriptProcessorNode) from ScriptProcessorNode to ScriptProcessorNode {
	 inline public function new(context:AudioContext, ?input:AudioNode=null, ?destination:AudioNode=null) {
		this = context.createScriptProcessor(); // let browser decide the buffer size (should be optimal...) aurora=4096, chrome=2048
		if (input != null) input.connect(this);
		if (destination != null) this.connect(destination);
	}
 }


@:final class Crusher {
	
	var exp			:Float;
	var iexp		:Float;
	var sampleCount	:Int = 0;
	var tempLeft	:Float = 0;
	var tempRight	:Float = 0;
	
	var _bits			:Float;
	var _rateReduction	:Float;
	var context			:AudioContext;
	var sampleRate		:Float;
	var samplesPerCycle	:Float;
	
	public var bits(get, set):Float;
	public var rateReduction(get, set):Float;
	
	public var node(default, null):ScriptProcessor;
	
	
	public function new(context:AudioContext,?input:AudioNode=null, ?destination:AudioNode=null) {
		this.context = context;
		sampleRate = context.sampleRate;
		
		bits = 24;
		rateReduction = 1;
		
		node = new ScriptProcessor(context, input, destination);
		(cast node).onaudioprocess = crusherImpl;
	}
	
	
	function crusherImpl(e:AudioProcessingEvent) {
		
		var inL		= e.inputBuffer.getChannelData(0);
		var inR		= e.inputBuffer.getChannelData(1);
		var outL	= e.outputBuffer.getChannelData(0);
		var outR	= e.outputBuffer.getChannelData(1);
		var n 		= outR.length;
		var e 		= exp;
		var ie 		= iexp;
		
		// bit-crusher + samplerate reduction
		
		var ditherLevel:Float = .002;
		var dL:Float = 0;
		var dR:Float = 0;
	
		for (i in 0...n) {
		
			sampleCount++;
			
			// resample
			if (sampleCount >= samplesPerCycle) {
				sampleCount = 0;
				
				// crush
				dL = ditherLevel * (Math.random()-.5);
				dR = ditherLevel * (Math.random()-.5);
				tempLeft  = ie * Std.int(e * inL[i] + dL);
				tempRight = ie * Std.int(e * inR[i] + dR);
			}
			
			outL[i] = tempLeft;
			outR[i] = tempRight;
		}
	}
	
	
	inline function get_bits():Float return _bits;
	function set_bits(value:Float):Float {
		value = value < 1 ? 1 : (value > 24 ? 24 : value);
		if (_bits != value) {
			exp = Math.pow(2, value);
			iexp = (1 / exp);
		}
		return _bits = value;
	}
	
	
	inline function get_rateReduction():Float return _rateReduction;
	function set_rateReduction(value:Float):Float {
		value = value < 1 ? 1 : (value > 16 ? 16 : value);
		return samplesPerCycle = _rateReduction = value;
	}
}