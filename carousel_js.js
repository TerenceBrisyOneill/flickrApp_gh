function addTag(){
	addTags = document.getElementById("addTags");
	addTags.onclick = function(){
		
		tagCon = document.createElement("div");
		inputSearch = document.createElement("input");
		inputSearch.setAttribute("type","text");
		removeDiv = document.createElement("div");
		removeDiv.innerHTML = "-";
		removeDiv.className = "removeTag";
		removeDiv.setAttribute("onclick","removeTag()");
		tagCon.appendChild(inputSearch);
		tagCon.appendChild(removeDiv);
		
		mainTagCon = document.getElementById("tagContainer");
		mainTagCon.appendChild(tagCon);
	}
}

function removeTag(){
	removeTags = document.getElementsByClassName("removeTag");
	for(var i = 0;i < removeTags.length; i++){
		removeTags[i].onclick = function(){
			rowParent = this.parentNode.parentNode;
			rowParent.removeChild(this.parentNode);	
		}
	}
	
}
function getInputTags(){
	fndImages = document.getElementById("fndImages");
	var tags = "";
	fndImages.onclick = function(){
		head = document.getElementsByTagName("head")[0];
		scriptTags = head.getElementsByTagName('script');
		
		for(var i = 0; i < scriptTags.length;i++){
			head.removeChild(scriptTags[i]);
		}
		
		tagContainer = document.getElementById("tagContainer");
		inputs = tagContainer.getElementsByTagName("input");
		if(inputs.length > 1){
			if(inputs.length == 2){
				tags += "" + inputs[0].value + ",";
				tags += "" + inputs[1].value + "";
			}else if(inputs.length > 2){
				for(var i = 0; i < inputs.length - 1;i++){
					tags += "" + inputs[i].value + ",";
				}
				for(var i = inputs.length - 1; i < inputs.length;i++){
					tags += "" + inputs[i].value + "";
				}
			}
			
		}else{
			tags += "" + inputs[0].value + "";
		}
		var request = requestUrl(tags);
		createScript(request);
		tags = "";
	}
} 
function requestUrl(tags){
	//request = "https://www.flickr.com/servcies/rest/?";
	request = "https://api.flickr.com/services/rest/?";
	request += "method=flickr.photos.search";
	request += "&per_page=10";
	request += "&api_key=80688a2122d1a22f07dc9541e87053ce";
	request += "&tags=" + tags + "";
	request += "&tag_mode=all";
	request += "&format=json";
	
	return request;
} 

function createScript(request){
	newScript = document.createElement("script");
	newScript.setAttribute("src",request);
	head = document.getElementsByTagName("head")[0];
	head.appendChild(newScript);
}

function jsonFlickrApi(images){
	newStr = "";
	
	for(i = 0; i < images.photos.photo.length;i++){
		url = "http://farm" + images.photos.photo[i].farm;
		url += ".static.flickr.com/";
		url += images.photos.photo[i].server + "/";
		url += images.photos.photo[i].id + "_";
		url += images.photos.photo[i].secret;
		url += "_s.jpg";
		
		newStr += "<img src=" + url + "> ";
	}
	document.getElementById("inner_carousel").innerHTML = newStr;
}

window.onload = function(){
	addTag();
	getInputTags();
	
}