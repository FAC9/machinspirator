(function () {

  'use strict';

  var generateImageButton = document.querySelector('#generate-image-button');
  var loading = document.querySelector(".loading");
  var imageURL, imageDescription, imageTags, imageTagsFiltered, newURL, guardianNews, imageConfidence, callbacks, tuneResponse, songTitle, songURL;

  generateImageButton.onclick = generateData;

  var generateImage = new XMLHttpRequest();

  generateImage.onreadystatechange = function() {
    if (generateImage.readyState === 4 && generateImage.status == 200) {
      imageURL = JSON.parse(generateImage.response).urls.regular;
      updateImage(imageURL);
      getImageDescription(imageURL);
    }
  }

  function generateData () {
    generateImage.open('GET', "https://api.unsplash.com/photos/random?client_id=" + unsplashKey);
    showLoading();
    generateImage.send();
  };

  var describeImage = new XMLHttpRequest();

  describeImage.onreadystatechange = function() {
    if (describeImage.readyState === 4 && describeImage.status == 200) {
      var data = JSON.parse(describeImage.response).description;
      imageDescription = data.captions[0].text;
      imageConfidence = data.captions[0].confidence;
      imageTags = data.tags;
      imageTags = imageTags.length > 5 ? imageTags.slice(0,5) : imageTags;
      imageTagsFiltered = imageTags.filter(x => x !== 'outdoor' && x !== 'indoor');
      document.querySelector(".image-description").textContent = imageDescription;
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
      tuneResponse = JSON.parse(generateTune.response).message.body.track_list[0];
      songTitle = tuneResponse.track.artist_name + ' - ' + tuneResponse.track.track_name;
      songURL = "https://www.youtube.com/results?search_query=" + songTitle.replace(/[\s-]+/g,'+');
      callbacks--;
      if (callbacks === 0) {
        onRequestComplete();
      }
    }
  }

  function getTune () {
    var selectedTag = imageTagsFiltered[Math.floor(Math.random() * imageTagsFiltered.length)];
    generateTune.open('GET', "https://crossorigin.me/https://api.musixmatch.com/ws/1.1/track.search?format=json&q_track=" + selectedTag + "&quorum_factor=1&apikey=" + musixmatchKey, true);
    generateTune.send();
  }

  var generateGuardian = new XMLHttpRequest();

  function getGuardianArticles () {
    generateGuardian.open('get',"http://content.guardianapis.com/search?q="+imageTagsFiltered[0]+"%20"+imageTagsFiltered[1]+"%20"+imageTagsFiltered[2]+"&api-key="+guardianKey);
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

  function createConfidenceIcon () {
    var confidenceIcon = document.createElement('div');
    confidenceIcon.classList.add('confidence-icon');
    confidenceIcon.classList.add(imageConfidence < 0.4 ? 'red' : imageConfidence < 0.7 ? 'orange' : 'green');
    document.querySelector(".image-description").innerHTML = confidenceIcon.outerHTML + imageDescription;

  }

  function updateDOM () {
    document.querySelector('.image').src = imageURL;
    document.querySelector('.image').alt = imageDescription;
    document.querySelector(".image-tags").innerHTML = imageTags.join(" - ");
    document.querySelector(".youtube-link").innerHTML = '<i class="fa fa-fw fa-music" aria-hidden="true"></i> ' + songTitle;
    var fontAwesomePlay = '<i class="fa fa-fw fa-music" aria-hidden="true"></i>';
    document.querySelector(".youtube-link").innerHTML = fontAwesomePlay + '<a href="' + songURL + '" target="_blank"> ' + songTitle + '</a>';

    createConfidenceIcon();
  }

}());
