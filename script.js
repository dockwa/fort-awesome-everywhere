$(function(){

  $('#ios-button').click(function(){
    var kitID = $('input[name=ios_kit_id]').val();
    getData(kitID, exportJSON);
  });

  $('#android-button').click(function(){
    var kitID = $('input[name=android_kit_id]').val();
    getData(kitID, exportXML);
  });

});

var getData = function(kitID, exportFunction){
  $.get("https://use.fortawesome.com/kits/" + kitID + "/" + kitID + ".css", function( data ) {
    var prefix = data.match(/}.([a-zA-Z0-9-_]+){/);
    if(prefix == null){
      alert('Your data is not in the correct format.');
      return;
    }
    var result = [];
    var regex = new RegExp("." + prefix[1] + "-([a-zA-Z\-]+):before{content:'\\\\([a-zA-Z0-9]+)'}", "gi");
    var test = regex.exec(data);
    result.push(test);
    while (test != null) {
      test = regex.exec(data);
      if(test != null){
        result.push(test);
      }
    }
    exportFunction(result);
  })
  .fail(function() {
    alert('Your kit could not be found');
  });
}

var exportJSON = function(result){
  var json = {};
  for(var i = 0, l = result.length; i < l; i++){
    json[result[i][1]] = '\\u' + result[i][2];
  }
  $('#ios-output').val(JSON.stringify(json));
}

var exportXML = function(result){
  var json = {};
  for(var i = 0, l = result.length; i < l; i++){
    json[result[i][1]] = '\\u' + result[i][2];
  }
  $('#android-output').val(JSON.stringify(json));
}
