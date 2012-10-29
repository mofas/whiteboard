

/*******************************************************
**  dbHelper
********************************************************/


module.exports = {

  callBackHandler : function(returnValue , callback){
    if (callback && typeof(callback) === "function") {  
        return callback(returnValue);  
    }
    else{
      return returnValue;
    } 
  },

}

