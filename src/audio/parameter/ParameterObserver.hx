package audio.parameter;

/**
 * ...
 * @author Mike Almond
 */

import audio.parameter.Parameter;

interface ParameterObserver {
	function onParameterChange(parameter:Parameter):Void;
}