package math;

/**
 * Represents an Float range with minimum and maximum values
 * ...
 * @author Mike Almond
 */

class FloatRange {
	
	public var min:Float;
	public var max:Float;
	public var length(get, never):Float;
	
	public function new(min:Float = 0, max:Float = 1) {
		this.min = min;
		this.max = max;
	}

	/**
	 * Check if the specified value is inside this range
	 * @param	x - Value to check
	 * @return	True if the specified value is inside this range or false otherwise.
	 */
	public function isInside(x:Float):Bool{
		return ( ( x >= min ) && ( x <= max ) );
	}
	
	/**
	 * Check if the specified range is inside this range
	 * @param	range - Range to check
	 * @return	True if the specified range is inside this range or false otherwise.
	 */
	public function isInsideRange(range:FloatRange):Bool{
		return (( isInside( range.min ) ) && ( isInside( range.max ) ) );
	}

	/**
	 *
	 * @param	range - Range to check for overlapping
	 * @return	True if the specified range overlaps with this range or false otherwise.
	 */
	public function isOverlapping(range:FloatRange):Bool{
		return ( ( isInside( range.min ) ) || ( isInside( range.max ) ) );
	}
	
	inline function get_length():Float return max - min;
}