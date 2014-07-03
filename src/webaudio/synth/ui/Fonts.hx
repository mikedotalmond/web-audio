package webaudio.synth.ui;
import flambe.asset.AssetPack;
import flambe.display.Font;
import flambe.display.TextSprite;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond - https://github.com/MadeByPi
 */
class Fonts {
	
	static public var Prime13(default, null):Font;
	static public var Prime14(default, null):Font;
	static public var Prime24(default, null):Font;
	static public var Prime22(default, null):Font;
	static public var Prime20(default, null):Font;
	static public var Prime32(default, null):Font;
	
	static public function setup(pack:AssetPack) {
		Prime13 = new Font(pack, "font/Prime13");
		Prime14 = new Font(pack, "font/Prime14");
		Prime24 = new Font(pack, "font/Prime24");
		Prime22 = new Font(pack, "font/Prime22");
		Prime20 = new Font(pack, "font/Prime20");
		Prime32 = new Font(pack, "font/Prime32");
	}
	
	public static function getField(font:Font, text:String="Pack my box with five dozen liquor jugs.", colour:Int=0x000000):TextSprite {
		
		var r = ((colour >> 16) & 0xff) / 0xff;
		var g = ((colour >> 8) & 0xff) / 0xff;
		var b = (colour & 0xff) / 0xff;
		
		var tf:TextSprite = new TextSprite(font, text);
		tf.pixelSnapping = true;
		tf.pointerEnabled = false;
		tf.setTint(r, g, b);
		
		return tf;
	}
}