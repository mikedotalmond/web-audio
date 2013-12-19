package audio.parameter;

/**
 * ...
 * @author Mike Almond
 */

import audio.parameter.Parameter;

interface IParameterObserver {
	function onParameterChange(parameter:Parameter):Void;
}