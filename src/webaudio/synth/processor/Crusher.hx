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
		this = try {
			context.createScriptProcessor(); //ff
		} catch (err:Dynamic) {
			context.createScriptProcessor(2048); //chrome
		}
		
		if (input != null) input.connect(this);
		if (destination != null) this.connect(destination);
	}
 }


class Crusher {
	
	var exp:Float;
	var iexp:Float;
	var sampleCount:Int = 0;
	var tempLeft:Float = 0;
	var tempRight:Float = 0;
	
	var _bits:Float;
	public var bits(get_bits, set_bits):Float;
	function get_bits():Float { return _bits; }
	function set_bits(value:Float):Float {
		if (_bits != value) {
			exp = Math.pow(2, value);
			iexp = (1 / exp);
		}
		return _bits = value;
	}

	public var node(default, null):ScriptProcessor;
	
	public function new(context:AudioContext,?input:AudioNode=null, ?destination:AudioNode=null) {
		bits = 8;
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
		
		// bit-crusher + sample-rate reduction (simple, skip samples... no interpolation)
		
		var samplesPerCycle = Std.int((44100 / 22050) + 0.5);
		
		var ditherLevel:Float = .25;
		var dL:Float = .5;
		var dR:Float = .5;
	
		var l:Float = 0, r:Float = 0;
		
		for (i in 0...n) {
		
			if (sampleCount >= samplesPerCycle) {
				sampleCount = 0;
				
				if (ditherLevel > 0) { //create the random dither +/- 0.5
					dL = 0.5 - (ditherLevel * Math.random());
					dR = 0.5 - (ditherLevel * Math.random());
				} else {
					dL = dR = 0.5;
				}
				
				l = tempLeft  = ie * Std.int(e * inL[i] + dL);
				r = tempRight = ie * Std.int(e * inR[i] + dR);
			
			} else {
				l = tempLeft;
				r = tempRight;
			}
			
			outL[i] = l;
			outR[i] = r;
			
			sampleCount++;
		}
	}
}