package audio.parameter {
	import audio.core.IDisposable;
	
	/**
	 * ...
	 * @author Mike Almond 
	 */
	class ParameterCollection implements IDisposable {
		
		var _params	:Array<Parameter>;
		var _count	:Int;
		
		public function ParameterCollection() {
			_count  = 0;
			_params = new Array<Parameter>();
		}
		
		public function dispose():Void {
			while (--_count > -1) {
				_params[_count].dispose();
				_params[_count] = null;
			}
			_params = null;
		}
		
		public function addParameter(parameter:Parameter):Void {
			_params.push(parameter);
			_count++;
		}
		
		public function removeParameter(parameter:Parameter):Void {
			var i:Int = _params.indexOf(parameter);
			if (i > -1) {
				_params[i].dispose();
				_params[i] = null;
				_params.splice(i, 1);
				_count--;
			}
		}
		
		public function getParameter(name:String):Parameter {
			var i:Int = _count;
			while (--i > -1) {
				if (_params[i].name == name) {
					return _params[i];
				}
			}
			return null;
		}
		
		public function getParameterAt(index:Int):Parameter {
			return _params[index];
		}
		
		public function get length():Int { return _count; }
	}
}