
var chord_diagram = (function(o){

	var $strings,
		$muteButtonWrap,
		$muteButtons,
		$notes,
		$fingers,
		fingerIconFraHtml = '<div class="finger"></div>',
		noteArray = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],
		openStringNoteIndex = [4,11,7,2,9,4],
		outputArray = [0,0,0,0,0,0];

	//var noteArray2 = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];

	var getNote = function(stringIndex , fretIndex){
		var initNote = (openStringNoteIndex[stringIndex] + fretIndex +1 ) % 12;		
		return noteArray[initNote];
	}

	o.resetNote = function(){
		$muteButtons.removeClass("mute disable");
		$fingers.hide();
	}

	o.parseNote = function(){				
		o.resetNote();				
		for(var i = 0; i < 6 ; i++){
			var note = outputArray[i];			
			if(note < 0){				
				$muteButtons.eq(i).trigger("click");
			}
			else if(note == 0){								
				$notes.eq(i).html(getNote(i,-1));				
			}
			else{
				$strings.eq(i).find(".fretWrap").eq(note-1).trigger("click");
				$notes.eq(i).html(getNote(i,note-1));
			}			
		}	
	}

	var setFingerEvent	=	function(){		
		$strings.on("click" , ".fretWrap" , function(){			
			var $this = $(this),
				$sameString = $this.parent(".string"),
				index = $sameString.index(".string"),
				stringIndex = $sameString.index('.string'),				
				fretIndex = $(this).index(),				
				note = getNote(stringIndex , fretIndex-1);

			if($sameString.hasClass("hide")){				
				$sameString.removeClass("hide");				
			}

			$muteButtons.eq(stringIndex).addClass("disable");
			$notes.eq(stringIndex).html(note);
			$sameString.find(".finger").hide();							
			$(this).find(".finger").show();			
			outputArray[index] = fretIndex;
			$.publish("chordDiagramModel/change");
		});
	}


	var setFingerButtonEvent	=	function(){
		$strings.on("click" , ".finger" , function(e){	
			e.stopPropagation();
			e.preventDefault();						
			var index = $(this).parents(".string").index(".string");			
			$muteButtons.eq(index).removeClass("disable");
			$(this).hide();		
			$notes.eq(index).html(getNote(index,-1));
			outputArray[index] = 0;
			$.publish("chordDiagramModel/change");
		});
	}

	var muteStringEvent = function(){		
   		$muteButtonWrap.on("click" , ".muteButton" , function(){
   			var index = $(this).index();   		
   			if($(this).hasClass('mute')){   				
   				$(this).removeClass('mute');
   				$strings.eq(index).removeClass("hide");
   				$notes.eq(index).html(getNote(index,-1));
   				outputArray[index] = 0;
   			}
   			else if($(this).hasClass('disable')){   	
   				$(this).removeClass('disable').addClass('mute');
   				$strings.eq(index).addClass("hide").find(".finger").hide();  
   				$notes.eq(index).html('');
   				outputArray[index] = -1;
   			}
   			else{   				
   				$(this).addClass('mute');
   				$strings.eq(index).addClass("hide");	   				
   				$notes.eq(index).html('');
   				outputArray[index] = -1;
   			}
   			$.publish("chordDiagramModel/change");
   		});
	}


	o.getOutputArray = function(){		
		return outputArray;
	}

	o.init = function($el1 , $el2){
		$strings = $el1;
		$muteButtonWrap = $el2;
		$muteButtons = $muteButtonWrap.find(".muteButton");
		$notes = $(".noteArea .note");
		$fingers = $(".finger");
		bindEvent();
	}

	var bindEvent = function(){
		muteStringEvent();
		setFingerEvent();
		setFingerButtonEvent();
	}	

	
	o.setoutputArray = function(indexArray){		
		if(indexArray instanceof Array && indexArray.length == 6){
			outputArray = indexArray;			
		}		
	}
	
	return o;

})(chord_diagram || {});