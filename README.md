# M o n o s y n t h

### Playing with [Haxe](http://haxe.org/), [Flambe](https://github.com/aduros/flambe), and the [Web-Audio](http://www.w3.org/TR/webaudio/) APIs


#### What?
A (fairly) simple [monosynth](https://en.wikipedia.org/wiki/Monosynth#Monophonic) experiment for your browser.


#### Presets
There are a few presets, but no UI for selecting them at the moment... you can however use the arrow-keys to cycle through them. All current key controls are listed below.


#### Support
Currently only works in Chrome. 
You might get some odd sounds in Firefox, or nothing at all.


#### Audio routing
`OSC0 + OSC1 [Phase Delay] ==> ADSR ==> Distortion [WaveShaper + Crusher] ==> Filter [BiQuad + Env] ==> FeedbackDelay [Mix + Feedback + LPF] ==> Output Gain`


#### Keys
 * Up / Down arrows - Cycle through presets
 * Left / Right arrows - Shift keyboard octave
 * F - Full-screen
 * F1 - Dump current settings to console
 * F2 - Randomise all settings
 * F3 - Reset
 * Others - Play the synth keyboard!


#### Play
[Here!](http://mikedotalmond.github.io/web-audio/)
