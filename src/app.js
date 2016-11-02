var button = document.querySelector('.button');
var imageURL, imageDescription;
//
// button.onclick = function() {
//   image = "https://source.unsplash.com/random";
//   document.querySelector('.image').src = image;
// };

var generateImage = new XMLHttpRequest();

generateImage.onreadystatechange = function() {
  if (generateImage.readyState === 4 && generateImage.status == 200) {
    console.log(generateImage.response);
    imageURL = JSON.parse(generateImage.response).urls.regular;
     getImageDescription(imageURL);
    document.querySelector('.image').src = imageURL;
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
    console.log(imageDescription);
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
