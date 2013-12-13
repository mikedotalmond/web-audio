package webaudio.synth.ui;

import flambe.util.Signal0;
import haxe.Http;
import haxe.Template;
import js.Browser;
import js.html.DOMParser;
import js.html.Element;
import js.html.NodeList;

import webaudio.utils.KeyboardNotes;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class MonoSynthUI {
	
	var template		:Template;
	
	public var modules	(default,null):Array<ModuleUI>;
	public var keyboard	(default,null):KeyboardUI;
	public var ready	(default,null):Signal0;
	
	public function new(keyboardNotes:KeyboardNotes) {
		
		ready		= new Signal0();
		keyboard 	= new KeyboardUI(keyboardNotes);
		modules  	= new Array<ModuleUI>();
		
		loadTemplate();
	}
	
	
	function loadTemplate():Void {
		var http:Http = new Http('synth.tpl');
		http.async = true;
		http.onError = function(err) { trace('Error loading synth ui-template: ${err}'); };
		http.onData = templateLoaded;
		http.request();
	}
	
	
	function templateLoaded(data:String) {
		template = new Template(data);
		renderTemplate();
	}
	
	function renderTemplate() {
		
		var data = { modules:getModuleData(), keyboard:keyboard.getKeyboardData(2,3) };
		
		var markup = template.execute(data);
		var container = new DOMParser().parseFromString(markup, 'text/html').getElementById('container');
		
		while (Browser.document.body.firstChild != null) Browser.document.body.removeChild(Browser.document.body.firstChild);
		Browser.document.body.appendChild(container);
		
		setupControls(container);
		
		ready.emit();
	}
	
	function getModuleData() {
		return {
				visible:true,
				osc:{visible:true},
				adsr:{visible:true},
				filter:{visible:true},
				outGain:{visible:true},
			}
	}
	
	
	function setupControls(container:Element) {
		modules = ModuleUI.setupFromNodes(container.getElementsByClassName("module"));
		keyboard.setup(container.getElementsByClassName("key"));
	}
}