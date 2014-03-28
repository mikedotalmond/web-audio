package flambe.display;

import flambe.Entity;
import flambe.Component;
import flambe.display.SpriteSheet;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class ThreeSliceX extends Component {
	
	public var x(get, set):Float;
	public var y(get, set):Float;
	public var width(get, set):Float;
	
	public var minWidth(get, never):Float;
	function get_minWidth():Float return edgesWidth + 1;
	
	var parts		:Array<Sprite>;
	var edgesWidth	:Float;
	
	
	/**
	 * Create a new ThreeSliceX from a SpriteSheet sub-texture
	 * @param	data
	 * @param	?edgeHeight
	 * @return
	 */
	public static function fromSubTexture(t:SubTexture, edgeWidth:Int=-1):ThreeSliceX {
		var half = Math.round(t.width / 2);
		if (edgeWidth == -1) edgeWidth = half - 1;
		var parentTexture = t.parent;
		return new ThreeSliceX([
			new ImageSprite(parentTexture.subTexture(t.x, t.y, edgeWidth, t.height)), // left
			new ImageSprite(parentTexture.subTexture(t.x + half - 1, t.y, 1, t.height)),  // mid
			new ImageSprite(parentTexture.subTexture(t.x + t.width - edgeWidth, t.y, edgeWidth, t.height)), // right
		]);
	}
	
	/**
	 * Create a ThreeSliceX sprite from left, middle, and right sprites
	 * @param	parts - sprites to use as top,middle,bottoma regions
	 */
	public function new(parts:Array<Sprite>) {
		this.parts 	= parts;
		if (parts.length != 3) throw 'Expected exactly 3 parts, but got ${parts.length}';
		edgesWidth 	= parts[0].getNaturalWidth() + parts[2].getNaturalWidth();
		_width 		= minWidth;
	}
	
	
	override public function onAdded() {
		for (part in parts) owner.addChild(new Entity().add(part));
	}
	
	
	var _width:Float = 0;
	function get_width() return _width;
	function set_width(value) {
		
		var w 			= (value < minWidth) ? minWidth : value;
		var midScale 	= w - edgesWidth;
		
		parts[1].scaleX._ = midScale;
		parts[2].x._ = parts[1].x._ + parts[1].scaleX._;
		
		return _width = w;
	}
	
	
	var _x:Float = 0;
	function get_x() return _x;
	function set_x(value) {
		parts[0].x._ = value;
		parts[1].x._ = value + parts[0].getNaturalWidth();
		parts[2].x._ = parts[1].x._ + parts[1].scaleX._;
		return _x = value;
	}
	
	var _y:Float = 0;
	function get_y() return _y;
	function set_y(value) {
		return _y 		=
		parts[0].y._ 	=
		parts[1].y._ 	=
		parts[2].y._ 	= value;
	}
}