package webaudio.synth.processor;

import flambe.math.FMath;
import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.WaveShaperNode;
import js.html.Float32Array;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

abstract WaveShaper(WaveShaperNode) from WaveShaperNode to WaveShaperNode {
	
	inline public function new(context:AudioContext, ?input:AudioNode=null, ?destination:AudioNode=null) {
		
		this 		= context.createWaveShaper();
		this.curve 	= new Float32Array(Std.int(context.sampleRate));
		
		this.oversample = '4x'; // '2x', '4x'
		setDistortion(.5);
		
		if (input != null) input.connect(this);
		if (destination != null) this.connect(destination);
	}
	
	/*
	 * Set the waveshaper distortion amount [-1.0 ... 1.0] 
	 * 
	 * */
	public function setDistortion(amount:Float=0) {
		WaveShaper.getDistortionCurve(amount, this.curve); 
	}
	
	
	/**
	 * 
	 * Distortion amount [-1.0 ... 1.0] 
	 */	
	public static function getDistortionCurve(amount:Float = 0.0, target:Float32Array=null):Float32Array {
		
		if (amount < -1.0 || amount > 1.0) throw "RangeError";
		
		var curve 	= target==null ? new Float32Array(44100) : target;		
		var	n 		= curve.length;
		
		var k 		= (2 * amount) / (1 - amount);
		var x;
		
		// k = 2 * amount / (1-amount);
		// f(x) = (1+k)*x/(1+k*abs(x))
		// useful - https://kevincennis.github.io/transfergraph/
		
		for (i in 0...n) {
			x 			= -1 + ((i + i) / n);
			curve[i] 	= (1.0 + k) * x / (1.0 + k * Math.abs(x));
		}
		
		return curve;
	}
}