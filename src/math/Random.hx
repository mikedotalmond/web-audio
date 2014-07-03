/**
* ...
* @author Mike Almond
*
* Fast random number generator based on...
*
* The Park–Miller random number generator (Lehmer random number generator)
* http://en.wikipedia.org/wiki/Park%E2%80%93Miller_random_number_generator
*
* Implemented here using the Mersenne prime M31 (0x41A7 === 16807)
*/

package math;

class Random {
	
	/**
	 * set seed with a 31 bit unsigned Integer
	 * between 1 and 0X7FFFFFFE inclusive.
	 */
	var seed(get, set):Int;
	
	public function new(seed:Int = 1) {
		this.seed = seed;
	}
	
	/**
	 * @return provides the next pseudorandom number
	 * as an unsigned Integer (31 bits)
	 */
	public inline function nextInt() {
		return gen();
	}
	
	/**
	 * @return provides the next pseudorandom number
	 * as a float between nearly 0 and nearly 1.0.
	 * 1/2147483647 == 4.65661288e-10
	 */
	public inline function nextFloat():Float {
		return (gen() * 4.65661288e-10);
	}
	
	/**
	 * @return provides the next pseudorandom number
	 * as an unsigned Integer (31 bits) betweeen
	 * a given range.
	 */
	public inline function nextIntRange(min:Float, max:Float):Int{
		return Std.int(nextFloatRange(min, max));
	}
	
	/**
	 * @param	min
	 * @param	max
	 * @return	provides the next pseudorandom number as a float between a given range.
	 */
	public inline function nextFloatRange(min:Float, max:Float):Float {
		return min + ((max - min) * nextFloat());
	}
	
	/**
	 * generator:
	 * new-value = (old-value * 16807) mod (2^31 - 1)
	 */
	inline function gen():Int {
		return _seed = ((_seed * 0x41A7) % 0x7FFFFFFF);
	}
	
	inline function get_seed() return _seed;
	
	/**
	 * set seed with a 31 bit unsigned Integer
	 * between 1 and 0X7FFFFFFE inclusive.
	 */
	inline function set_seed(value:Int) {
		if (value < 1 || value > 0x7FFFFFFE) { throw 'Seed out of range'; }
		_seed = value;
	}
}