require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var inputArr = process.argv;
var songName = "";
console.log(`

░░░░░░░░░░░░░░░░░░░░░░█████████
░░███████░░░░░░░░░░███▒▒▒▒▒▒▒▒███
░░█▒▒▒▒▒▒█░░░░░░░███▒▒▒▒▒▒▒▒▒▒▒▒▒███
░░░█▒▒▒▒▒▒█░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
░░░░█▒▒▒▒▒█░░░██▒▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒███
░░░░░█▒▒▒█░░░█▒▒▒▒▒▒████▒▒▒▒████▒▒▒▒▒▒██
░░░█████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
░░░█▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒██
░██▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒██
██▒▒▒███████████▒▒▒▒▒██▒▒▒▒▒▒▒▒██▒▒▒▒▒██
█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒████████▒▒▒▒▒▒▒██
██▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
░█▒▒▒███████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
░██▒▒▒▒▒▒▒▒▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█
░░████████████░░░█████████████████


`)
//Authenticates user inputs
switch (inputArr[2]) {
    default:
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        console.log("That is not a valid input")
        console.log("Try one of these commands")
        console.log("my-tweets + 'tweet handle'")
        console.log("spotify-this-song + 'song title'")
        console.log("movie + 'movie-this'")
        console.log("do-what-it-says")
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        break;
    case "my-tweets":
        showTweets();
        break;
    case "spotify-this-song":
        showSpotify();
        break;
    case "movie-this":
        showMovie();
        break;
    case "do-what-it-says":
        showRandom();
}


function showRandom(){
    //This reads the text inside the random.txt file
    fs.readFile("./random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }else{
            // This prints the contents of data
            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");
            // This re-display the content as an array for later use.
            songName = dataArr[1]
            //calls thi function
            InsideSpotify();
          
        }   
    });

}

function showTweets() {    
    var client = new Twitter(keys.twitter);
    var twitterHandle = "";
    //This console logs runs if the user doesn't input an
    if (inputArr[3] === "" || inputArr[3] === undefined) {
        console.log("\nSomething went wrong with your twitter handle. Try again. Here's one of my favorites for you")
        twitterHandle = "BarackObama"
    } 
    else if (inputArr.length - 3 > 1){
    	var array = [];
    	for( var i = 3; i < inputArr.length; i++){
    	   array.push(inputArr[i]);
    	}
           console.log("array", array)
    	   twitterHandle = array.join("");
    }
    else {
        twitterHandle = inputArr[3]
    }
    


    var params = { screen_name: twitterHandle };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error && tweets.length>0) {
            if(tweets.length > 20){
                for (var i = 0; i < 20; i++) {
                    console.log("\n$$$$$$$$$$$$$$$$$$$$$$$$$");
                    console.log(tweets[i].created_at);
                    console.log(tweets[i].text);
                    console.log("\n$$$$$$$$$$$$$$$$$$$$$$$$$");
                }  
            }else {
                for (var i = 0; i < tweets.length; i++) {
                    console.log("\n$$$$$$$$$$$$$$$$$$$$$$$$$");
                    console.log(tweets[i].created_at);
                    console.log(tweets[i].text);
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$\n");
                } 
            }
            
        } else {
            console.log("\n$$$$$$$$$$$$$$$$$$$$$$$$$")
            console.log("There seems to be something wrong with that handle, you might want to try it again");
            console.log("\n$$$$$$$$$$$$$$$$$$$$$$$$$")

        }
    })
}

function showSpotify(){

    
    if ( inputArr[3] === "" || inputArr[3] === undefined) {
        console.log("\nSomething went wrong with your search, type the name of a song. Here's an example")
        songName = "The Sign"
    }
    else if(inputArr.length - 3 > 1){
        for (var i = 3; i < inputArr.length; i++) {
            if (i > 3 && i < inputArr.length) {
                songName = songName + "+" + inputArr[i];
            }
            else {
                songName += inputArr[i];
            }
        }
        InsideSpotify()
    }    

    
}
function InsideSpotify(){
    var spotify = new Spotify(keys.spotify);
        spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("\n$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                console.log(data.tracks.items[i].artists[0].name);
                console.log(data.tracks.items[i].name);
                console.log(data.tracks.items[i].external_urls.spotify);
                console.log(data.tracks.items[i].album.name)
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n")
                  
            }
console.log(`
scroll up to see the results

▓▓▓▓ 
▒▒▒▓▓ 
▒▒▒▒▒▓ 
▒▒▒▒▒▒▓ 
▒▒▒▒▒▒▓ 
▒▒▒▒▒▒▒▓ 
▒▒▒▒▒▒▒▓▓▓ 
▒▓▓▓▓▓▓░░░▓ 
▒▓░░░░▓░░░░▓ 
▓░░░░░░▓░▓░▓ 
▓░░░░░░▓░░░▓ 
▓░░▓░░░▓▓▓▓ 
▒▓░░░░▓▒▒▒▒▓ 
▒▒▓▓▓▓▒▒▒▒▒▓ 
▒▒▒▒▒▒▒▒▓▓▓▓ 
▒▒▒▒▒▓▓▓▒▒▒▒▓ 
▒▒▒▒▓▒▒▒▒▒▒▒▒▓ 
▒▒▒▓▒▒▒▒▒▒▒▒▒▓ 
▒▒▓▒▒▒▒▒▒▒▒▒▒▒▓ 
▒▓▒▓▒▒▒▒▒▒▒▒▒▓ 
▒▓▒▓▓▓▓▓▓▓▓▓▓ 
▒▓▒▒▒▒▒▒▒▓ 
▒▒▓▒▒▒▒▒▓ 
               `)
console.log("\n")
        });
    }

function showMovie(){
    var movieName= "";
    if (inputArr[3] === "" || inputArr[3] === undefined) {
        console.log("\nType the name of a movie, here is an example:")
        movieName = "Mr. Nobody"
    }
    else if(inputArr.length - 3 > 1){
        for (var i = 3; i < inputArr.length; i++) {
            if (i > 3 && i < inputArr.length) {
                movieName = movieName + "+" + inputArr[i];
            }
            else {
                movieName += inputArr[i];
            }
        }
    }

    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

        if (!error && response.statusCode === 200) {

            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value)
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);



         }
    });
}











