package math/*s*/;

/**
 * Some useful functions, and optimised approximations for audio work
 * ...
 * @author Mike Almond 
 */

@:final
class Tools {
	
	static inline var LN10_10:Float = 10.0 / Const.LN10;
	
	
	public static inline function sampleRateFromBPM(baseBPM:Float, targetBPM:Float):Float {
		return targetBPM / baseBPM;
	}
	
	/**
	 * Converts x dB of gain change to a multiplier using gainMult = 10^(dBGain/10)
	 * @param	gain
	 * @return	gain multiplier
	 */
	public static inline function gainToMultiplier(dBGain:Float):Float {
		return Math.pow(10, dBGain * 0.1);
	}
	
	/**
	 * Convert a multiplication amount to a relative dB change
	 * @param	gain multiplier
	 * @return	dB of gain change
	 */
	public static inline function multiplierToGain(mult:Float):Float {
		return LN10_10 * Math.log(mult);
	}
	
	/**
	 * Same as Math.abs, but faster
	 * @param	value
	 * @return
	 */
	public static inline function abs(value:Float):Float{
		return (value < 0) ? -value : value;
	}
	
	/**
	 * @param	value
	 * @return	cosh of value
	 */
	public static inline function cosh(value:Float):Float{
		return 0.5 * ( Math.pow(Const.E, value) + Math.pow(Const.E, -(value)));
	}
	
	/**
	 * @param	value
	 * @return	sinh of value
	 */
	public static inline function sinh(value:Float):Float{
		return 0.5 * ( Math.pow(Const.E, value) - Math.pow(Const.E, -(value)));
	}
	
	/**
	 * Calculates power of 2
	 * @param	power
	 * @return	Returns the specified power of 2 in the case if power is in the range of 0-30. Otherwise returns 0.
	 */
	public static inline function pow2(power:Int):Int{
		return ( ( power >= 0 ) && ( power <= 30 ) ) ? ( 1 << power ) : 0;
	}
	
	/**
	 * Checks if the specified Integer is power of 2
	 * @param	x	Integer number to check
	 * @return	true if the specified number is power of 2. Otherwise returns false
	 */
	public static inline function isPowerOf2(x:Int):Bool{
		return ( x & ( x - 1 ) ) == 0;
	}
	
	/**
	 * Get base of binary logarithm
	 * @param	x	Source Integer number
	 * @return	Power of the number (base of binary logarithm).
	 */
	public static function log2(x:Int):Int {
		if ( x <= 65536 ){
			if ( x <= 256 ){
				if ( x <= 16 ){
					if ( x <= 4 ){
						if ( x <= 2 ){
							if ( x <= 1 ){
								return 0;
							}
							return 1;
						}
						return 2;
					}
					if ( x <= 8 ) {
						return 3;
					}
					return 4;
				}
				if ( x <= 64 ){
					if ( x <= 32 ){
						return 5;
					}
					return 6;
				}
				if ( x <= 128 ){
					return 7;
				}
				return 8;
			}
			if ( x <= 4096 ){
				if ( x <= 1024 ){
					if ( x <= 512 ){
						return 9;
					}
					return 10;
				}
				if ( x <= 2048 ){
					return 11;
				}
				return 12;
			}
			if ( x <= 16384 ){
				if ( x <= 8192 ){
					return 13;
				}
				return 14;
			}
			if ( x <= 32768 ){
				return 15;
			}
			return 16;
		}

		if ( x <= 16777216 ){
			if ( x <= 1048576 ){
				if ( x <= 262144 ){
					if ( x <= 131072 ){
						return 17;
					}
					return 18;
				}
				if ( x <= 524288 ){
					return 19;
				}
				return 20;
			}
			if ( x <= 4194304 ){
				if ( x <= 2097152 ){
					return 21;
				}
				return 22;
			}
			if ( x <= 8388608 ){
				return 23;
			}
			return 24;
		}
		if ( x <= 268435456 ){
			if ( x <= 67108864 ){
				if ( x <= 33554432 ){
					return 25;
				}
				return 26;
			}
			if ( x <= 134217728 ){
				return 27;
			}
			return 28;
		}
		if ( x <= 1073741824 ){
			if ( x <= 536870912 ){
				return 29;
			}
			return 30;
		}
		return 31;
	}
	
	
	/**
	 * Fast(ish) approximation of the Exponential function - Math.exp(x)
	 * Approximates a value by performing a limited expansion of the Taylor series for the exponential function
	 * Works OK for values of x up to about 2-3, then the errors increase... increasingly
	 * @param	x
	 * @return  roughly e^x
	 */
	public static inline function fExp(x:Float):Float {
		var x2 = x * x;
		var x3 = x2 * x;
		var x4 = x3 * x;
		var x5 = x4 * x;
		var x6 = x5 * x;
		var x7 = x6 * x;
		//e^x = 1 + x + ((x*x)/2!) + ((x*x*x)/3!) + ((x*x*x*x)/4!) + ...
		return 1 + x + (x2 * 0.5) + (x3 * 0.16666667) + (x4 * 0.04166667) + (x5 * 0.00833333) + (x6 * 0.00138889) + (x7 * 0.00019841);
	}
}
