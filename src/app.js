var generateImageButton = document.querySelector('#generateImageButton');
var guardianButton = document.querySelector('#guardianButton');
var imageURL, imageDescription,imageTags,guardianNews;
//
// button.onclick = function() {
//   image = "https://source.unsplash.com/random";
//   document.querySelector('.image').src = image;
// };

var generateImage = new XMLHttpRequest();

generateImage.onreadystatechange = function() {
  if (generateImage.readyState === 4 && generateImage.status == 200) {
  //  console.log(generateImage.response);
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
    console.log(JSON.parse(describeImage.response).description.tags);
    imageTags = JSON.parse(describeImage.response).description.tags;
    document.querySelector(".image-description").textContent = imageDescription;
    document.querySelector(".image-tags").textContent = imageTags;
  }
}

var getImageDescription = function (url) {
  describeImage.open('POST', "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1");
  describeImage.setRequestHeader("Content-Type", "application/json");
  describeImage.setRequestHeader("Ocp-Apim-Subscription-Key", computerVisionKey);
  var body = JSON.stringify({url : url});
  describeImage.send(body);
}

var generateGuardian = new XMLHttpRequest();

guardianButton.onclick = function(){
  //http://content.guardianapis.com/search?q=water%20bird&api-key=test
  generateGuardian.open('get',"http://content.guardianapis.com/search?q="+imageTags[0]+"%20"+imageTags[1]+"%20"+imageTags[2]+"&api-key="+guardianKey);
  generateGuardian.send();
};

generateGuardian.onreadystatechange = function(){
  if (generateGuardian.readyState === 4 && generateGuardian.status === 200){
    guardianNews = JSON.parse(generateGuardian.response);
    var res = "";
    for (var i=0; i< guardianNews.response.results.length;i++)
    {
      res += "<p>"+guardianNews.response.results[i].webTitle+"</p>";
      res += "<p>"+guardianNews.response.results[i].webUrl+"</p>";
    }
    console.log(JSON.parse(generateGuardian.response).response.results);
    document.querySelector(".articles").innerHTML = res;
  }
};
