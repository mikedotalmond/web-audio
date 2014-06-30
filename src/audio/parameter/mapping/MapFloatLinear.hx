package audio.parameter.mapping;

/**
 * ...
 * @author Mike Almond
 */
class MapFloatLinear implements Mapping {
	
	public var min:Float;
	public var max:Float;
	
	public var range(get, never):Float;
	inline function get_range() return max - min;
	
	public function new(min:Float = 0, max:Float = 1 ){
		this.min = min;
		this.max = max;
	}
	
	/**
	 *
	 * @param	normalisedValue (0-1)
	 * @return	A mapped value in the range of min-max
	 */
	public function map(normalisedValue:Float)
		return min + normalisedValue * range;
	
	
	/**
	 *
	 * @param	value	A value in the range of min-max
	 * @return	Normalised value (0-1)
	 */
	public function mapInverse(value:Float)
		return ( value - min ) / range;
	
		
	
	public function toString()
		return '[MapFloatLinear] min:' + min + ', max:' + max;
	
}