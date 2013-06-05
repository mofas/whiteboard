
var s3 = new AWS.S3();

exports.index = function(req ,res){ 
    res.render('personalSpace', {
        user : req.user
    }); 
}

exports.list = function(req ,res){ 
    s3.listBuckets(function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            console.log(data);
            for (var index in data.Buckets) {
                var bucket = data.Buckets[index];
                console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
            }                
            res.send(data);    
        }        
    });
}

exports.del = function(req ,res){ 
    res.send("del");
}

exports.add = function(req ,res){ 
    var s3bucket = new AWS.S3({params: {Bucket: 'mofas-whiteboard'}});
    s3bucket.createBucket(function() {
      var data = {Key: 'addObjTest', Body: 'Hello!'};
      s3bucket.putObject(data, function(err, data) {
        if (err) {
          console.log("Error uploading data: ", err);          
        } else {
          console.log("Successfully uploaded data");
          console.log("Successfully uploaded data");
        }
      });
    });
}

exports.get = function(req, res){
    s3.getObject({Bucket: 'mofas-whiteboard', Key: 'key'}, function (err, data) {
      console.log(err, data);
    });
}
