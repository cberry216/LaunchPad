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

/* Status Codes for Launches and CSS Descriptors */
var status = {
    "1": {"style": "background-color: #48c14a", "status": "GO"},
    "2": {"style": "background-color: #d8e500", "status": "NO GO"},
    "3": {"style": "background-color: #4868c1", "status": "SUCCESS"},
    "4": {"style": "background-color: #e50000", "status": "FAILED"},
    "5": {"style": "background-color: #d8e500", "status": "HOLD"},
    "6": {"style": ""                         , "status": "IN FLIGHT"},
    "7": {"style": "background-color: #e50000", "status": "FAILURE"}
}

/* Requesting the Home Page */
app.get("/", function(req, res) {
    // NASA Astronomy Picture of The Day Link
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
/* Requesting the Index Paige */
app.get("/index", function(req, res) {
    // Setting start and end date for NASA APOD request
    let endDate = moment().format('YYYY-MM-DD');
    let startDate = moment().subtract(5, 'days').format('YYYY-MM-DD');
    let apodURL = "https://api.nasa.gov/planetary/apod?api_key=GoCHj7HTtRVOHSCDYzE1h2AMISrC6WCxi42c3dCD";
    apodURL = apodURL + '&start_date=' + startDate + '&end_date=' + endDate;

    var apod_urls;              // Holds the objects returned from the call to the APOD API
    var apod_img_urls = [];     // Holds the HD links to each APOD, given that it is an image

    // LaunchLibrary API URL
    var url = "https://launchlibrary.net/1.4/launch?next=20&mode=verbose";
    // Google News API URL
    var news = "https://newsapi.org/v2/top-headlines?category=science&country=us&q=space&apiKey=db9a57734ebb4001abec3f3001c56a58"

    // Requesting the LaunchLibrary URL
    request(url, function(err, response, body) {
            if(!err && response.statusCode == 200) {
                var data = JSON.parse(body);
                // Requesting the Google News URL
                request(news, function(err, response, body) {
                    if(!err && response.statusCode == 200) {
                        var headlines = JSON.parse(body);
                        // Requesting the APOD url
			            request(apodURL, function(err, response, body) {
                            if(!err && response.statusCode == 200) {
                                apod_urls = JSON.parse(body);
                                // Filtering APOD objects to only contain urls to the HD image
                                for(var i = 0; i < apod_urls.length; i++) {
                                    if(apod_urls[i].media_type == 'image') {
                                        apod_img_urls.push(apod_urls[i].hdurl);
                                    }
                                }
			                    res.render("index", {data: data, apod_img_urls: apod_img_urls, status: status, headlines: headlines, page: "index"});
        		            }
                        });
                    }
                });
            } else {
                console.log(err);
            }
    });
});

/*Allow; the use of moment.js inside ejs*/
app.locals.moment = require('moment');

/* Requesting the Past Launches Page */
app.get("/recent", function(req, res){
    // Requesting previous launches
    getLaunches().then(function(launches) {
        var data = {launches: launches.filter(launch => moment().isAfter(moment(launch.isostart))),
                    from_time: moment().subtract(3, "months").subtract(1, "days"),
                    to_time: moment()
        };
        res.render("recent", {data: data, embed: embed, status: status, page: "recent"})
    })
    
});

/* Requesting the FAQs Page */
app.get("/faqs", function(req, res) {
    res.render("faqs", {page: "faqs"}); 
});

/* Requesting the About Page */
app.get("/about", function(req, res) {
    res.render("about", {page: "about"}); 
});

/* Requesting the Contact Page */
app.get("/contact", function(req, res) {
    res.render("contact", {page: "contact"});
})

/* Start Listeing to Incoming Connections */
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
