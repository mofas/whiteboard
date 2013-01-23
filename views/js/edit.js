// Shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


$(document).ready(function() {
	editOperation.init();
});

var editOperation = (function(o){

	var $editForm, 
		$lyric,		
		$tabbable,
		$sourceCodeDialog,
		$sourceCodeText,

		$chordWrap,
		$chordCanvas,
		$chordTool,
		$chordCollection,

		$chordGenegator , 		
		$chordCollectionList,
		$deleteArea,

		$preview,
		$loadingOverlay;

	var sourCode , isSourceCodeChange = false , arrangeMode = false,
		ChordSynTimer , chordScrollHeight = 0,
		YBasicOffset = 3 , YDenominator = 50 , XBasicOffset = 120 , Xenominator = 10;

	var usedChordCollections = [];

	var createChordObj_Root = "" , createChordObj_Chord = "";

	var bindEvent = function(){		
		$("#submitButton").on("click" , function(){			
			o.submit($(this).attr("data-id"));
		});
		$("#deleteButton").on("click" , function(){			
			o.delete($(this).attr("data-id"));
		});

		$("#arrangeModeButton").on("click" , o.openArrangeMode);
		$("#sourceCodeModeButton").on("click" , o.openSourceCodeDialog);
		$("#updateArrangeButton").on("click" , o.updateArrange);
		$("#abortArrangeButton").on("click" , o.abortArrange);		

		$("#saveSourceCodeButton").on("click" , o.updateSourceCode);
		$("#abortSourceCodeButton").on("click" , o.abortSourceCodeDialog);
		

		$tabbable.on("click" , "li" , function(){
			var targetId = $(this).find("a").attr("href");
			if(targetId === '#previewView'){
				if(arrangeMode){
					var answer = confirm("是否要更新和絃狀態?");
					if(answer){
						o.updateArrange();
					}					
				}
				o.updatePreview();				
			}
			$tabbable.find("li").removeClass("active");
			$(this).addClass("active");
			$tabbable.find(".tab-pane").removeClass("active")
			$tabbable.find(targetId).addClass("active");			
			return false;
		});
		
		$chordCollectionList.on("mousedown" , ".chordItem" , function(e){							
			var text = $(this).text();
			var parentOffset = $chordCollection.offset(); 
			var cursorX = e.pageX - parentOffset.left - 20 , cursorY = e.pageY - parentOffset.top - 10;						
			var $chordObj = $('<div class="chord ui-draggable" style="left:' + cursorX + 'px;top:' + cursorY + 'px;">' + text + '</div>');
			$chordCollection.append($chordObj);			
			$chordObj.draggable({ 
				containment: ".chordCanvas"
			}).trigger(e);						
		});
		
		//touch event (testing)				
		$chordWrap.on("mouseover touchstart" , ".chord" , function(){
			$(this).draggable({ 
				containment: ".chordCollection"				
			});
		});

		//delete chord obj		
		$deleteArea.droppable({
			accept: ".chord",
			drop: function( event, ui ) {				
				ui.draggable.remove();
			}
	    });
		
			

		$chordWrap.on("dblclick" , ".chord" , chordEditEvent);

		//remove chord
		$chordCollectionList.on("click" , ".close" , function(){
			var $parent = $(this).parent();
			var index = $parent.index();						
			usedChordCollections.splice(index-1,1);			
			$parent.remove();
		});


		var checkChordGenegator = function(){
			if(createChordObj_Root.length > 0 && createChordObj_Chord.length > 0){				
				o.genegrateChord(createChordObj_Root, createChordObj_Chord);
				createChordObj_Root = "";
				createChordObj_Chord = "";
				$chordGenegator.find(".btn").removeClass("btn-inverse disabled");
			}
		}

		//create new chord Event 
		$chordGenegator.find(".rootNoteBtnGroup").on("click" , ".btn" , function(){			
			var $this = $(this);
			$this.siblings().removeClass("btn-inverse");
			$this.addClass("btn-inverse disabled");
			createChordObj_Root = $this.text();			
			checkChordGenegator();
			return false;
		});
		$chordGenegator.find(".chordTypeGroup").on("click" , ".btn" , function(){			
			var $this = $(this);
			$this.siblings().removeClass("btn-inverse");
			$this.addClass("btn-inverse disabled");
			createChordObj_Chord = $this.text();
			checkChordGenegator();
			return false;
		});


		$("#changeRootDisplay").on("click" , function(){			
			$chordGenegator.find(".rootNoteBtnGroup .btn-group.selected").removeClass("selected").siblings().addClass("selected");
			return false;
		});

		$("#changeChordDisplay").on("click" , function(){			
			var $btnGroup = $chordGenegator.find(".chordTypeGroup .btn-group");			
			var index = $btnGroup.filter(".selected").index();

			console.log($btnGroup.length);
			index = (index < $btnGroup.length -1) ? ++index : 0;
			console.log(index);
			$btnGroup.removeClass("selected").eq(index).addClass("selected");
			return false;
		});
		
		
	}

	var initSongFormat = function(){
		sourceCode = $sourceCodeText.val();		
		songFormatCompiler.setObjBySourceCode(sourceCode);
		$lyric.val(songFormatCompiler.getPlainLyric());
	}

	o.init = function(){
		$editForm = $("#editForm");
		$lyric = $("#lyric");
		
		$tabbable = $editForm.find(".tabbable");
		$chordWrap = $editForm.find(".chordWrap");		
		$chordCanvas = $chordWrap.find(".chordCanvas");
		$chordTool = $chordWrap.find(".chordTool");
		$deleteArea = $chordWrap.find("#deleteArea");
		$chordGenegator = $editForm.find("#chordGenegator");
		$chordCollection = $chordWrap.find(".chordCollection");
		$chordCollectionList = $editForm.find("#chordCollectionList");		
		$sourceCodeDialog = $("#sourceCodeDialog");
		$sourceCodeText = $("#sourceCode");		
		$preview = $("#preview");
		$loadingOverlay = $("#loadingOverlay");
		bindEvent();
		initSongFormat();
	}

	o.submit = function(id){
		$loadingOverlay.show();
		updatePlainLyric();
		var params = $editForm.serialize();					
		if(id != null){
			$.post("/update/" + id, params , function(data){
				if(data.errCode == 0 ){
					alert("儲存成功");
				}
				else{
					alert(data.msg);
				}
				$loadingOverlay.hide();
			});
		}
		else{
			$.post("/add", params , function(data){
				if(data.errCode == 0 ){
					alert("新增成功");					
					window.location.href = 'edit/' + data.obj._id ; 	
				}
				else{
					alert(data.msg);
				}
				$loadingOverlay.hide();
			});			
		}		
	}

	o.delete = function(id){		
		if(id != null){
			if(confirm("確定要刪除此歌譜?")){
				$.post("/delete/" + id , function(data){				
					if(data.errCode == 0 ){
						alert("刪除成功");
						window.location.href = "/list";
					}
					else{
						alert(data.msg);
					}
				});	
			}			
		}	
	}

	o.updatePreview = function(){
		updatePlainLyric();
		$preview.addClass("songFormat").html(songFormatCompiler.getoutputFormat());		
	}

	o.openArrangeMode = function(){
		if(arrangeMode){
			o.abortArrange();
			$lyric.off("scroll");
		}
		else{			
			$lyric.css({
				"line-height" : "50px",
				"margin-left" : "120px",
				"width" : "805px"
			});
			$chordWrap.show();
			$chordGenegator.show();			
			//update plain lyric
			updatePlainLyric();
			var chordHtml = genegrateChordsHtml(songFormatCompiler.getChordObjArray());			
			$chordCollection.html(chordHtml).css({ "height" : $lyric[0].scrollHeight + "px" });			
			arrangeMode = true;
			chordScrollSyn();
			$lyric.trigger("scroll");
		}		
	}


	var updatePlainLyric = function(){
		var plainLyric = $lyric.val();
		songFormatCompiler.updateLyric(plainLyric);
		$sourceCodeText.val(songFormatCompiler.getSourceCode());
	}

	var genegrateChordsHtml = function(chordObjArray){		
		var chordObjArrayLength = chordObjArray.length,
			fragHtml = "",
			chordObj;
		for(var i = 0; i< chordObjArrayLength ;i++){
			chordObj = chordObjArray[i];			
			fragHtml += "<span class='chord' style='left:"+ (XBasicOffset+chordObj.chordPosition*Xenominator) +"px; top:"+ (YBasicOffset+chordObj.chordLine*YDenominator) + "px;' >" + chordObj.chordName + "</span>";
		}		
		return fragHtml;
	}

	var chordEditEvent = function(){
		var $this = $(this);		
		$this.html('<input type="text" placeholder="和絃" value="' + $this.text()+ '">');

		$this.find("input").focus().on("keydown" , function(e){
			if(e.keyCode === 13){
				finishEditChord($this);
			}				
		});
		$chordCollection.one("click"  , function(){
			finishEditChord($this);
		});		
		$this.click(function(event){
     		event.stopPropagation();
 		});
	}

	var finishEditChord = function($obj){
		$chordCollection.off("click");
		var text = $obj.find("input").val();
		if(text.length < 1){
			$obj.remove();
		}else{
			$obj.html($obj.find("input").val());	
		}		
	}

	var chordScrollSyn = function(){
		$chordWrap.on("mousewheel" , function(e){
			e.preventDefault();
			var scrollP = $lyric.scrollTop();
			var scrollLength = e.originalEvent.wheelDelta/120*50;			
	        $lyric.scrollTop(scrollP-scrollLength);
		});		
		$lyric.on("scroll" , function(e){			
			chordScrollHeight = e.target.scrollTop;					
		});

		relocateChordCanvas();
	}

	var relocateChordCanvas = function(){		
		if(!arrangeMode)
			return;
		
		$chordCanvas.css({ "top" : -chordScrollHeight });
		$chordTool.css({ "top" : chordScrollHeight+20 });		
		$chordCollectionList.css({ "top" : chordScrollHeight });
		requestAnimFrame(relocateChordCanvas);
	}


	o.genegrateChord = function(root, chord){				
		var chordName = root + chord;
		//check usedChordCollections
		var count = usedChordCollections.length;		
		while(count--){
			if(usedChordCollections[count] === chordName){
				var $obj = $chordCollectionList.find(".chordItem").eq(count);
				$obj.addClass("btn-danger");
				setTimeout(function(){
					$obj.removeClass("btn-danger");
				} , 1000);				
				return;
			}
		}
		$deleteArea.after("<div class='chordUnit'><i class='close'>&times;</i><div class='btn chordItem'>" + chordName + "</div></div>");
		usedChordCollections.unshift(chordName);		
	}

	o.updateArrange = function(){
		var updateChordObj = [];		
		var $chords = $chordCollection.find(".chord");		

		var chordObj , text , chordInfo , chordName , chordDuration , position , top , left , line , position;		
		$chords.each(function(){
			chordObj = {};			
			position = $(this).position();
			text = $(this).text();

			chordName = text;
			chordDuration = 1;
			top = position.top;
			left = position.left;						
			line = Math.round((top-YBasicOffset)/YDenominator);
			line = (line < 0 ) ? 0 : line;
			position = Math.round((left-XBasicOffset)/Xenominator);
			position = (position < 0 ) ? 0 : position;			

			chordObj.chordName = chordName;
			chordObj.chordDuration = chordDuration;
			chordObj.chordPosition = position;
						
			while(line+1 > updateChordObj.length){
				updateChordObj.push([]);
			}			
			updateChordObj[line].push(chordObj);			
		});		

		//sort bar
		function SortByPosition(a, b){
		  var aPosition = a.chordPosition;
		  var bPosition = b.chordPosition;
		  return aPosition - bPosition;
		}

		var updateChordObjLength = updateChordObj.length,
			lineLength;	
		for(var i = 0; i < updateChordObjLength ; i++){
			line = updateChordObj[i];
			line.sort(SortByPosition);
		}		
		
		songFormatCompiler.updateChord(updateChordObj);
		closeArrangeMode();
		$tabbable.find("li").eq(-1).click();
	}

	o.abortArrange = function(){		
		closeArrangeMode();		
	}

	var closeArrangeMode = function(){
		$lyric.css({
			"line-height" : " 26px" , 						
			"margin-left" : "0",
			"width" : "920px"			
		});
		$chordWrap.hide();
		$chordGenegator.hide();
		$lyric.off("scroll");
		$chordWrap.off("mousewheel");
		arrangeMode = false;	
	}

	o.openSourceCodeDialog = function(){		
		updatePlainLyric();		
		$sourceCodeDialog.show();
	}


	o.updateSourceCode = function(){
		sourceCode = $sourceCodeText.val();
		songFormatCompiler.setObjBySourceCode(sourceCode);		
		$lyric.val(songFormatCompiler.getPlainLyric());	
		$sourceCodeDialog.hide();
	}

	o.abortSourceCodeDialog = function(){
		$sourceCodeDialog.hide();
	}

	return o;


})( editOperation || {} );
