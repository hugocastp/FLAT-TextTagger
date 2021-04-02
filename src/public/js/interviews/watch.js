var endSpan;
var spans = [];
var newTags = [];
var eliminatedtags = [];
var idInterview;
var current_tags = [];
var cont = 0;
var tag_added = [];
var all_tags = [];
var refresh = 0;
//var first_time = 0;

//sentence = document.getElementById('line0')
idInterview = document.getElementById('IdItrviewHolder').innerHTML;
function getButtonSave() {
  return document.getElementById("btnSave")
}
function getOptCategory() {
  return document.getElementById("optCategory");
}
function getTextArea() {
  return document.getElementById("text_html");
}
function getSpansIntake() {
  return document.getElementsByName("I")
}
function getResultArea() {
  return document.getElementById("result");
}
function getButton() {
  return document.getElementById('addColor');
}
function getColor() {
  return document.getElementById("selectedColor");
}
function getTagsCollections() {
  return document.getElementById("tagscollection");
}
function getFullWatch() {
  return document.getElementById("fullWatch");
}
function getText(){
  return document.getElementById("line");
}
function getSelectedText(eventArgs) {
  
  var text = window.getSelection().toString();
  text = text.trim();
  console.log(text)
  getResultArea().innerHTML = text;
  //eventArgs.srcElement.innerText = text
  //endSpan = eventArgs.srcElement;
}
function reProcessText() {

  //globals ref
  var selected = getResultArea().value.trim();
  var html_optCategory = getOptCategory();
  var idCatTag = html_optCategory.options[html_optCategory.selectedIndex].text;
  let _color = html_optCategory.options[html_optCategory.selectedIndex].value;
  //console.log(html_optCategory)
  //console.log(idCatTag)
  //console.log(_color)

  //verification
  if (selected == '' || getColor().value == '#ffffff') {
    return;
  }

  const category = idCatTag;
  const color = _color;
  //const unmodifiedText = endSpan.innerText.trim();
  const selectedText = selected.trim();
  //console.log("selectedText")
  //console.log(selectedText)
  //tag_added = []
  //console.log(current_tags.length)
  texto = getText().innerText;
  position = texto.indexOf(selectedText.trim());
  t = [selectedText,color,position]
  tag_added.push(t)
  console.log("Se añadio etiqueta")
  //console.log(tag_added)
  addNewTag(tag_added, null, category, color);
  //Adding to lists
  addTagTocollection(category, idInterview, "0", selectedText, color);  
}
function addNewTag(tags, srcElement, category, color) {
  //console.log(category)
  //console.log(tags)
  if (refresh == 1){
    current_tags = tags;
    refresh = 0;
  }else{
    current_tags = all_tags.concat(tags)
    //console.log(current_tags)
  }

  list = document.getElementById('tagscollection');
  //console.log(list.options)
  for (j=0; j < current_tags.length; j++){
    if (category!=null&&category!="") {
      appears = 0;
        for (k=0; k < list.options.length; k++){
          str = list.options[k].text;
          str = str.substr(str.indexOf(' ')+1)
          if (str == current_tags[j][0]){
            appears = 1;
            break;
          }
        }
      if (appears == 0){
        document.getElementById('tagscollection').appendChild(createOpt(category, current_tags[j][0].substring(0, 20), color));
      }
    }
  }

  for (k=0; k < list.options.length; k++){
    str = list.options[k].text;
    str = str.substr(str.indexOf(' ')+1)
    appears = 0;
    for (j=0; j < current_tags.length; j++){
      if (str == current_tags[j][0]){
        appears = 1;
        break;
      }
    }
    if (appears == 0){
      list.remove(k)
    }
  }

  sentence = getText().innerText;
  srcElement = getText();
  srcElement.innerHTML = "";

  for (i=0; i < current_tags.length; i++){
    t = current_tags[i]
    selectedText = t[0];
    color = t[1];
    position = t[2];
    sentence = sentence.replace(selectedText," "+ position + " ");
  }
  //console.log(sentence)
  parts = sentence.split(" ");
  //console.log(parts)

  for (j=0; j < parts.length; j++){
    ban=0;
    p = document.createElement("span");
    for (i=0; i < current_tags.length; i++){
      t = current_tags[i]
      selectedText = t[0];
      color = t[1];
      position = t[2];
      if (position == parts[j]){
        var span = createSpanForTaggedText(current_tags[i][0], current_tags[i][1], category);
        srcElement.appendChild(span);
        ban=1;
        break;
      }
    }
    if (ban==0){
      p.innerText = " "+parts[j] + " ";
      srcElement.appendChild(p);
    }
  }
}
function addTagTocollection(cat, idInt, _stamp, text, _color) {
  //console.log("hola")
  //console.log(newTags)

  if (newTags.length>1){
    ban = 0
    for (i=0; i < newTags.length; i++){
      ins = newTags[i];
      if (ins["sentence"].includes(text)) {
        ban=1
        //console.log("segun no lo incluye")
        //console.log(ins["sentence"])
        //console.log(text)
        //newTags.push({ id_cat_tag: cat, idDialogInterview: idInt, stamp: _stamp, sentence: text, color: _color });
      }
    }
    if (ban == 0){
      newTags.push({ id_cat_tag: cat, idDialogInterview: idInt, stamp: "0", sentence: text, color: _color });
    }
  }else{
    newTags.push({ id_cat_tag: cat, idDialogInterview: idInt, stamp: "0", sentence: text, color: _color });
  }
}
function randomColor() {
  let color = Math.round(Math.random() * 250 + 1);
  return color.toString(16) + color.toString(16) + color.toString(16);
}
function createSpanForTaggedText(text, _color, category) {
  var newtag = document.createElement('span');
  newtag.style.backgroundColor = _color;
  newtag.setAttribute('name', category);
  newtag.className = "lblSpan";
  newtag.innerText = text;
  newtag.onclick = deployMenu;
  //console.log(category)
  return newtag;
}
function createOpt(idCatTag, text, color) {
  var opt = document.createElement("option");
  opt.style.color = color;
  opt.innerText = idCatTag + " " + text;
  return opt;
}

