package webaudio.synth.processor;
import flambe.math.FMath;
import js.html.audio.AudioContext;
import js.html.audio.AudioNode;
import js.html.audio.PannerNode;
import js.html.audio.PanningModelType;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
abstract LRPanner(PannerNode) from PannerNode to PannerNode {
		
	public var node(get, never):PannerNode;
	inline function get_node():PannerNode return this;
	
	inline public function new(context:AudioContext, input:AudioNode=null, destination:AudioNode=null) {
		
		this = context.createPanner();
		this.panningModel = PanningModelType.EQUALPOWER;
		
		pan = 0;
		
		if (input != null) input.connect(this);
		if (destination != null) this.connect(destination);
	}
	

	/**
	 * 
	 * @param	value [-1.0, 1.0]
	 */
	public var pan(never, set):Float;
	inline function set_pan(value:Float):Float {	
		
		var x = value * FMath.PI /2;
		var z = x + FMath.PI / 2;
		
		if (z > FMath.PI / 2) z = FMath.PI - z;
		
		this.setPosition(Math.sin(x), 0, Math.sin(z));
		
		return value;
	}
}