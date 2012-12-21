

$(document).ready(function() {
	userList.init();
});


var userList = (function(o){

	var confirmButtonHtml = "<div class='btn btn-danger offset1'>確認</div>";

	var bindEvent = function(){
		$(".roleChangeSelect").on("change" , function(){
			$(this).parent().find(".btn").remove();
			var $button = $(confirmButtonHtml);
			$button.attr("targetID" , $(this).attr("id"))
				.attr("role" , $(this).val())
				.one("click" , function(){
					var param = {userFBID : $(this).attr("targetID") , toRole : $(this).attr("role")}					
					$.post("/admin/adjustUserRole" , param , function(data){
						if(data.errCode === "0"){
							alert("修改成功");
						}
						else{
							alert(data.msg);
						}						
					});	
					$(this).remove();				
				});

			$(this).after($button);
		});
	}

	o.init = function(){
		bindEvent();
	}

	return o;
})( userList || {} );