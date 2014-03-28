package flambe.display;

import flambe.Component;
import flambe.display.SpriteSheet;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */

/**
 * A basic 9-Slice implementation
 */
class NineSlice extends Component {
	
	public var x(get, set):Float;
	public var y(get, set):Float;
	public var width(get, set):Float;
	public var height(get, set):Float;
	
	public var tintR(get, set):Float;
	public var tintG(get, set):Float;
	public var tintB(get, set):Float;
	
	var parts		:Array<Sprite>;
	
	var minWidth	:Float;
	var minHeight	:Float;
	var xOffset		:Float;
	var yOffset		:Float;
	
	
	/**
	 * Generates slices needed for 9-slice scaling, takes a single x and y offset to define the top/bottom and left/right inset
	 * @param	d
	 * @param	xOffset
	 * @param	yOffset
	 * @return
	 */
	public static function fromSubTexture(t:SubTexture, xOffset:Int=0, yOffset:Int=0):NineSlice {
			
		if (xOffset < 1) xOffset = Math.round(t.width / 2);
		if (yOffset < 1) yOffset = Math.round(t.height / 2);
		
		var xMid = Math.round(t.width / 2);
		var yMid = Math.round(t.height / 2);
		
		var parentTexture = t.parent;
		
		return new NineSlice([
			new ImageSprite(parentTexture.subTexture(t.x + xMid, t.y, 1, yOffset)), //topMid
			new ImageSprite(parentTexture.subTexture(t.x + xMid, t.y + yMid, 1, 1)), //midMid
			new ImageSprite(parentTexture.subTexture(t.x + xMid, t.y + t.height - yOffset, 1, yOffset)),//bottomMid
			
			new ImageSprite(parentTexture.subTexture(t.x + t.width - xOffset, t.y, xOffset, yOffset)), // rightTop
			new ImageSprite(parentTexture.subTexture(t.x + t.width - xOffset, t.y + yMid, xOffset, 1)),// rightMid
			new ImageSprite(parentTexture.subTexture(t.x + t.width - xOffset, t.y + t.height - yOffset, xOffset, yOffset)),// rightBottom
			
			new ImageSprite(parentTexture.subTexture(t.x, t.y, xOffset, yOffset)),//lefTop
			new ImageSprite(parentTexture.subTexture(t.x, t.y + yMid, xOffset, 1)),//leftMid
			new ImageSprite(parentTexture.subTexture(t.x, t.y + t.height - yOffset, xOffset, yOffset)),//leftBottom
		]);
	}
	
	
	/**
	 * Expected parts order is (centre -> top,mid,bottom), (right -> top,mid,bottom), (left -> top,mid,bottom)
	 **/
	public function new(parts:Array<Sprite>) {
		this.parts 	= parts;
		if (parts.length != 9) throw 'Expected exactly 9 parts, but got ${parts.length}';
		
		xOffset		= parts[8].getNaturalWidth();
		yOffset		= parts[8].getNaturalHeight();
		
		minWidth 	= xOffset + xOffset + 1;
		minHeight	= yOffset + yOffset + 1;
		_width 		= minWidth;
		_height 	= minHeight;
		x 			= y = 0;
	}
	
	
	override public function onAdded() {
		for (part in parts) owner.addChild(new Entity().add(part));
	}
	
	
	public function setTint(r,g,b) {
		for (part in parts) part.setTint(r, g, b);
	}
	
	
	var _width:Float = 0;
	function get_width() return _width;
	function set_width(value) {
		
		var w 		= (value < minWidth) ? minWidth : value;
		var scale 	= w - minWidth;
		
		// scale centre top,middle,and bottom slices
		parts[0].scaleX._ = parts[1].scaleX._ = parts[2].scaleX._ = scale;
		
		// position right top,middle,and bottom
		parts[3].x._ = parts[4].x._ = parts[5].x._ = _x + w - minWidth;
		
		return _width = w;
	}
	
	var _height:Float = 0;
	function get_height() return _height;
	function set_height(value) {
		
		var h 		= (value < minHeight) ? minHeight : value;
		var scale 	= h - minHeight;
		
		// scale middle left,centre,and right slices
		parts[1].scaleY._ = parts[4].scaleY._ = parts[7].scaleY._ = scale;
		
		// position bottom left,centre,and right
		parts[2].y._ = parts[5].y._ = parts[8].y._ = _y + h - minHeight;
		
		return _height = h;
	}
	
	
	var _x:Float = 0;
	function get_x() return _x;
	function set_x(value:Float) {
		
		// mid
		parts[0].x._ = parts[1].x._ = parts[2].x._ = value + xOffset;
		
		// right
		parts[3].x._ = parts[4].x._ = parts[5].x._ = value + _width - xOffset - 1;
		
		// left
		parts[6].x._ = parts[7].x._ = parts[8].x._ = value;
		
		return _x = value;
	}
	
	var _y:Float = 0;
	function get_y() return _y;
	function set_y(value:Float) {
		
		// top
		parts[0].y._ = parts[3].y._ = parts[6].y._ = value;
		
		// mid
		parts[1].y._ = parts[4].y._ = parts[7].y._ = value + yOffset;
		
		// bottom
		parts[2].y._ = parts[5].y._ = parts[8].y._ = value + _height - yOffset - 1;
		
		return _y = value;
	}
	
	
	function get_tintR() return parts[0].tintR._;
	function set_tintR(value:Float) {
		for (part in parts) part.tintR._ = value;
		return value;
	}
	
	function get_tintG() return parts[0].tintG._;
	function set_tintG(value:Float) {
		for (part in parts) part.tintG._ = value;
		return value;
	}
	
	function get_tintB() return parts[0].tintB._;
	function set_tintB(value:Float) {
		for (part in parts) part.tintB._ = value;
		return value;
	}
}