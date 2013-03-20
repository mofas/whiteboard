

var chord_collection = (function(o){

	var fingerIndexMap = ["-","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"];
	var chordCollection = [];	
	var uuID = 0;
	//chordObj
    var chordObj = function(name , canvas , fingerIndex){
	    this.index = uuID++;
	    this.name = name;
	    this.canvas = canvas;
	    this.fingerIndex = fingerIndex;
	};


	o.reset = function(){
		chordCollection = [];		
	}

	o.add = function(name, canvas , fingerIndex){
		var newObj = new chordObj(name , canvas , fingerIndex);
		chordCollection.push(newObj);
		$.publish("chordCollections/change");
		return newObj.index;
	}

	o.delete = function(uuID){
		var length = chordCollection.length;
		while(length--){
			if(chordCollection[length].index == uuID){
				chordCollection.splice(length , 1);
				$.publish("chordCollections/change");
			}
		}
	}

	o.get = function(uuID){
		var length = chordCollection.length;
		while(length--){
			if(chordCollection[length].index == uuID){
				return chordCollection[length];
			}
		}
	}

	o.update = function(uuID , name , canvas , fingerIndex){
		var length = chordCollection.length;
		while(length--){
			if(chordCollection[length].index == uuID){
				chordCollection[length].name = name;
				chordCollection[length].canvas = canvas;
				chordCollection[length].fingerIndex = fingerIndex;
				$.publish("chordCollections/change");
			}
		}
	}

	o.getCollection = function(){
		return chordCollection;
	}

	o.outputCollectionImage = function(){
		var length = chordCollection.length,
			canvasWidth,
			outputCanvas,
			outputCanvasCtx,
			imageData;
			
		var saveFile = function(strData) {
			document.location.href = strData;
		}

		canvasWidth = length*260 , canvasHeight = Math.ceil(length/3)*180 + 20;
		if(canvasWidth > 1040 )
			canvasWidth = 1040;

		canvasWidth += 40;
		outputCanvas = document.createElement('canvas');		
		outputCanvas.width = canvasWidth; 
		outputCanvas.height = canvasHeight;
		outputCanvasCtx = outputCanvas.getContext('2d');		

		imageData;		
		for(var i = 0 ; i < length ; i++){
			imageData = chordCollection[i].canvas;
			outputCanvasCtx.drawImage(imageData,(i%4)*260+30 ,Math.floor(i/4)*180+10);
		}
		strDownloadMime = "image/octet-stream";
		
		strData = outputCanvas.toDataURL("image/png");
		//saveFile(strData.replace("image/png", strDownloadMime));
		return strData;
	}


	o.outputCollectionURL = function(){
		var length = chordCollection.length;
		var fingerIndex , outputURLFragment = [] , outputURL=[];		
		for(var i = 0; i < length ;i++){
			outputURLFragment=["&"];
			outputURLFragment.push(encodeURIComponent(chordCollection[i].name));
			outputURLFragment.push("=");
			fingerIndex = chordCollection[i].fingerIndex;
			for(var j = 0; j < fingerIndex.length ;j++){				
				outputURLFragment.push(fingerIndexMap[fingerIndex[j]+1]);				
			}
			outputURL.push(outputURLFragment.join("")); 

		}		
		return outputURL.join("");
	}

	return o;

})(chord_collection || {});