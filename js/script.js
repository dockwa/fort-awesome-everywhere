$(function(){

  $('#dropzone')[0].ondragover = function() {
      this.className = 'hover';
      return false;
  };
  $('#dropzone')[0].ondragend = function() {
      this.className = '';
      return false;
  };
  $('#dropzone')[0].ondrop = function(e) {
      this.className = '';
      e.preventDefault();

      var file = e.dataTransfer.files[0];
      var reader = new FileReader();
      reader.onload = function(event) {
          console.log(event.target);
          getData(event.target.result, exportJSON);
          getData(event.target.result, exportXML);
          this.className = 'success';
          this.innerHTML = 'Success!';
      }.bind(this);
      console.log(file);
      reader.readAsText(file);

      return false;
  };

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

var getData = function(data, exportFunction){
  var prefix = data.match(/}.([a-zA-Z0-9-_]+){/);
  if(prefix == null){
    alert('Your data is not in the correct format.');
    return;
  }
  var fontNameRegex = new RegExp("@font-face{font-family:\'?([a-zA-Z0-9_]+)\'?;", "gi");
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
    xml += '<string name="' + result[i][1].replace('-', '_') + '">&#x' + result[i][2] + ';</string>\n';
  }
  xml += '</resources>';
  $('#android-output').val(xml);
  $('#download-xml').show();
}

var downloadJSON = function(){
  download($('#ios-output').val(), fontName.toLowerCase() + "_icon_map.json", "text/plain");
}

var downloadXML = function(){
  download($('#android-output').val(), "icons.xml", "text/plain");
}
