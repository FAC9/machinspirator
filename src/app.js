var generateImageButton = document.querySelector('#generate-image-button');
var loading = document.querySelector(".loading");
var imageURL, imageDescription, imageTags, newURL, guardianNews, imageConfidence, callbacks, songTitle;

var generateImage = new XMLHttpRequest();

generateImage.onreadystatechange = function() {
  if (generateImage.readyState === 4 && generateImage.status == 200) {
    imageURL = JSON.parse(generateImage.response).urls.regular;
    updateImage(imageURL);
    getImageDescription(imageURL);
  }
}

generateImageButton.onclick = function() {
  generateImage.open('GET', "https://api.unsplash.com/photos/random?client_id=" + unsplashKey, true);
  showLoading();
  generateImage.send();
};

var describeImage = new XMLHttpRequest();

describeImage.onreadystatechange = function() {
  if (describeImage.readyState === 4 && describeImage.status == 200) {
    imageDescription = JSON.parse(describeImage.response).description.captions[0].text;
    imageConfidence = JSON.parse(describeImage.response).description.captions[0].confidence;
    imageTags = JSON.parse(describeImage.response).description.tags;
    imageTags = (imageTags.length > 5 ? imageTags.slice(0,5) : imageTags);
    document.querySelector(".image-description").textContent = imageDescription;
    document.querySelector(".image-tags").textContent = imageTags.join(" ");
    callbacks = 2;
    getGuardianArticles();
    getTune();
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

generateTune.onreadystatechange = function() {
  if (generateTune.readyState === 4 && generateTune.status == 200) {
    songTitle = JSON.parse(generateTune.response).results[2].title;
    callbacks--;
    if (callbacks === 0) {
      onRequestComplete();
    }
  }
}

function getTune () {
  generateTune.open('GET', "https://api.discogs.com/database/search?release_title=" + imageTags[0] + "&key=" + discogsKey + "&secret=" + discogsSecret, true);
  generateTune.send();
};

var generateGuardian = new XMLHttpRequest();

function getGuardianArticles () {
  generateGuardian.open('get',"http://content.guardianapis.com/search?q="+imageTags[0]+"%20"+imageTags[1]+"%20"+imageTags[2]+"&api-key="+guardianKey);
  generateGuardian.send();
}

generateGuardian.onreadystatechange = function(){
  if (generateGuardian.readyState === 4 && generateGuardian.status === 200){
    guardianNews = JSON.parse(generateGuardian.response).response.results;
    createGuardianList();
    callbacks--;
    if (callbacks === 0) {
      onRequestComplete();
    }
  }
};

function createGuardianList(){
  var list = document.createElement('ul');
  console.log(guardianNews);
  for (var i = 0; i < (guardianNews.length < 3 ? guardianNews.length : 3); i++)
  {
    var listItem = document.createElement('li');
    listItem.classList.add("article-item");
    listItem.innerHTML = "<i class=\"fa fa-fw fa-book\" aria-hidden=\"true\"></i> <a href=" + guardianNews[i].webUrl + " target='_blank'>" + guardianNews[i].webTitle + "</a>";
    list.appendChild(listItem);
  }
  document.querySelector(".articles").innerHTML = list.outerHTML;
}

function showLoading () {
  loading.style.display = 'block';
}

function hideLoading () {
  loading.style.display = 'none';
}

function onRequestComplete () {
  updateDOM();
  hideLoading();
}

function updateImage () {
  document.querySelector('.image').src = imageURL;
}

function updateDOM () {
  document.querySelector('.image').src = imageURL;
  document.querySelector('.image').alt = imageDescription;
  var confidenceIcon = document.createElement('div');
  confidenceIcon.classList.add('confidence-icon');
  confidenceIcon.classList.add(imageConfidence < 0.4 ? 'red' : imageConfidence < 0.7 ? 'orange' : 'green');
  document.querySelector(".image-description").innerHTML = confidenceIcon.outerHTML + imageDescription;
  document.querySelector(".youtube-link").innerHTML = '<i class="fa fa-fw fa-music" aria-hidden="true"></i> ' + songTitle;
}
