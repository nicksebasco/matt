var cheerio = require("cheerio"),
request = require("request"),
json2csv = require('json2csv'),
csv2json = require('csvtojson'),
fs = require('fs');

function write(name,data){
  // other parameters contained in data: store_hours
  // map data object to an array of objects, needed for json2csv
  var fields = [ "Name", "Email", "City", "Keyword"],
  csv = json2csv({ data: data, fields: fields });

  fs.writeFile(name, csv, function(err) {
      if (err) throw err;
        console.log('file saved');
    });
}

function packageData(n,e,c,k){
    return {
        Name:n,
        Email:e,
        City:c,
        Keyword:k
    };
}

function buildUrl(k,c){
    return "https://d7leadfinder.com/results/"+c.replace(/\s/,"_")+"/"+k.replace(/\s/,"_")+".html";
}

function scrape(uri){
  var options = {
    url: uri,
    headers: {
      'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit 537.36 (KHTML, like Gecko) Chrome"
    }
  };
  console.log("SCRAPING: "+options.url);
  return new Promise(function(resolve,reject){
	   request.get(options,function(e,res,body){
       if( !e  && res.statusCode == 200 ){
         // looking for organic results (not ads, not extended results).
         var $ = cheerio.load(body);
         resolve( $ );
       }
       else{
         var err = e || new Error("Bad request: status("+res.statusCode+")");
         reject( err );
       }
	    });
  });
 }


 (function main(){

     var keyword  = process.argv.length > 2 ? process.argv[2]:'Home',
         city     = process.argv.length > 3 ? process.argv[3]:'Los Angeles',
         throttle = process.argv.length > 4 ? parseFloat(process.argv[3])*1000: 1000,
         fileName = process.argv.length > 5 ? process.argv[5]:'Data',
         data     = [],
         ids      = [];

    if ( city.toLowerCase() === "all" ){
        csv2json()
            .fromFile("data/cities.csv")
            .on("end_parsed",function(jsonArrayObj){ //when parse finished, result will be emitted here.
                jsonArrayObj.map(function(i){
                    return i.city;
                }).slice(0,10).forEach(function(j,n){
                    setTimeout(function(){
                        start( buildUrl(keyword,j), j );
                    },n*throttle);
                });
            });
    }
    else {
        start( buildUrl(keyword,city),city );
    }

    function start(url,xcity){

    scrape(url)
    .then(function($){
        $("#table").find("tr").each(function(i){
            var name = $(this).find("td[data-title=Name]").text(),
            email = $(this).find("td[data-title=Emails]").text();
            if (email)
                data.push(packageData(name,email,xcity,keyword));
        });

        var fname = "data/"+fileName+".csv";

        fs.stat(fname, function(err, stat) {
            if(err == null) {
                csv2json()
                    .fromFile(fname)
                    .on("end_parsed",function(jsonArrayObj){ //when parse finished, result will be emitted here.
                        write(fname,jsonArrayObj.concat(data));
                    });
                    console.log("A");
            }
            else{
                write(fname,data);
                console.log("B");
            }
        });

    });

    }

 })();
