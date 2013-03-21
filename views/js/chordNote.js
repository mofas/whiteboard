
/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
(function($) {
  var o = $({});
  $.subscribe = function() {
    o.on.apply(o, arguments);
  };
  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };
  $.publish = function() {
    o.trigger.apply(o, arguments);
  };
}(jQuery));



var chordNote = (function(o){

	var fingerIndexMap = ["-","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"];
	var $chordDiagram,	 	
	 	$chordTitleInput,
	 	$chordNoteData,
	 	// $suggestChordNameCollection,
		inputMode = 0,
		$addChordNoteButton,
		$updateChordNoteButton,
		$cancelChordNoteButton,
		$chordList,
		movedObjIndex,
		editTargetId = null,
		isInit = false;

	var queryChordNameTimer = null;


	var DOMCache = function(){
		$chordDiagram = $('.chord_diagramWrap');
		$chordNoteName = $("#chordNoteName");
		$addChordNoteButton = $("#addChordNoteButton");
		$updateChordNoteButton = $("#updateChordNoteButton");
		$cancelChordNoteButton = $("#cancelChordNoteButton");
		$chordNoteList = $("#chordNoteList");
		$chordTitleInput = $("#chordTitle");
		$chordNoteData = $("#chordNoteData");
	}

	var bindEvent = function(){
		
		// $suggestChordNameCollection = $("#suggestChordName");

		// $suggestChordNameCollection.on("click" , "a" , function(){
		// 	var name = $(this).text();
		// 	$chordTitleInput.val(name);
		// 	$suggestChordNameCollection.html('');
		// 	return false;
		// });

		// $("#mainPanel").on("click" , ".downloadLink" , function(){
		// 	$(this).remove();
		// });

		// $chordList.on("click", ".chordItem" , function(){
		// 	$(this).siblings().removeClass("selected").end().addClass("selected");
		// });
				
		// $("#saveImageButton").on("click" , o.saveAsImage);
		$addChordNoteButton.on("click" , o.add);
		$updateChordNoteButton.on("click" , o.update);
		$cancelChordNoteButton.on("click" , o.cancel);
		bindDragAndSortEvent();
	}


	var bindDragAndSortEvent = function(){
		$chordNoteList.disableSelection();
		$chordNoteList.sortable({
			start: function( event, ui ) {
				var $obj = $(ui.item[0]);
				movedObjIndex = $obj.index();
			},
			update: function( event, ui ) {
				var $obj = $(ui.item[0]);
				var newIndex = $obj.index();				
				chord_collection.changeOrder(movedObjIndex , newIndex);
			}
		});
		//temparory disable
		$chordNoteList.sortable("disable");
		$chordNoteList.on("mousedown" , ".listOrderControler" , function(){			
			$chordNoteList.sortable("enable");
		});
		$chordNoteList.on("mouseup" , ".listOrderControler" , function(){			
			$chordNoteList.sortable("disable");
		});
		
	}

	var editMode = function(){
		inputMode = 1;
		$addChordNoteButton.hide();
		$updateChordNoteButton.show();
		$cancelChordNoteButton.show();
	}

	var addMode = function(){
		inputMode = 0;
		$addChordNoteButton.show();
		$updateChordNoteButton.hide();
		$cancelChordNoteButton.hide();
	}
	
	var initByChordNoteInputData = function(){
		var param = $chordNoteData.val(), 
			chordName,
			collection,
			strArray,
			intArray,
			diagramArray,
			noteInfo;		

		collection = param.split("&").slice(1);
		for(var i =0; i < collection.length ;i++){
			chordName = decodeURIComponent(collection[i].split("=")[0]);
			strArray = collection[i].split("=")[1];
			intArray = new Array();
			for(var j=0;j < strArray.length;j++){
				var index = isNaN(parseInt(strArray[j] , 10)) ? -1 : parseInt(strArray[j] , 10);								
				intArray.push(index);				
			}										
			
			o.addByArray(chordName , intArray);
		}
	}
	

	o.init	=	function(){

		if(isInit)
			return;

		isInit = true;
		// $outputLinkWrap = $(".outputLinkWrap");
		// $outputLink = $("#outputLink");
		DOMCache();
		
		var $strings = $(".string"),
			$muteButtonWrap = $(".mutebuttonWrap");
			// $loadingMsg = $outputLinkWrap.find(".loadingMsg");		
				
		chord_diagram.init($strings , $muteButtonWrap);
		$.subscribe("chordDiagramModel/change" , chordDiagramChangeEvent);
		$.subscribe("chordCollections/change" , chordCollectionsChangeEvent);
		initByChordNoteInputData();
		chord_diagram.setoutputArray([0,0,0,0,0,0]);
		chord_diagram.parseNote();
		bindEvent();

		o.outputImage();
	}	

	o.outputImage = function(){
		var outputCanvas = chord_collection.outputCollectionImage();
		$("#chordNote").html(outputCanvas);
		console.log(outputCanvas);
		// var strData = chord_collection.outputCollectionImage();
		// var fragHtml = "<a class='downloadLink' href='" + strData + "' download='和絃.png'>下載</a>";
		// var $button = $(fragHtml);
		// $("#mainPanel").find(".downloadLink").remove();
		// $("#saveImageButton").after($button);			
	}		

	o.add = function(){				
		var outputArray = chord_diagram.getOutputArray(),
			name = $chordTitleInput.val();		
		o.addByArray(name , outputArray);
	}

	o.addByArray = function(name , outputArray){		
		canvas_chord_diagram.setFingerIndex(name , outputArray);
		var index = chord_collection.add(name , canvas_chord_diagram.getCanvas() , outputArray.slice()),
			controlHtml = '<div class="listOrderControler"></div>',
			buttonHtml = 	'<div class="listOperationGroup">'
								+'<span class="btn btn-block btn-success" onclick="chordNote.edit(this , '+index+');" >編輯</span>'
								+'<span class="btn btn-block btn-info" onclick="chordNote.delete(this , '+index+');">刪除</span>'
							'</div>',
			fragmentHtml = $('<li class="chordItem clearfix"></li>');
		fragmentHtml.append(controlHtml);	
		fragmentHtml.append(canvas_chord_diagram.getCanvas());
		fragmentHtml.append(buttonHtml);
		$chordNoteList.append(fragmentHtml);		
	}

	o.edit = function(obj , id){
		var chordObj = chord_collection.get(id);
		$chordTitleInput.val(chordObj.name);
		chord_diagram.setoutputArray(chordObj.fingerIndex);
		$chordNoteList.find("li.currentEdit").removeClass("currentEdit");		
		$(obj).parents("li").addClass("currentEdit");
		editTargetId = id;
		chord_diagram.parseNote();
		editMode();
	}

	o.update = function(){
		var outputArray = chord_diagram.getOutputArray(),
			name = $chordTitleInput.val();
			
		canvas_chord_diagram.setFingerIndex(name , outputArray);
		chord_collection.update(editTargetId , name , canvas_chord_diagram.getCanvas() , outputArray);
		var $currentEditLi = $chordNoteList.find("li.currentEdit");
		$currentEditLi.find("canvas").remove();
		$currentEditLi.find(".listOrderControler").after(canvas_chord_diagram.getCanvas());		
		editTargetId = null;
		$chordNoteList.find("li").removeClass("currentEdit");
		addMode();
	}

	o.delete = function(obj , id){
		chord_collection.delete(id);		
		$(obj).parents("li").detach();
		if(inputMode == 1){
			o.cancel();
		}
	}

	o.cancel = function(){
		chord_diagram.setoutputArray([0,0,0,0,0,0]);
		$chordTitleInput.val("");
		chord_diagram.parseNote();
		editTargetId = null;
		$("#chordList li").removeClass("currentEdit");
		addMode();
	}

	var chordDiagramChangeEvent = function(){		
		// clearTimeout(queryChordNameTimer);
		// queryChordNameTimer = setTimeout(o.queryChordName , 1000);		
	}

	var chordCollectionsChangeEvent = function(){		
		changeNoteInputData();
	}


	var changeNoteInputData = function(){
		var data = chord_collection.outputCollectionURL();				
		$chordNoteData.val(data);
	}	

	// o.queryChordName = function(){
	// 	var outputArray = chord_diagram.getOutputArray();		
	// 	chordName.queryChordName(outputArray , o.queryChordNameComplete);			
	// }

	// o.queryChordNameComplete = function(suggestionName){
	// 	$chordTitleInput.autocomplete({
	//            source: suggestionName
 	//        });
	// 	var htmlFragment = "";
	// 	for(var i =0; i<suggestionName.length ; i++){
	// 		htmlFragment += '<a href="#">' + suggestionName[i] + '</a>';
	// 	}
	// 	if(suggestionName.length ===0 ){
	// 		htmlFragment = '<span class="no-result">資料庫尚無資料</span>'
	// 	}
	// 	$suggestChordNameCollection.html(htmlFragment);
	// } 


	return o;

})(chordNote || {});
