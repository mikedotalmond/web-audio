package js;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

@:native("LZMA")
extern class LZMA {

	public function new(workerPath:String);
	
	// NOTE: mode can be 1-9 (1 is fast but not as good; 9 will probably make your browser crash).
	public function compress(input:String, mode:Int, onFinish:Array<Int>->Void, ?onProgress:Float->Void):Void;
	
	public function decompress(data:Array<Int>, onFinish:String->Void, ?onProgress:Float->Void):Void;
}