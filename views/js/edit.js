


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
		$newChord_name,
		$newChord_duration,
		$chordListContainer,
		$preview,
		$loadingOverlay;

	var sourCode , isSourceCodeChange = false , arrangeMode,
		ChordSynTimer , chordScrollHeight = 0,
		YBasicOffset = 3 , YDenominator = 50 , XBasicOffset = 4 , Xenominator = 7;

	var bindEvent = function(){				
		$("#submitButton").on("click" , function(){			
			o.submit($(this).attr("data-id"));
		});
		$("#deleteButton").on("click" , function(){			
			o.delete($(this).attr("data-id"));
		});

		$("#arrangeModeButton").on("click" , o.arrange);
		$("#sourceCodeModeButton").on("click" , o.openSourceCodeDialog);
		$("#updateArrangeButton").on("click" , o.updateArrange);
		$("#abortArrangeButton").on("click" , o.abortArrange);
		$("#genegrateChordButton").on("click" , o.genegrateChord);

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
		});
		
		$chordListContainer.on("mousedown" , ".chordItem" , function(e){			
			var text = $(this).text();
			var parentOffset = $chordCollection.offset(); 
			var cursorX = e.pageX - parentOffset.left - 20 , cursorY = e.pageY - parentOffset.top - 10;			
			var $chordObj = $('<div class="chord ui-draggable" style="left:' + cursorX + 'px;top:' + cursorY + 'px;">' + text + '</div>');
			$chordCollection.append($chordObj);			
			$chordObj.draggable({ 
				containment: ".chordCollection"
			}).trigger(e);			
		});
		
		//touch event (testing)				
		$chordWrap.on("mouseover touchstart" , ".chord" , function(){
			$(this).draggable({ 
				containment: ".chordCollection"				
			});
		});
			

		$chordWrap.on("dblclick" , ".chord" , chordEditEvent);

		$chordWrap.find( ".chordTrash" ).droppable({
           	accept: ".chord",
           	over: function(event , ui){	           		
           		ui.draggable.css({
           			"border" : "1px dotted #ddd" , 
           			"background" : "#fff",	           			
           		});
           	},
           	out: function(event , ui){	           	
           		ui.draggable.css({
           			"border" : "1px solid #aaa" ,
           			"background" : "rgba(255, 255, 0, 0.4)",	           			
           		});
           	},
        	drop: function(event , ui){
        		ui.draggable.remove();
           	}
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
		$newChord_name = $chordWrap.find(".newChord_name");
		$newChord_duration = $chordWrap.find(".newChord_duration");
		$chordCanvas = $chordWrap.find(".chordCanvas");
		$chordTool = $chordWrap.find(".chordTool");
		$chordCollection = $chordWrap.find(".chordCollection");
		$chordListContainer = $chordWrap.find(".chordListContainer");
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
		console.log(params);
		if(id !== undefined && id !== null){
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
		if(id !== undefined && id !== null){
			$.post("/delete/" + id , function(data){
				console.log(data);
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

	o.updatePreview = function(){
		updatePlainLyric();
		$preview.addClass("songFormat").html(songFormatCompiler.getoutputFormat());		
	}

	o.arrange = function(){
		if(arrangeMode){
			o.abortArrange();
			$lyric.off("scroll");
		}
		else{			
			$lyric.css({"line-height" : " 50px"});
			$chordWrap.show();
			//update plain lyric
			updatePlainLyric();
			var chordHtml = genegrateChordsHtml(songFormatCompiler.getChordObjArray());			
			$chordCollection.html(chordHtml).css({ "height" : $lyric[0].scrollHeight + "px" });
			$lyric.trigger("scroll");
			chordScrollSyn();
			arrangeMode = true;
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
			fragHtml += "<span class='chord' style='left:"+ (XBasicOffset+chordObj.chordPosition*Xenominator) +"px; top:"+ (YBasicOffset+chordObj.chordLine*YDenominator) + "px;' >" + chordObj.chordName + "x" + chordObj.chordDuration + "</span>";
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
		$lyric.off("scroll");
		$lyric.on("scroll" , function(e){			
			chordScrollHeight = e.target.scrollTop;		
			$chordCanvas.css({ "top" : -chordScrollHeight });
			$chordTool.css({ "top" : chordScrollHeight+20 });
		});
	}

	o.genegrateChord = function(){		
		var name = $newChord_name.val();
		var duration = $newChord_duration.val();
		$chordListContainer.prepend("<div class='chordItem'>" + name + "x" + duration + "</div>");
	}

	o.updateArrange = function(){
		var updateChordObj = [];		
		var $chords = $chordCollection.find(".chord");

		var chordObj , text , chordInfo , chordName , chordDuration , position , top , left , line , position;		
		$chords.each(function(){
			chordObj = {};			
			position = $(this).position();
			text = $(this).text();
			chordInfo = text.split("x");

			if(chordInfo.length < 1)
				return false;

			chordName = chordInfo[0];
			chordDuration = chordInfo[1];			
			top = position.top;
			left = position.left;
			line = Math.floor((top-YBasicOffset)/YDenominator);
			line = (line < 0 ) ? 0 : line;
			position = Math.floor((left-XBasicOffset)/Xenominator);
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

		$lyric.css({"line-height" : " 26px"});			
		$chordWrap.hide();	
		arrangeMode = false;		

	}

	o.abortArrange = function(){
		$lyric.css({"line-height" : " 26px"});			
		$chordWrap.hide();	
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
