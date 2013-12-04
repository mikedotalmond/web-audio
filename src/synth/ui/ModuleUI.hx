package synth.ui;
import js.html.Element;
import js.html.Event;
import js.html.InputElement;
import js.html.NodeList;
import msignal.Signal.Signal2;
import synth.ui.ModuleUI.RangeControl;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class ModuleUI {
	
	public var controls:Array<RangeControl>;

	public var sliderChange(default, null):Signal2<String,Float>;
	
	var id:String;
	
	public function new() {
		controls = [];
		sliderChange = new Signal2<String,Float>();
	}
	
	public function addControl(control:RangeControl) {
		
		var n = controls.length;
		control.input.addEventListener('change', onRangeChange.bind(_, n));
		
		controls.push(control);
	}
	
	
	function onRangeChange(e:Event, index:Int):Void {
		
		e.stopPropagation();
		
		var control = controls[index];
		var value 	= Std.parseFloat(control.input.value);
		
		sliderChange.dispatch(control.id, value);
	}
	
	
	static public function setupFromNodes(nodes:NodeList):Array<ModuleUI> {
		
		var modules = [];
		
		for (node in nodes) {
			
			var module = new ModuleUI();
			
			var e:Element = cast node;
			//var children = e.childNodes
			
			for (n in node.childNodes) {
				if (n.nodeType == 1) { // Element Node
					var control = createControl(cast n);
					if (control != null) module.addControl(control);
				}
			}
			
			modules.push(module);
		}
		
		return modules;
	}
	
	
	static function createControl(control:Element):RangeControl {
		
		if (control.className.indexOf('slider') != -1) {
			// currently modules only contain input range-sliders
			/*<div class="slider volume">
				<span class="label">Out</span>
				<input title="Output gain" type="range" id="outGain" min="-1" max="1" step=".01" value="0" />
			</div>*/
			
			var input:InputElement = cast control.getElementsByTagName('input').item(0);
			
			//var label = control.getElementsByTagName('span')[0].nodeValue;
			
			var settings = {
				title:input.getAttribute('title'),
				type:input.getAttribute('type'),
				min:Std.parseFloat(input.getAttribute('min')),
				max:Std.parseFloat(input.getAttribute('max')),
				step:Std.parseFloat(input.getAttribute('step')),
				defaultValue:Std.parseFloat(input.getAttribute('value')),
			}
			
			var range = new RangeControl(input, settings);
			return range;
		}
		
		return null;
	}
}

typedef RangeControlSettings = {
	var title:String;
	var type:String;
	var	min:Float;
	var	max:Float;
	var	step:Float;
	var	defaultValue:Float;
}

@:allow(synth.ui.ModuleUI) 
class RangeControl {
	
	var id		:String;
	var input	:InputElement;
	var settings:RangeControlSettings;
	
	function new(input:InputElement, settings:RangeControlSettings) {
		this.input = input;
		this.settings = settings;
		this.id = input.id;
	}	
}