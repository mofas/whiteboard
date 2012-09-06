








function submit(id){

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
				window.reload();
			}
			else{
				alert(data.msg);
			}
		});
	}
}