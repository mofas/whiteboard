


$(document).ready(function() {
	editOperation.init();
});

var editOperation = (function(o){

	var $editForm, 
		$lyric,
		$submitButton,
		$deleteButton,
		$tabbable,
		$sourceCodeDialog,
		$sourceCodeText,
		$chordWrap,
		$chordCollection,
		$newChord_name,
		$newChord_duration,
		$chordListContainer,
		$preview;
	var sourCode , isSourceCodeChange = false , arrangeMode;

	var ChordSynTimer , chordScrollHeight = 0;


	var bindEvent = function(){		
		$submitButton.on("click" , function(){			
			o.submit($(this).attr("data-id"));
		});
		$deleteButton.on("click" , function(){			
			o.delete($(this).attr("data-id"));
		});
		$tabbable.on("click" , "li" , function(){
			var targetId = $(this).find("a").attr("href");
			$tabbable.find("li").removeClass("active");
			$(this).addClass("active");
			$tabbable.find(".tab-pane").removeClass("active")
			$tabbable.find(targetId).addClass("active");
			if(targetId === '#previewView'){
				o.updatePreview();
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
		$submitButton = $("#submitButton");
		$deleteButton = $("#deleteButton");
		$tabbable = $editForm.find(".tabbable");
		$chordWrap = $editForm.find(".chordWrap");
		$newChord_name = $chordWrap.find(".newChord_name");
		$newChord_duration = $chordWrap.find(".newChord_duration");
		$chordCollection = $chordWrap.find(".chordCollection");
		$chordListContainer = $chordWrap.find(".chordListContainer");
		$sourceCodeDialog = $("#sourceCodeDialog");
		$sourceCodeText = $("#sourceCode");
		$preview = $("#preview");
		bindEvent();
		initSongFormat();
	}


	o.submit = function(id){
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
		$preview.addClass("songFormat").html(songFormatCompiler.getoutputFormat());		
	}

	o.arrange = function(){
		if(arrangeMode){
			o.abortArrange();
			$lyric.off("scroll");
		}
		else{
			$lyric.css({"line-height" : " 50px"});
			var chordHtml = songFormatCompiler.getChordFormat();
			$chordWrap.show();						
			$chordCollection.html(chordHtml).css({ "height" : $lyric[0].scrollHeight + "px" });
			$chordWrap.find(".chord").draggable({ containment: ".chordCollection" }).on("dblclick", chordEditEvent);
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

			arrangeMode = true;
			chordScrollSyn();
			$lyric.trigger("scroll");
		}		
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
			$chordCollection.css({ "top" : -chordScrollHeight });	
		});
	}

	o.genegrateChord = function(){		
		var name = $newChord_name.val();
		var duration = $newChord_duration.val();
		$chordListContainer.prepend("<div>" + name + "x" + duration + "</div>");
	}

	o.abortArrange = function(){
		$lyric.css({"line-height" : " 26px"});			
		$chordWrap.hide();	
		arrangeMode = false;
	}

	o.openSourceCodeDialog = function(){		
		var plainLyric = $lyric.val();		
		songFormatCompiler.updateLyric(plainLyric);
		$sourceCodeText.val(songFormatCompiler.getSourceCode());		
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
