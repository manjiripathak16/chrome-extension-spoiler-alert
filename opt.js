
// Saves options to chrome.storage
function buildSaveArray(){
  //to create array to save
  var saveArray = [];
  var element = document.querySelectorAll('.keyword-row');//gives array of all elements
  for(var i = 0; i < element.length; i++){

    //saving all info from inputs into the object
    var obj = {};
    obj.keyword = element[i].querySelector('.keyword input').value;
    obj.type = element[i].querySelector('.type select').value;
    obj.replace = element[i].querySelector('.replace input').value;
    saveArray.push(obj);
  }

  save_options(saveArray);

}
function save_options(saveArray) {
    
    chrome.storage.sync.set({
      keywordsArray: saveArray
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    chrome.storage.sync.get({
      keywordsArray: []
    }, function(items) {
      
      buildOptDisplay(items.keywordsArray); //pass an array or object that we are going to save
      
    });
  }

  function buildOptDisplay(items){
    if(items.length == 0){
      document.querySelector('.add-keyword').click(); //programmatically click that button
    }
    for(var i = 0; i < items.length; i++){
      //items[i]...
      if(typeof items[i] === "object"){
        createRowWithOptions(items[i], i)
      }
      
    }
  }

function createRowWithOptions(obj, int = 0){

  var keywordRow = document.querySelector('.keyword-row').innerHTML;
  
  //removes the "replace with" text box when type is changed
  if(typeof document.querySelector('.keyword-row').dataset.id === 'undefined'){
    document.querySelector('.keyword-row').remove();
  }
  
  var newRow = document.createElement('div');
  newRow.className = 'keyword-row';
  var timestamp = (Date.now() + int); //adding int so that there is some gap between the enteries
  newRow.dataset.id = timestamp; //using timestamp as id for entry
  newRow.innerHTML = keywordRow; //this is better than appending because you're adding innerHTML only to the new element and not to the whole design
  document.querySelector('.keyword-holder').appendChild(newRow);

  var newEle = document.querySelector('.keyword-holder .keyword-row[data-id="'+timestamp+'"]')
  newEle.querySelector('.keyword input').value = obj.keyword;
  newEle.querySelector('.type select').value = obj.type;
  if(obj.type == '1'){
    newEle.querySelector('.replace').style.display = 'block';
    newEle.querySelector('.replace input').value = obj.replace;
  }
  else{
    newEle.querySelector('.replace').style.display = 'none';
  }
  newEle.querySelector('.type select').addEventListener('change', function(e){
    var element = e.target;
    var parent = element.parentNode.parentNode;
    if(element.value == '1'){
      parent.querySelector('.replace').style.display = 'block';
    }else{
      parent.querySelector('.replace').style.display = 'none';
    }
  });
}
  

  //add listener to add keyword button
  document.querySelector('.add-keyword').addEventListener('click', function(){
    var obj = {};
    obj.keyword = 'example';
    obj.type = '1';
    obj.replace = 'string';
    createRowWithOptions(obj)
  });

  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
  buildSaveArray);