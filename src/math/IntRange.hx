package math;

/**
 * Represents an Integer range with minimum and maximum values
 * ...
 * @author Mike Almond
 */

class IntRange {
	
	public var min:Int;
	public var max:Int;
	public var length(get, never):Int;
	
	public function new(min:Int, max:Int){
		this.min = min;
		this.max = max;
	}

	/**
	 * Check if the specified value is inside this range
	 * @param	x - Value to check
	 * @return	True if the specified value is inside this range or false otherwise.
	 */
	public inline function isInside(x):Bool {
		return ( ( x >= min ) && ( x <= max ) );
	}
	
	/**
	 * Check if the specified range is inside this range
	 * @param	range - Range to check
	 * @return	True if the specified range is inside this range or false otherwise.
	 */
	public inline function isInsideRange(range:IntRange):Bool {
		return (( isInside( range.min ) ) && ( isInside( range.max ) ) );
	}

	/**
	 *
	 * @param	range - Range to check for overlapping
	 * @return	True if the specified range overlaps with this range or false otherwise.
	 */
	public inline function isOverlapping(range:IntRange):Bool {
		return ( ( isInside( range.min ) ) || ( isInside( range.max ) ) );
	}
	
	
	inline function get_length() return max - min;
}