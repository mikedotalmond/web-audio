package flambe.display;

import flambe.Entity;
import flambe.Component;
import flambe.display.SpriteSheet;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class ThreeSliceY extends Component {
	
	public var x(get, set):Float;
	public var y(get, set):Float;
	public var height(get, set):Float;
	
	public var minHeight(get, never):Float;
	function get_minHeight():Float return edgesHeight + 1;
	
	var parts		:Array<Sprite>;
	var edgesHeight	:Float;
	
	
	/**
	 * Create a new ThreeSliceY from a SpriteSheet sub-texture
	 * @param	data
	 * @param	?edgeHeight
	 * @return
	 */
	public static function fromSubTexture(t:SubTexture, ?edgeHeight:Int=-1):ThreeSliceY {
		var half = Math.round(t.height / 2);
		if (edgeHeight == -1) edgeHeight = half - 1;
		var parentTexture = t.parent;
		return new ThreeSliceY([
			new ImageSprite(parentTexture.subTexture(t.x, t.y, t.width, edgeHeight)), //top
			new ImageSprite(parentTexture.subTexture(t.x, t.y + half - 1, t.width, 1)), //mid
			new ImageSprite(parentTexture.subTexture(t.x, t.y + t.height - edgeHeight, t.width, edgeHeight)) //bottom
		]);
	}
	
	
	/**
	 * Create a ThreeSliceY sprite from top, middle, and bottom sprites
	 * @param	parts - sprites to use as top,middle,bottoma regions
	 */
	public function new(parts:Array<Sprite>) {
		this.parts = parts;
		if (parts.length != 3) throw 'Expected exactly 3 parts, but got ${parts.length}';
		edgesHeight	= parts[0].getNaturalHeight() + parts[2].getNaturalHeight();
		_height		= minHeight;
	}
	
	
	override public function onAdded() {
		for (part in parts) owner.addChild(new Entity().add(part));
	}
	
	
	var _height:Float = 0;
	function get_height() return _height;
	function set_height(value) {
		
		var h 			= (value < minHeight) ? minHeight : value;
		var midScale 	= h - edgesHeight;
		
		parts[1].scaleY._ = midScale;
		parts[2].y._ = parts[1].y._ + parts[1].scaleY._;
		
		return _height = h;
	}
	
	
	var _y:Float = 0;
	function get_y() return _y;
	function set_y(value) {
		parts[0].y._ = value;
		parts[1].y._ = value + parts[0].getNaturalHeight();
		parts[2].y._ = parts[1].y._ + parts[1].scaleY._;
		return _y = value;
	}
	
	var _x:Float = 0;
	function get_x() return _x;
	function set_x(value) {
		return _x 		=
		parts[0].x._ 	=
		parts[1].x._ 	=
		parts[2].x._ 	= value;
	}
}