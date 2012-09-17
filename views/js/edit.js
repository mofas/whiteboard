




var editOperation = {};



editOperation.submit = function(id){

	var params = $("#editForm").serialize();

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
				console.log(data);
				window.location.href = 'edit/' + data.obj._id ; 	
			}
			else{
				alert(data.msg);
			}
		});
	}
}



editOperation.delete = function(id){
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


