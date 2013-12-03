package synth.ui;
import haxe.Http;
import haxe.Template;
import js.Browser;
import js.html.DOMParser;
import js.html.Element;
import js.html.NodeList;
import msignal.Signal.Signal1;
import utils.KeyboardNotes;

/**
 * ...
 * @author Mike Almond - https://github.com/mikedotalmond
 */
class MonoSynthUI {
	
	var template		:Template;
	
	var modules			:NodeList;
	
	public var keyboard	(default,null):KeyboardUI;
	
	public function new(keyboardNotes:KeyboardNotes) {
		
		keyboard = new KeyboardUI(keyboardNotes);
		
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
		
		var tData = {
			modules: {
				visible:true,
				osc:{visible:true},
				adsr:{visible:true},
				filter:{visible:true},
				outGain:{visible:true},
			},
			keyboard : keyboard.getKeyboardData(2,3)
		};
		
		var markup 		= template.execute(tData);
		var container 	= new DOMParser().parseFromString(markup, 'text/html').getElementById('container');
			
		while (Browser.document.body.firstChild != null) Browser.document.body.removeChild(Browser.document.body.firstChild);
		Browser.document.body.appendChild(container);
		
		setupControls(container);
	}
	
	
	function setupControls(container:Element) {
		
		modules = container.getElementsByClassName("module");
		
		keyboard.setup(container.getElementsByClassName("key"));
	}
	
}