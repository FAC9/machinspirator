var button = document.querySelector('.generateImageButton');
var imageURL;
//
// button.onclick = function() {
//   image = "https://source.unsplash.com/random";
//   document.querySelector('.image').src = image;
// };

var generateImage = new XMLHttpRequest();

generateImage.onreadystatechange = function() {
  if (generateImage.readyState === 4 && generateImage.status == 200) {
    imageURL = JSON.parse(generateImage.response).urls.regular;
    document.querySelector('.imageContainer').innerHTML = '<img src="' + imageURL + '"/>';
  }
}

button.onclick = function() {
  generateImage.open('GET', "https://api.unsplash.com/photos/random?client_id=" + unsplashKey, true);
  generateImage.send();
};
