package math;

/**
 *	var a:Complex = new Complex(.5, .25);
 *	var b = new Complex(1, -.5);
 *
 *	trace(a.phase);
 *	trace(a.magnitude);
 *	trace(a.squaredMagnitude);
 *	trace(a);
 *
 *	var c = a - b;
 *	var d = a / b;
 *	var e = a * b;
 *
 *  e*=a;
 *  c+=e;
 *
 *	trace(d);
 *	trace(e);
 *
 *	var f = (a+b+c) / d;
 */

abstract Complex(ComplexNumber) from ComplexNumber to ComplexNumber {
	
	var re(get, set):Float;
	inline function get_re() return this.re;
	inline function set_re(val) return this.re = val;
	
	var im(get, set):Float;
	inline function get_im() return this.im;
	inline function set_im(val) return this.im = val;
	
	public var phase(get, never):Float;
	inline function get_phase():Float return Math.atan( im / re );
	
	public var magnitude(get, never):Float;
	inline function get_magnitude():Float return Math.sqrt(squaredMagnitude);
	
	public var squaredMagnitude(get, never):Float;
	inline function get_squaredMagnitude() return ( re * re + im * im );
	
	public function new (re,im) {
		this = new ComplexNumber(re, im);
		return this;
	}
	
	
	@:op(A + B) static public function add(a:Complex, b:Complex):Complex {
		return new Complex( a.re + b.re, a.im + b.im );
	}
	
	@:op(A - B) static public function minus(a:Complex, b:Complex):Complex {
		return new Complex( a.re - b.re, a.im - b.im );
	}
	
    @:op(A * B) static public function mult(a:Complex, b:Complex):Complex {
       return new Complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re );
    }
	
	@:op(A / B) static public function divide(a:Complex, b:Complex):Complex {
		var divider = b.re * b.re + b.im * b.im;
		if ( divider == 0 ) throw 'Divide by zero';
		return new Complex( ( a.re * b.re + a.im * b.im ) / divider, ( a.im * b.re - a.re * b.im ) / divider );
    }
	
	@:op(A += B) static public function plusEqual(a:Complex, b:Complex):Complex {
		a.re += b.re;
		a.im += b.im;
		return a;
	}
	
	@:op(A *= B) static public function multEqual (a:Complex, b:Complex):Complex {
		a.re = a.re * b.re - a.im * b.im;
		a.im = a.re * b.im + a.im * b.re;
		return a;
	}
	
	public inline function clone():Complex return new Complex(re, im);
	
	public static inline function zero():Complex return new Complex(0, 0);
	
	@:to public inline function toString():String {
		return re + (( im < 0 ) ? ' - ' : ' + ' ) + Tools.abs(im) + 'i';
	}
}

class ComplexNumber {
	
	public var re:Float;
	public var im:Float;
	
	/**
	 *
	 * @param	re	real
	 * @param	im	imaginary
	 */
	public function new(re:Float = .0, im:Float = .0) {
		this.re = re;
		this.im = im;
	}
}