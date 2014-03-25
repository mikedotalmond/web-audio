package flambe.display;


import flambe.display.Graphics;
import flambe.display.Sprite;
import flambe.display.SpriteSheet;
import flambe.display.Texture;

/**
 * SubImageSprite
 */
class SubImageSprite extends Sprite {
	
	var tX		:Float;
	var tY		:Float;
	var tWidth	:Float;
	var tHeight	:Float;
	
	public var texture(default, null):Texture;
	
	/**
	 *
	 * @param	texture
	 * @param	bounds - position of a sub-texture within the texture
	 * @param	pivotX
	 * @param	pivotY
	 */
    public function new (texture:Texture, x:Float, y:Float, width:Float, height:Float) {
        super();
		
        this.texture 	= texture;
		tX 				= x;
		tY 				= y;
		tWidth 			= width;
		tHeight			= height;
    }
	
    override public function draw (g :Graphics) g.drawSubTexture(texture, 0, 0, tX, tY, tWidth, tHeight);
	
    override public function getNaturalWidth () return tWidth;
    override public function getNaturalHeight () return tHeight;
	
	public static inline function fromSubTextureData(data:SubTextureData):SubImageSprite {
		return new SubImageSprite(data.texture, data.x, data.y, data.width, data.height);
	}
}
