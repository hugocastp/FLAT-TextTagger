function getFileOption(){
	return document.getElementById('filename');
}

function getSaveButton(){
	return document.getElementById('save');
}

function getLoadDataForm(){
	return document.getElementById('load_data');
}

function getOptsOption(){
	return document.getElementById('opts');
}


function loadheaders(){
	if(getFileOption().files[0] != null){
		getLoadDataForm().submit();
		document.getElementById("loading").className += "loading";
	}
}