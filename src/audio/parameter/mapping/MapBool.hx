package audio.parameter.mapping;

/**
 * ...
 * @author Mike Almond
 */
class MapBool implements Mapping {
	
	public var min:Float = 0;
	public var max:Float = 1;
	
	public var range(get, never):Float;
	inline function get_range() return 1.0;
	
	public function new() { }
	
	public function map(normalizedValue:Float)
		return normalizedValue > 0.5 ? 1 : 0;
	
	public function mapInverse(value:Float)
		return value==1 ? 1 : 0;
	
	public function toString()
		return '[MapBool]';
}