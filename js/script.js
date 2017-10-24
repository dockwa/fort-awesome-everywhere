$(function(){

  $('#export-btn').click(function(){
    var kitID = $('input[name=kit_id]').val();
    getData(kitID, exportJSON);
    getData(kitID, exportXML);
  });

  $('#download-json').click(function(){
    downloadJSON();
  });

  $('#download-xml').click(function(){
    downloadXML();
  });

  var textarea = document.getElementsByTagName('textarea');
  for(var i = 0, l = textarea.length; i < l; i++){
    textarea[i].addEventListener("focus", function(){this.select()});
  }

});

var asyncScript = function(u, c) {
  var d = document, t = 'script',
      o = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
  o.src = u;
  if (c) { o.addEventListener('load', function (e) { c(null, e); }, false); }
  s.parentNode.insertBefore(o, s);
}

var getData = function(kitID, exportFunction){
  asyncScript("https://use.fortawesome.com/" + kitID + ".js", function(){
    $.get('https://' + FortAwesomeConfig.useUrl + '/woff2.css', function( data ) {
      var prefix = data.match(/}.([a-zA-Z0-9-_]+){/);
      if(prefix == null){
        alert('Your data is not in the correct format.');
        return;
      }
      var fontNameRegex = new RegExp("@font-face{font-family:\'([a-zA-Z0-9_]+)\';", "gi");
      fontName = fontNameRegex.exec(data)[1];

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
  $('#download-json').show();
}

var exportXML = function(result){
  // Format: <string name="add_user">&#xf05b;</string>
  var xml = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
  for(var i = 0, l = result.length; i < l; i++){
    xml += '<string name="' + result[i][1] + '">&#x' + result[i][2] + ';</string>\n';
  }
  xml += '</resources>';
  $('#android-output').val(xml);
  $('#download-xml').show();
}

var downloadJSON = function(){
  download($('#ios-output').val(), fontName.toLowerCase() + "_icon_map.json", "text/plain");
}

var downloadXML = function(){
  download($('#android-output').val(), fontName.toLowerCase() + "_icon_map.xml", "text/plain");
}
