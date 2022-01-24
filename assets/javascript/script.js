// modal selector
var modal = document.querySelector(".modal");

//Get the button that opens the modal
var openBtn = document.querySelector("#nysearch");

//Get the button that opens the modal
var nonFictinoalBtn = document.querySelector("#nySearchNfictional");

// Get the  element that closes the modal
var bookBtn = document.querySelector(".book-search")

// get modal cancel button
var cancelBtn = document.querySelector(".cancel-search");

// defining  variables for HTML Elements 
var fictionalList = document.querySelector("#fiction-list");

var nFictionalList = document.querySelector("#nonfictional-list");

var changeGenreBtn = document.getElementById("genre-trigger");

var buttonZero = document.querySelector(".button-0");

var genreSearch = document.querySelector("#genreSearch");

var previousEl = document.getElementById("previous-search");

// API Key
var bookAPI = "D9OwWTZWlrbbFIzrqzKyzY9zxhC4MVua";
var youtubeAPIKey = "AIzaSyCnm1Vk0t1Po9Fanm2-OIFvOP4HzN4SUCM";

// Allows the page to reload and pull up the modal page to start a new search
changeGenreBtn.addEventListener("click", function () {
  reload = location.reload();
});

// // When the user clicks the button, it send the input results from the NY Times Api
openBtn.addEventListener('click', function () {
  var genreSearchTxt = document.querySelector("#genreSearch").value;
  console.log(genreSearchTxt)
  getApi(genreSearchTxt)
});

// Input from onclick input is sent into NY time API to generate results
function getApi(searchtxt) {
  console.log(searchtxt);
  modal.style.display = "none"
  var requestUrl = "https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=" + bookAPI;
  fetch(requestUrl)
    .then(function (response) {
      console.log(response)
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      // iteration over the book list results. Show sthe first 5 results.
      for (var i = 0; i < 5; i++) {
        var author = document.createElement('a');
        var title = document.getElementById("genreTitle");

        title.textContent = "Genre Title: " + data.results.lists[searchtxt].display_name;
        author.textContent = data.results.lists[searchtxt].books[i].author + ":  " + data.results.lists[searchtxt].books[i].title;
        author.setAttribute("position", i.toString());
        author.setAttribute("id", "book-Element_" + i);
        author.classList.add("searchBtn");
        author.classList.add("p-2");
        fictionalList.appendChild(author);
        var booklist = document.querySelectorAll(".booklist > a");

        getResult(booklist);
      }
      // set varibles for local storage
      var getStorage = localStorage.getItem("Genre")
      var getGenre = JSON.parse(getStorage) || []
      console.log(getGenre);
      //   checks to see if local storage has any search items
      if (getGenre.indexOf(searchtxt) === -1) {
        //if no search terms, add the newly searched item to the aray
        getGenre.push(searchtxt)
        localStorage.setItem('Genre', JSON.stringify(getGenre));
        console.log(JSON.stringify(getGenre))
      }


    })
};



// On click event that send the response to the youtube video to get video review
function getResult(booklist) {
  for (var i = 0; i < booklist.length; i++) {
    booklist[i].addEventListener("click", getVideo,);
  }

};

//Api call to display youtube video
//source: https://dev.to/aveb/making-your-first-get-request-to-youtube-search-api-4c2f
function getVideo(event) {
  // Make the video box visible once an item is clicked
  var searchResult = document.getElementById(event.target.id);
  document.getElementById("video-box").classList.remove("hidevideo-box");
  $.ajax({
    type: `GET`,
    url: `https://www.googleapis.com/youtube/v3/search`,
    data: {
      key: `AIzaSyCnm1Vk0t1Po9Fanm2-OIFvOP4HzN4SUCM`,
      //this “q” is where we need to search our li <title> + “book review”
      q: searchResult.text + " review",
      part: `snippet`,
      maxResults: 1,
      type: `video`,
      videoEmbeddable: true,
    },
    success: function (data) {
      embedVideo(data)
    },
    error: function (response) {
      console.log("Request Failed");
    }
  });

}
//replaces placeholder video with updated title and description
function embedVideo(data) {
  $(`iframe`).attr(`src`, `https://www.youtube.com/embed/` + data.items[0].id.videoId)
  $(`h3`).text(data.items[0].snippet.title)
  $(`.description`).text(data.items[0].snippet.description)
}


// function gets items from loal storage and adds them to the page
function saveClick() {
  var previousEl = document.getElementById("previous-search");
  var getGenre = JSON.parse(localStorage.getItem("Genre"))
  console.log(getGenre);
  var srcBtn = document.createElement('button');
  var blankHTML = "";
  // checks to see if the local storage has items, if it does then run the function below.
  if (getGenre !== null) {

    for (let i = 0; i < getGenre.length; i++) {
      var previousEl = document.getElementById("previous-search");
      var getGenre = JSON.parse(localStorage.getItem("Genre"))
      var srcBtn = document.createElement('button');

      srcBtn.textContent = getGenre[i];
      srcBtn.classList.add("p-2")
      srcBtn.classList.add("searchBtns")
      previousEl.appendChild(srcBtn);


    }
    // Makes the create local storage buttons clickable
    $("#previous-search").on("click", ".searchBtns", function () {
      var genre = $(this).text()
      $("#current").addClass("border border-warning")
      // add the button txt value to search bar
      $("#genreSearch").val(genre)
      // running the txt through the get location function
    })


  }

};


// runs the save click function on page load.
saveClick();
