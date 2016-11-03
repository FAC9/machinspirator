var generateImageButton = document.querySelector('#generate-image-button');
var loadTuneButton = document.querySelector('#load-tune-button');
var imageURL, imageDescription, imageTags, generateTune2, newURL;

var generateImage = new XMLHttpRequest();

generateImage.onreadystatechange = function() {
  if (generateImage.readyState === 4 && generateImage.status == 200) {
    console.log(generateImage.response);
    imageURL = JSON.parse(generateImage.response).urls.regular;
     getImageDescription(imageURL);
    document.querySelector('.image').src = imageURL;
  }
}

generateImageButton.onclick = function() {
  generateImage.open('GET', "https://api.unsplash.com/photos/random?client_id=" + unsplashKey, true);
  generateImage.send();
};

var describeImage = new XMLHttpRequest();

describeImage.onreadystatechange = function() {
  if (describeImage.readyState === 4 && describeImage.status == 200) {
    imageDescription = JSON.parse(describeImage.response).description.captions[0].text;
    console.log(imageDescription);
    imageTags = JSON.parse(describeImage.response).description.tags;
    document.querySelector(".image-description").textContent = imageDescription;
  }
}

var getImageDescription = function (url) {
  describeImage.open('POST', "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1");
  describeImage.setRequestHeader("Content-Type", "application/json");
  describeImage.setRequestHeader("Ocp-Apim-Subscription-Key", computerVisionKey);
  var body = JSON.stringify({url : url});
  describeImage.send(body);
}

var generateTune = new XMLHttpRequest();

// generateTune2 = new XMLHttpRequest();
// generateTune2.onreadystatechange = function () {
//   if (generateTune2.readyState === 4 && generateTune2.status == 200) {
//     var youtubeURL = JSON.parse(generateTune2.response).videos[0].uri;
//     var youtubeTitle = JSON.parse(generateTune2.response).videos[0].title;
//     document.querySelector(".youtube-link").innerHTML = '<a href="' + youtubeURL + '" target="_blank">' + youtubeTitle + '</a>';
//   }
// }

generateTune.onreadystatechange = function() {
  if (generateTune.readyState === 4 && generateTune.status == 200) {
    document.querySelector(".youtube-link").innerHTML = JSON.parse(generateTune.response).results[0].title;
    //console.log(JSON.parse(generateTune.response).results[0].resource_url);
    // newURL = JSON.parse(generateTune.response).results[0].resource_url;
    // generateTune2.open('GET', newURL, true);
    // generateTune2.send();
  }
}

loadTuneButton.onclick = function() {
  generateTune.open('GET', "https://api.discogs.com/database/search?release_title=" + imageTags[0] + "&key=" + discogsKey + "&secret=" + discogsSecret, true);
  generateTune.send();
};
