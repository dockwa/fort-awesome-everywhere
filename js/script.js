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
    var regex = new RegExp("." + prefix[1] + "-([a-zA-Z0-9-_]+):before{content:'\\\\([a-zA-Z0-9]+)'}", "gi");
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
  var json = '{';
  for(var i = 0, l = result.length; i < l; i++){
    json += '\n"' + result[i][1] + '":"\\u' + result[i][2] + '",'
  }
  json = json.slice(0, -1); // remove last comma
  json += '\n}';
  $('#ios-output').val(json);
}

var exportXML = function(result){
  // Format: <string name="add_user">&#xf05b;</string>
  var xml = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
  for(var i = 0, l = result.length; i < l; i++){
    xml += '<string name="' + result[i][1] + '">&#x' + result[i][2] + ';</string>\n';
  }
  xml += '</resources>';
  $('#android-output').val(xml);
}
