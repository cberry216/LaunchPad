var express    = require("express"),
    mongoose   = require("mongoose"),
    request    = require("request"),
    rpn        = require("request-promise-native"),
    bodyParser = require("body-parser"),
    moment     = require("moment"),
    funct      = require("./public/js/funct"),
    embed      = require("embed-video"),
    fs         = require("fs");

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
    "2": {"style": "background-color: #d8e500", "status": "NO GO"},
    "3": {"style": "background-color: #4868c1", "status": "SUCCESS"},
    "4": {"style": "background-color: #e50000", "status": "FAILED"},
    "5": {"style": "background-color: #d8e500", "status": "HOLD"},
    "6": {"style": ""                         , "status": "IN FLIGHT"},
    "7": {"style": "background-color: #e50000", "status": "FAILURE"}
}

app.get("/", function(req, res) {
   var url = "https://api.nasa.gov/planetary/apod?api_key=GoCHj7HTtRVOHSCDYzE1h2AMISrC6WCxi42c3dCD"
   request(url, function(error, response, body) {
      if(!error && response.statusCode == 200) {
          var pod = JSON.parse(body);
          res.render("home", {pod: pod, page: "splash"});
      } else {
          console.log(error);
      }
   });
});

app.get("/index", function(req, res) {
    // /**Requesting NASA's Astronomy Picture of the Day**/
    // var apod_url = "https://api.nasa.gov/planetary/apod?api_key=GoCHj7HTtRVOHSCDYzE1h2AMISrC6WCxi42c3dCD"
    // var promises = []
    // var curr_moment = moment();
    // for(var i = 0; i < 5; i++) {
    //     var appended_url = apod_url + "&date=" + curr_moment.subtract(1, "days").format("YYYY-MM-DD");
    //     promises.push(new Promise(function(resolve, reject) {
    //         request(appended_url, function(err, response, body) {
    //             if(!err && response.statusCode == 200) {
    //                 var img_json = JSON.parse(body);
    //                 if(img_json.media_type == "image") {
    //                     resolve(img_json.hdurl);
    //                 }
    //             } else {
    //                 reject(err);
    //                 console.log(err);
    //             }
    //         });
    //     }));
    // }
    // /**************************************************/
    // Promise.all(promises).then(function(apod_img_urls) {
    //     var url = "https://launchlibrary.net/1.3/launch?next=20&mode=verbose";
    //     var news = "https://newsapi.org/v2/top-headlines?category=science&country=us&q=space&apiKey=db9a57734ebb4001abec3f3001c56a58"
    //     request(url, function(err, response, body) {
    //         if(!err && response.statusCode == 200) {
    //             var data = JSON.parse(body);
    //             /* Filtering out Chinese Launches */
    //             // var filter_data = data.launches.filter(function(launch) {
    //             //     if(launch.lsp != null) {
    //             //         if (launch.lsp.id == 88) {
    //             //             return false;
    //             //         } else {
    //             //             return true;
    //             //         }
    //             //     } else {
    //             //         return true;
    //             //     }
    //             // })
    //             // data = {launches: filter_data};
    //             /* End filtering out Chinese Launches */
    //             request(news, function(err, response, body) {
    //                 if(!err && response.statusCode == 200) {
    //                     var headlines = JSON.parse(body);
    //                     res.render("index", {data: data, apod_img_urls: apod_img_urls, status: status, headlines: headlines, page: "index"});
    //                 } else {
    //                     console.log(err);
    //                 }
    //             });
    //         } else {
    //             console.log(err);
    //         }
    //     });
    // });
    /********************* WORKING NOW *********************/
    var apod_url = "https://api.nasa.gov/planetary/apod?api_key=GoCHj7HTtRVOHSCDYzE1h2AMISrC6WCxi42c3dCD"
    var curr_moment = moment();
    var apod_img_urls = [];
    for(var i = 0; i < 5; i++) {
        var appended_url = apod_url + "&date=" + curr_moment.subtract(1, "days").format("YYYY-MM-DD");
        request(appended_url, function(err, response, body) {
           if(!err && response.statusCode == 200) {
               var info = JSON.parse(body);
               if(info.media_type == "image") {
                    apod_img_urls.push(info.hdurl)
               }
           }
        });
    }

    setTimeout(function(){

    var url = "https://launchlibrary.net/1.4/launch?next=20&mode=verbose";
    var news = "https://newsapi.org/v2/top-headlines?category=science&country=us&q=space&apiKey=db9a57734ebb4001abec3f3001c56a58"
    request(url, function(err, response, body) {
            if(!err && response.statusCode == 200) {
                var data = JSON.parse(body);
                request(news, function(err, response, body) {
                    if(!err && response.statusCode == 200) {
                        var headlines = JSON.parse(body);
                        res.render("index", {data: data, apod_img_urls: apod_img_urls, status: status, headlines: headlines, page: "index"});    
                    }
                });
            } else {
                console.log(err);
            }
    });

    }, 2000);
    // res.render("index", {data: {launches: [{lsp: {infoURLs: []}, rocket: {familyname: ""}, missions: [], vidURLs: [], isostart: null, name: "", status: 1, location: {pads: [{name: ""}]}}]}, apod_img_urls: [], status: status, headlines: {articles: []}, page: "index"});
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
    
    getLaunches().then(function(launches) {
        var data = {launches: launches.filter(launch => moment().isAfter(moment(launch.isostart))),
                    from_time: moment().subtract(3, "months").subtract(1, "days"),
                    to_time: moment()
        };
        res.render("recent", {data: data, embed: embed, status: status, page: "recent"})
    })
    
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
   res.render("faqs", {page: "faqs"}); 
});

app.get("/about", function(req, res) {
   res.render("about", {page: "about"}); 
});

app.get("/contact", function(req, res) {
    res.render("contact", {page: "contact"});
})

app.listen(55555, function() {
   console.log("Server Started"); 
});

/************* Functions *************/ 

function getLaunches(startDate = moment().subtract(3, 'months').subtract(1, 'days'), endDate = moment(), offset = 0, launches = []) {
    const url = "https://launchlibrary.net/1.3/launch?startdate=" + startDate.format("YYYY-MM-DD") + "&enddate=" + endDate.format("YYYY-MM-DD") + "&offset=" + offset + "&mode=verbose";
    
    return rpn.get({uri: url, json: true}).then((response) => {
        const total = response.total;
        launches.push(...response.launches);
        
        if (launches.length < total) {
            const nextOffset = offset + response.count;
            return getLaunches(startDate, endDate, nextOffset, launches);
        }
        
        return launches;
    });
}
