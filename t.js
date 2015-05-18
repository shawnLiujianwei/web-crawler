var db = require("./components/db/product");
db.query("tesco.com")
.then(function(list){
        console.log(list);
    })
.catch(function(err){
        console.error(err)
    })