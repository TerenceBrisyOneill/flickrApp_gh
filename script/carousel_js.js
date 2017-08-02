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
function getSearchTags(){
	var tagContainer = document.getElementById("tagContainer");
	var inputs = tagContainer.getElementsByTagName("input");
	var tags = "";
	/*IF INPUTS == 0 NEED TO CALL FUNCTION FOR MESSAGE OUTPUT*/
		if(inputs.length > 1){
			if(inputs.length == 2){
				tags += inputs[0].value + ",";
				tags += inputs[1].value;
			}else if(inputs.length > 2){
				for(var i = 0; i < inputs.length - 1;i++){
					tags += inputs[i].value + ",";
				}
				for(var i = inputs.length - 1; i < inputs.length;i++){
					tags += inputs[i].value;
				}
			}
			
		}else{
			tags += inputs[0].value;
		}
	return tags;
}
function createRequestUrl(tags){
	request = "https://api.flickr.com/services/rest/?";
	request += "method=flickr.photos.search";
	request += "&per_page=10";
	request += "&api_key=80688a2122d1a22f07dc9541e87053ce";
	request += "&tags=" + tags + "";
	request += "&tag_mode=all";
	request += "&format=json";
	encodeURIComponent(request);
	return request;
} 
function createScript(request){
	newScript = document.createElement("script");
	newScript.setAttribute("src",request);
	head = document.getElementsByTagName("head")[0];
	head.appendChild(newScript);
}
function removeExistHeadScript(){
	head = document.getElementsByTagName("head")[0];
	scriptTags = head.getElementsByTagName('script');
	
	for(var i = 0; i < scriptTags.length;i++){
		head.removeChild(scriptTags[i]);
	}
}
function searchImages(){
	searchImgBtn = document.getElementById("searchImgBtn");
	var searchTags = "", requestUrl = "";
	searchImgBtn.onclick = function(){
		/*CALL - REMOVES EXIST HEAD SCRIPT*/
		removeExistHeadScript();
		/*REQUIRED CALL - COLLECTED ALL TAGS*/
		searchTags = getSearchTags();
		/*REQUIRED CALL - ADD TAGS TO REQUEST URL */
		requestUrl = createRequestUrl(searchTags);
		/*REQUIRED CALL - ADDS CREATED URL TO NEW SCRIPT FOR HTML HEAD*/
		createScript(requestUrl);
	}
} 
/*THIS IS THE FUNCTION THE FLICKR API LOOKS FOR TO RETURN IMAGES TO*/
function jsonFlickrApi(images){
	var newStr = "", imgArray = [], counter = 0,
	numImgs = images.photos.photo.length, countDownImgs = numImgs,
	innerCarousel = document.getElementById("inner_carousel");
	
	for(i = 0; i < numImgs; i++){
		url = "http://farm" + images.photos.photo[i].farm;
		url += ".static.flickr.com/";
		url += images.photos.photo[i].server + "/";
		url += images.photos.photo[i].id + "_";
		url += images.photos.photo[i].secret;
		url += "_s.jpg";
		
		/*newStr += "<img src=" + url + ">" 
		innerCarousel.innerHTML = newStr;*/

		img = new Image();
 		img.src = url;
 		img.numRef = counter;
 		imgArray.push(img);

 		/*THIS ADDS TO CAROUSEL, BUT IT IS SET TO DISPLAY:NONE UNTIL ONLOAD
 		FUNCTION IS RUN ON ALL IMAGES*/
 		document.getElementById("inner_carousel").appendChild(imgArray[counter]);
		img.onload = function(){
    		countDownImgs --;
    		if(countDownImgs <= 0){
				innerCarousel.style.display = "block";
    		}
    	}
    	counter++;

	}
	positionImgCarousel();	
}
function positionImgCarousel(){
	var outerCarousel = document.getElementById('outer_carousel');
	var innerCarousel = document.getElementById('inner_carousel');
	var images = innerCarousel.getElementsByTagName('img');
	var imagesLength = images.length;
	
	/*CURRENTLY THESE ARE NOT DYNAMICALLY CREATED
	-resets 1st image in center of carousel for desktop on each search*/

	innerCarousel.style.left = 334 + "px";
	images[0].style.opacity = 1;

	/*SETTING INNER-CAROUSEL FOR TOP AND LEFT
	BEFORE ANY IMAGE CLICK EVENT*/
	/*innerCarousel.style.top = (outerCarousel.offsetHeight - innerCarousel.offsetHeight) / 2 + "px";
	alert(innerCarousel.style.top);
	var innerLeftOffset = images[0].offsetLeft;
	halfOuterCarousel = outerCarousel.offsetWidth / 2;
	var halfImgWidth = images[0].offsetWidth / 2;
	var outerLeftOffset = halfOuterCarousel - halfImgWidth;
	var leftPos = outerLeftOffset - innerLeftOffset;
	innerCarousel.style.left = leftPos + "px";
	alert(innerCarousel.style.left);*/
	
	for(var i = 0; i < imagesLength; i++){
		images[i].onclick = null;
		images[i].onclick = function(){
			/*CODE FOR CENTERING CAROUSEL IMAGES*/
			innerCarousel.style.top = (outerCarousel.offsetHeight - innerCarousel.offsetHeight) / 2 + "px";
			innerLeftOffset = this.offsetLeft;
			halfOuterCarousel = outerCarousel.offsetWidth / 2;
			halfImgWidth = this.offsetWidth / 2;
			outerLeftOffset = halfOuterCarousel - halfImgWidth;
			leftPos = outerLeftOffset - innerLeftOffset;
			innerCarousel.style.left = leftPos + "px";
			/*OPACITY OF IMAGES NOT ON FOCUS*/
			for(var j = 0; j < imagesLength;j++){
				images[j].style.opacity = 0.2;
			}
			this.style.opacity = 1.0;
		}
	}
}
window.onload = function(){
	addTag();
	searchImages();
	jsonFlickrApi(images);
}