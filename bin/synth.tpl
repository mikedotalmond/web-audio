<div class="container"><!-- Based on http://codepen.io/lukeyphills/pen/CEfHx -->
	<div class="synth">
		<div class="touch-move-scroll-blocker"></div>
		::if modules.visible::
		<div class="modules">
			::if modules.osc.visible::
			<div class="module osc">
				<div class="slider waveform">
					<span class="label">Oscillator</span>
					<input type="range" id="osc-shape" min="0" max="3" step="1" value="2" />
				</div>
			</div>
			::end::
			
			::if modules.filter.visible::
			<div class="module filter">
				<div class="slider filterType">
					<span class="label">Filter mode</span>
					<input type="range" id="filter-type" min="0" max="5" step="1" value="0" />
				</div>
				<div class="slider">
					<span class="label">Freq</span>
					<input type="range" id="filter-freq" min="0" max="1" step=".05" value=".7" />
				</div>                    
				<div class="slider">
					<span class="label">Q</span>
					<input type="range" id="filter-res" min="0" max="1" step=".01" value=".4" />
				</div>
				<div class="slider">
					<span class="label">Gain</span>
					<input type="range" id="filter-gain" min="-12" max="3" step=".01" value="0" />
				</div>
			</div>
			::end::
			
			::if modules.adsr.visible::
			<div class="module adsr">        
				<div class="slider">
					<span class="label">Attack</span>
					<input type="range" id="adsr-attack" min="0.0" max="3.0" step=".01" value="0" />
				</div>
				<div class="slider">
					<span class="label">Decay</span>
					<input type="range" id="adsr-decay" min="0.0" max="3.0" step=".01" value="3.0" />
				</div>                    
				<div class="slider">
					<span class="label">Sustain</span>
					<input type="range" id="adsr-sustain" min="0.0" max="1.0" step=".01" value="1.0" />
				</div>
				<div class="slider">
					<span class="label">Release</span>	
					<input type="range" id="adsr-release" min="0.0" max="3.0" step=".01" value="1.0" />
				</div>
			</div>
			::end::
			
			::if modules.outGain.visible::
			<div class="module outGain">
				<div class="slider volume">
					<span class="label">Volume</span>
					<input type="range" id="outGain" min="0" max="1" step=".01" value="2" />
				</div>
			</div>
			::end::
			
		</div>
		<br />
		::end::
		
		::if keyboard.visible::
		<div id="piano-keys">				
			::foreach keyboard.keys::
				<div id="natural" class="key" data-note="::note::::octave::">
				::if hasSharp::
					<div id="sharp" class="key" data-note="::note::#::octave::"></div>
				::end::
				</div>
			::end::
		</div>
		::end::
	</div>
</div>