QUnit.test( "should have GenerateImage button", function(assert) {
  assert.equal(document.querySelector("#generate-image-button").tagName, 'BUTTON');
});

QUnit.test( "no content is sourced before Generate image button clicked", function(assert) {
  assert.notOk(document.querySelector('.image').getAttribute('src'));
  assert.notOk(document.querySelector('.image-description').innerHTML);
  assert.notOk(document.querySelector('.articles').innerHTML);
  assert.notOk(document.querySelector('.youtube-link').innerHTML);
});

QUnit.test( "clicking Generate image button generates image, description, articles and song", function(assert) {
  var done = assert.async();
  document.querySelector("#generate-image-button").click();
  window.setTimeout(function() {
    assert.ok(document.querySelector('.image').getAttribute('src'));
    assert.ok(document.querySelector('.image-description').innerHTML);
    assert.ok(document.querySelector('.articles').innerHTML);
    assert.ok(document.querySelector('.youtube-link').innerHTML);
    done();
  }, 7000);
});
