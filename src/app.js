var button = document.querySelector('.button');
var imageURL, imageDescription;

var generateImage = new XMLHttpRequest();

generateImage.onreadystatechange = function() {
  if (generateImage.readyState === 4 && generateImage.status == 200) {
    imageURL = JSON.parse(generateImage.response).urls.regular;
    getImageDescription(imageURL);
  }
}

button.onclick = function() {
  generateImage.open('GET', "https://api.unsplash.com/photos/random?client_id=" + unsplashKey, true);
  generateImage.send();
};

var describeImage = new XMLHttpRequest();

describeImage.onreadystatechange = function() {
  if (describeImage.readyState === 4 && describeImage.status == 200) {
    imageDescription = JSON.parse(describeImage.response).description.captions[0].text;
    updateDOM();
  }
}

var getImageDescription = function (url) {
  describeImage.open('POST', "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1");
  describeImage.setRequestHeader("Content-Type", "application/json");
  describeImage.setRequestHeader("Ocp-Apim-Subscription-Key", computerVisionKey);
  var body = JSON.stringify({url : url});
  describeImage.send(body);
}

var updateDOM = function () {
  document.querySelector('.image').src = imageURL;
  document.querySelector(".image-description").textContent = imageDescription;
}
