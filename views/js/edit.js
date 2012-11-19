


$(document).ready(function() {
	editOperation.init();
});

var editOperation = (function(o){

	var $editForm , $submitButton , $deleteButton , $tabbable , $sourceCodeText , $preview;
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

	o.init = function(){
		$editForm = $("#editForm");
		$submitButton = $("#submitButton");
		$deleteButton = $("#deleteButton");
		$tabbable = $editForm.find(".tabbable");
		$sourceCodeText = $("#sourceCode");
		$preview = $("#preview");
		bindEvent();
	}


	o.submit = function(id){
		var params = $editForm.serialize();
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
		sourceCode = $sourceCodeText.val();		
		$preview.addClass("songFormat").html(window.songFormatCompiler(sourceCode));
	}

	return o;


})( editOperation || {} );
