QUnit.test( "true returns true", function(assert) {
  assert.equal(true, true);
});

QUnit.test( "should have a div with class imageContainer", function(assert) {
  assert.equal(document.querySelector('.imageContainer').tagName, 'DIV');
});

QUnit.test( "should have 3 buttons with class button", function(assert) {
  assert.equal(document.getElementsByClassName('button').length, 3);
});

QUnit.test( "no image is sourced before Generate image button clicked", function(assert) {
  assert.notOk(document.querySelector('.image').getAttribute('src'));
});

QUnit.test( "clicking Generate image button generates image", function(assert) {
  var done = assert.async();
  document.getElementById("generateImageButton").click();
  window.setTimeout(function() {
    assert.ok(document.querySelector('.image').getAttribute('src'));
    done();
  }, 500);
});
