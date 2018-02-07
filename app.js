var express    = require("express"),
    mongoose   = require("mongoose"),
    request    = require("request"),
    bodyParser = require("body-parser"),
    moment     = require("moment"),
    funct      = require("./public/js/funct"),
    embed      = require("embed-video");

var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

/*var home_images = [
    "https://c1.staticflickr.com/2/1576/26405462060_ca9f2d22d9_b.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/54/CRS-8_%2826239020092%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/bf/The_Skylab_1-Saturn_V_space_vehicle_is_lifts_off_from_Launch_Pad_39A_on_May_14%2C_1973.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Soyuz_TMA-7_spacecraft2edit1.jpg",
    "https://www.nasa.gov/images/content/587251main_2011-2082.jpg"
];*/

var status = {
    "1": {"style": "background-color: #48c14a", "status": "GO"},
    "2": {"style": "background-color: #c14848", "status": "NO GO"},
    "3": {"style": "background-color: #4868c1", "status": "SUCCESS"},
    "4": {"style": "background-color: #000000", "status": "FAILED"}
}

app.get("/", function(req, res) {
   var url = "https://api.nasa.gov/planetary/apod?api_key=GoCHj7HTtRVOHSCDYzE1h2AMISrC6WCxi42c3dCD"
   request(url, function(error, response, body) {
      if(!error && response.statusCode == 200) {
          var pod = JSON.parse(body);
          res.render("home", {pod: pod});
      } else {
          console.log(error);
      }
   });
});

app.get("/index", function(req, res) {
    /**Requesting NASA's Astronomy Picture of the Day**/
    var apod_url = "https://api.nasa.gov/planetary/apod?api_key=GoCHj7HTtRVOHSCDYzE1h2AMISrC6WCxi42c3dCD"
    var apod_img_urls = [];
    var curr_moment = moment();
    for(var i = 0; i < 10; i++) {
        var appended_url = apod_url + "&date=" + curr_moment.subtract(i, "days").format("YYYY-MM-DD");
        request(appended_url, function(error, reponse, body) {
            if(!error && reponse.statusCode == 200) {
                var img_json = JSON.parse(body);
                if(img_json.media_type == "image") {
                    var apod_promise = new Promise(function(resolve, reject){
                        resolve(img_json.hdurl);
                    });
                    apod_img_urls.push(apod_promise);
                }
            } else {
                console.log(error);
            }
        });
    }
    /**************************************************/
    
    var url = "https://launchlibrary.net/1.3/launch?next=20&mode=verbose";
    request(url, function(error, response, body) {
       if(!error && response.statusCode == 200) {
           var data = JSON.parse(body);
           res.render("index", {data: data, apod_img_urls: apod_img_urls, status: status});
       } else {
           console.log(error);
       }
    });
});

/*Allow; the use of moment.js inside ejs*/
app.locals.moment = require('moment');

app.get("/test", function(req, res) {
   var url = "https://launchlibrary.net/1.3/launch?next=8&mode=verbose";
    request(url, function(error, response, body) {
       if(!error && response.statusCode == 200) {
           var data = JSON.parse(body);
           res.render("test", {data: data});
       } else {
           console.log(error);
       }
    });
   
});

app.get("/recent", function(req, res){
    // var date = new Date();
    // var fullDate = funct.convertDate(date);
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1;
    // var day = date.getUTCDate();
    // var pastDate = year-1+"-"+funct.lastMonth(month)+"-"+day;
    // var url = "https://launchlibrary.net/1.3/launch?startdate="+fullDate+"&enddate="+pastDate+"&mode=verbose";
    
    var endDate = moment().subtract(1, "days");
    var startDate = moment().subtract(3, "months").subtract(1, "days");
    
    /* TODO: Make Launch Library display all launches.*/

    var url = "https://launchlibrary.net/1.3/launch?startdate="+startDate.format("YYYY-MM-DD")+"&enddate="+endDate.format("YYYY-MM-DD")+"&mode=verbose";
    
    request(url, function(err, response, body) {
       if(!err && response.statusCode == 200){
           var data = JSON.parse(body);
           res.render("recent",{data:data, embed:embed, status:status});
           
       } else {
           console.log(err);
       }
    });
    
});


app.get("/show/:id/upcoming", function(req, res) {
    var launchID = req.params.id;
    var url = "https://launchlibrary.net/1.3/launch?id=" + launchID + "&mode=verbose";
    request(url, function(error, response, body) {
       if(!error && response.statusCode == 200) {
           var data = JSON.parse(body);
           res.render("show", {data: data});
       } 
    });
});

app.get("/secret", function(req, res) {
   var url = "https://launchlibrary.net/1.3/launch?next=8&mode=verbose";
   request(url, function(err, response, body) {
       if(!err && response.statusCode == 200) {
           var data = JSON.parse(body);
           res.render("secret", {data: data});
       }
   });
});

app.get("/faqs", function(req, res) {
   res.render("faqs"); 
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server Started"); 
});

/************* Functions *************/ 
