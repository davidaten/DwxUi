/*
#overlay {
     visibility: hidden;
     position: fixed;
     left: 0;
     top: 0;
     width: 100%;
     height: 100%;
     text-align:center;
     z-index: 200;
     background-image:url(maskBG.png);
    background-color: black;
    opacity:0.9;
}

#overlay div {
     width:300px;
     margin: 100px auto;
     background-color: #fff;
     border:1px solid #000;
     padding:15px;
     text-align:center;
}
*/
/*
example #tooltip .yui3-widget-bd {
  text-align: left;
  max-width: 15em;
  background-color: #FFF6D5;
  border: solid 1px #aa8;
  padding: 0.2em 0.5em 0.3em;
  border-radius: 2px;
  box-shadow: 3px 3px 5px rgba(0,0,0,0.2);
}
*/
DwxUiPopup = {};
DwxUiPopup.DivMake = function (){
	var ary = [];
	ary.push('<div DwxUiPopup="div-head">');//Header title	
	ary.push('	  <div DwxUiPopup="div-headtxt">');//Header title
    ary.push('	  </div>');
	ary.push('	  <div DwxUiPopup="div-headbtn">');//Header close button
    ary.push('	  </div>');
    ary.push('</div>');	
	ary.push('<div DwxUiPopup="div-body">');//Body 
    ary.push('</div>');
	
	var div = document.createElement('div');
    div.innerHTML = ary.join("");
	return div;
}
DwxUiPopup.DivWalk = function (cb_obj, cb_tag, node) {

    var name = node.getAttribute("DwxUiPopup");
    if (!name)
        return;
    var ary = name.split("-");
    switch (ary[1]) {
        case "head":
            cb_obj.HeadDiv=node;
            break;
        case "headtxt":
            cb_obj.HeadTxtDiv=node;
            break;
        case "headbtn":
            cb_obj.HeadBtnDiv=node;
            break;
		case "body":
            cb_obj.BodyDiv=node;
            break;
    }
}

DwxUiPopup.CoverCssGet = function (){
	var ary = [];
	ary.push("visibility: hidden");
    ary.push("position: fixed");
    ary.push("left: 0");
    ary.push("top: 0");
    ary.push("width: 100%");
    ary.push("height: 100%");
    ary.push("text-align: center");
    ary.push(" z-index: 200");
    ary.push("background-image:url(maskBG.png)");
    ary.push("background-color: black");
    ary.push("opacity:0.9");
	return ary.join(";");
}
DwxUiPopup.WrapCssGet = function () {
    var ary = [];
    ary.push("position: fixed");
    ary.push("margin: 0px");
    ary.push("border: 0px");
    ary.push("border-radius: 6px 6px 6px 6px"); 
    ary.push("box-shadow: 0 0 64px #000");
    return ary.join(";");
}
DwxUiPopup.HeadCssGet = function (){
	var ary = [];
    ary.push("color: #000");
    ary.push("background-color: #ddd");
    ary.push("border-bottom: 1px solid #ccc");
    ary.push("border-radius: 6px 6px 0px 0px");
    //ary.push("font-weight: bold");
    //ary.push("padding: 6px 8px");
    //ary.push("text-shadow: 0px 1px 0px #f4f4f4");
    return ary.join(";");
}
DwxUiPopup.BodyCssGet = function (){
	var ary = [];
    ary.push("color: #000");
    ary.push("background-color: #eee");
    ary.push("padding: 6px 8px");
    ary.push("border: 0px");		
	ary.push("border-radius: 0px 0px 6px 6px");
    return ary.join(";");	
}


DwxUiPopup.ObjInit = function (){
	var obj = {};
	obj.CoverColor = null;
	obj.CoverDiv = null;

	obj.WrapDiv = null;
	obj.HeadTxtDiv = null;	
	obj.HeadBtnDiv = null;		
	obj.BodyDiv = null;		
	obj.HeadTxtSet = function (txt){
	    this.HeadTxt = txt;
	}	
	obj.HeadBtnSet = function (btn){
	    //this.HeadTxt = txt;
	}	
	obj.DivMake = function (){
	
	    this.WrapDiv = DwxUiPopup.DivMake();
	    this.WrapDiv.style.cssText = DwxUiPopup.WrapCssGet();;
        var cb_obj = CallbackSet(DwxUiPopup.DivWalk, this, 0);
        ElementWalk(this.WrapDiv, cb_obj);

        this.HeadDiv.style.cssText = DwxUiPopup.HeadCssGet();
		this.HeadTxtDiv.innerHTML = "Title:"//this.HeadTxt;
		this.HeadTxtDiv.style.cssText = "padding: 6px 8px; font-weight: bold; text-shadow: 0px 1px 0px #f4f4f4";
		this.HeadBtnDiv.innerHTML = "X";//this.HeadBtn;		
		// onMouseOver="this.style.backgroundColor='#999999'"
     //onMouseOut="this.style.backgroundColor='#FFFFFF'">
		this.HeadBtnDiv.style.cssText = "position: absolute; padding: 6px 6px; right: 0; top: 0;";
        //obj.SliderDivMake();

		this.BodyDiv.innerHTML = "asdfasdfasdfdasfasfasf";//this.HeadBtn;		
		this.BodyDiv.style.cssText = DwxUiPopup.BodyCssGet();

		this.WrapDiv.style.visibility= "hidden";
	}

	obj.DivShow = function () {
	    var w,h;
	    w = this.BodyDiv.offsetWidth;
        h = this.HeadDiv.offsetHeight + this.BodyDiv.offsetHeight;
	    this.WrapDiv.style.width = sprintf("%spx", this.BodyDiv.offsetWidth);
	    this.WrapDiv.style.height = sprintf("%spx", this.HeadDiv.offsetHeight + this.BodyDiv.offsetHeight);

	    this.WrapDiv.style.top = sprintf("%spx", Math.max(window.innerHeight - h, 0) / 2);
	    this.WrapDiv.style.left = sprintf("%spx", Math.max(window.innerWidth - w, 0) / 2);
        /*
	    this.WrapDiv.style.left = "300px";
	    this.WrapDiv.style.top = "100px";		
	    this.WrapDiv.style.width = sprintf("%spx", this.BodyDiv.offsetWidth);
	    this.WrapDiv.style.height = sprintf("%spx",this.HeadDiv.offsetHeight+this.BodyDiv.offsetHeight);		
        */
	    this.WrapDiv.style.visibility = "visible";
	    //this.WrapDiv.style.display = "block";		
    }

	return obj;
}
DwxUiPopup.LoadDemo = function () {
    var obj = DwxUiPopup.ObjInit();
    obj.DivMake();
    obj.Drager = DwxUiDrager.ObjInit(obj.WrapDiv);

    obj.BodyDiv.innerHTML = "";
    var obj_color_pick = DwxUiColorPick.ObjInit(124, 94, 59, 1);
    obj_color_pick.DivMake();
    obj.BodyDiv.appendChild(obj_color_pick.WrapDiv);

    obj.Drager.MsDnSet(obj.HeadTxtDiv);
    obj.WrapDiv.id = "DwxUiColorPick";
    ElementReplace(obj.WrapDiv);
    obj.DivShow();
    document.body.appendChild(obj.WrapDiv);

}