function save() {
  //console.log(newTags)
  //tag_added = []
  console.log(getText())
  var spans = [];
  var tagged_text = "";
  var searchSpans = getText().children;
  for(var i = 0; i < searchSpans.length; i++) {
      if(searchSpans[i].tagName == 'SPAN') {
        span = searchSpans[i].innerText;
        if(searchSpans[i].className == 'lblSpan'){
          spanTag = searchSpans[i].getAttribute("name")
          var new_span = "<"+spanTag+">"+span+"</"+spanTag+">";
          tagged_text = tagged_text + new_span;
        }else{
          tagged_text = tagged_text + span;
        }
      }
  }
  tagged_text = tagged_text.replace("I: ","");
  //console.log(tagged_text)
  //console.log(getText().children)
  //console.log(getText().getAttribute("name"))
  AjaxRequest("POST", '/interviews/addTag', { newTags: newTags, tagged_text: tagged_text}, (_) => window.location.href = 'http://localhost/interviews/watch/' + idInterview);
  refresh = 1;
}

function AjaxRequest(method, purl, package, fun) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, purl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      fun(this.response);
    }
  };
  var data = JSON.stringify(package);
  xhr.send(data);
}

function category_changed() {
  //var title = document.getElementById('ctrTitle');
  /*console.log(title)
  if (title != null) {
    title.parentNode.removeChild(title);
  }*/
  var opt_html = getOptCategory();
  var color_html = getColor();
  const index = opt_html.selectedIndex;
  const color = opt_html.options[index].value;
  if (color == "add new") {
    color_html.disabled = '';
    color_html.value = '#ffffff';
    var frmMenu_html = document.getElementById('frmAddTagMenu');
    var newElement = document.createElement("input");
    newElement.setAttribute("type", "text");
    newElement.setAttribute('class', 'form-control');
    newElement.setAttribute('plceholder', 'Title');
    newElement.id = 'inpTitle';
    var newDiv = document.createElement('div');
    newDiv.className = 'form-group';
    newDiv.appendChild(newElement);
    newDiv.id = 'ctrTitle';
    var html_childs = frmMenu_html.childNodes;
    frmMenu_html.insertBefore(newDiv, html_childs[3]);
    return;
  }
  color_html.disabled = 'true';
  color_html.value = color;
}
function deployMenu(eventArgs) {
  DeletMenuIfExists();
  const x = eventArgs.screenX;
  const y = eventArgs.y;
  name_tag = eventArgs.srcElement.innerText;
  //console.log(name_tag)
  var root = document.getElementById('root');
  root.appendChild(createMenu(name_tag));
  root.style.position = "fixed";
  root.style.top = y + "px";
  root.style.left = x + "px";
}
function createMenu(name_tag) {
  var menu = document.createElement('div');
  menu.className = "floatingMenu";
  menu.id = 'fmenu';
  menu.onmouseleave = () => menu.remove();
  menu.appendChild(createBtnRemove(name_tag));
  return menu;
}
function createBtnRemove(name_tag) {
  var btnRemover = document.createElement('div');
  btnRemover.onclick = () => {
    //console.log(btnRemover.id)
    //console.log(all_tags)
    tag = btnRemover.id
    for (j=0; j < all_tags.length; j++){
      if (tag == all_tags[j][0]){
        all_tags.splice(j,1);
        break;
      }
    }
    //console.log(all_tags)
    if (all_tags.length > 0){
      refresh = 1;
      addNewTag(all_tags, null,null,null);
    }

    //console.log(newTags)

    if (newTags.length > 0){
      for (i = 0; i < newTags.length; i++){
        //console.log(newTags[i]["sentence"])
        if (newTags[i]["sentence"] == tag){
          newTags.splice(i,1)
          break;
        }
      }
    }

    AjaxRequest("POST", '/interviews/deleteTag', { stamp: "0", idDialogInterview: idInterview, sentence: tag }, (_) => { });

    //console.log(getText())
    /*var span = endSpan.parentNode;
    var newsentence = "";
    //const stamp = span.id.substring(4);
    const sent = span.id.substring(5);
    span.childNodes.forEach(childNode => {
      newsentence += childNode.innerText;
    });
    span.innerHTML = newsentence;
    AjaxRequest("POST", '/interviews/deleteTag', { stamp: "0", idDialogInterview: idInterview, sentence: selectedText }, (_) => { });
    btnRemover.parentElement.remove();*/
  }
  btnRemover.id = name_tag;
  btnRemover.innerText = 'Eliminar';
  btnRemover.className = 'btn btn-danger';
  return btnRemover;
}
function DeletMenuIfExists() {
  var menu = document.getElementById("fmenu");
  if (menu != null) {
    menu.remove();
  }
}
function loadTags(tagsinOpt) {
  //console.log(tagsinOpt)
  //Pasar a un helper de handlebars
  srcElement = null;
  //all_tags = []
  const nodes = tagsinOpt.childNodes;
  //console.log(nodes)
  for (const key in nodes) {
    //console.log(key)
    if (tagsinOpt.childNodes.hasOwnProperty(key)) {
      const node = tagsinOpt[key];
      //console.log(node)
      if(node!= undefined || ""){
        const tag= node.innerText.split(" ");
      //const stamp = tag[0];
      const color = node.style.color;
      const selectedText = tag.slice(1).reduce((a,c)=>a+" "+c);
      //console.log(selectedText)
      srcElement = document.getElementById('line')
      sentence = srcElement.innerText;
      position = sentence.indexOf(selectedText);
      t = [selectedText,color,position]
      all_tags.push(t)
      }
    }
  }
  //console.log(all_tags)
  if (all_tags.length > 0){
    refresh = 1;
    addNewTag(all_tags, srcElement,null);
  } 
}
function addEvents(html_Button_Save, html_Button, html_spans, html_optCategory) {
  //console.log(html_spans)
  //console.log(html_optCategory)
  document.addEventListener("scroll", DeletMenuIfExists);
  document.getElementById("contTextArea").addEventListener("scroll", DeletMenuIfExists);
  html_Button.addEventListener("click", reProcessText);
  html_Button_Save.addEventListener("click", save);
  let eventos = ["mousedown", "mouseup"];
  let i = 0;
  for (i = 0; i < html_spans.length; i++) {
    for (let e in eventos) {
      html_spans[i].addEventListener(eventos[e], getSelectedText);
    }
  }
  html_optCategory.addEventListener("click", category_changed);
  loadTags( document.getElementById('tagscollection'));
}

addEvents(getButtonSave(), getButton(), getSpansIntake(), getOptCategory());