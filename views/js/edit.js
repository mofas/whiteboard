


$(document).ready(function() {
	editOperation.init();
});

var editOperation = (function(o){

	var $editForm , $lyric , $submitButton , $deleteButton , $tabbable , $sourceCodeDialog , $sourceCodeText , $preview;
	var sourCode , isSourceCodeChange = false;


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
