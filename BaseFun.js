// JavaScript source code
function sprintf(format) {
    for (var i = 1; i < arguments.length; i++) {
        format = format.replace(/%s/, arguments[i]);
    }
    return format;
}
function CallbackSet(fun, obj, tag) {
    if (fun == null)
        return null;

    cb_obj = {};
    cb_obj.CbFun = fun;
    cb_obj.CbObj = obj;
    cb_obj.CbTag = tag;
    return cb_obj;
}
function Str2Int(str,radio) {

    if (arguments.lenth < 1) {
        str = "0";
    }
    if (str == null)
        str = "0";

    if (arguments.lenth < 2) {
        radio = 10;
    }
    
    var value = parseInt(str, radio);
    return value;
}

function Int2Str(value, radio, len) {

    if (arguments.lenth < 3) {
        len = 0;
    }
    if (arguments.lenth < 2) {
        radio = 10;
    }
    if (arguments.lenth < 1) {
        return "";
    }
    var str = value.toString(radio);
    while (str.length < len) {
        str = "0" + str;
    };
    return str;
}
function PadInt(value, radio, len) {

    if (arguments.lenth < 3) {
        len = 0;
    }
    if (arguments.lenth < 2) {
        radio = 10;
    }
    if (arguments.lenth < 1) {
        return "";
    }
    var str = value.toString(radio);
    while (str.length < len) {
        str = "0" + str;
    };
    return str;
}

function StrCap(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    //return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
}
function StrSub(str,off,len) {
    return str.substring(off,off+len);
}

function HtmlRgb(r, g, b) {
    if (r > 255) r = 255;
    if (r < 0) r = 0;
    if (g > 255) g = 255;
    if (g < 0) g = 0;
    if (b > 255) b = 255;
    if (b < 0) b = 0;
    return sprintf("#%s%s%s", PadInt(r, 16, 2), PadInt(g, 16, 2), PadInt(b, 16, 2));
}
/*
function (ary){

	var tr = document.createElement('tr');

	for (var i = 0; i < ary.length; i++) {
        var td = document.createElement('td');
        tr.appendChild(td);
		if (ary[i]==null)
			continue;
		var type=typeof ary[i];
		switch(type){
		case "string":
		case "objject
        td.innerHTML = ary[i];
	}
	tr 
}
*/
function StrCodeDbg(str) {
    for (var i = 0; i < str.length; i++) {
        console.log(sprintf("i=%s,char=%s,code=x%s", i, str.charAt(i), str.charCodeAt(i).toString(16)));
    }
}

function ElementReplace(obj) {

	var old = document.getElementById(obj.id);
    old.parentElement.replaceChild(obj, old);
}
function ElementEmpty(id) {

	var old = document.getElementById(id);
    old.innerHTML = "";
}

function ElementWalk(node,cb_obj){

    if (node.nodeType == 1) {

        cb_obj.CbFun(cb_obj.CbObj,cb_obj.CbTag,node);

        node = node.firstChild;
        while (node) {
            ElementWalk(node, cb_obj);
            node = node.nextSibling;
        }
    }
}

function removeAllChildren(theParent) {

    // Create the Range object
    var rangeObj = new Range();

    // Select all of theParent's children
    rangeObj.selectNodeContents(theParent);

    // Delete everything that is selected
    rangeObj.deleteContents();
}

function DwxUiCssAry (){
    var obj = {};
    obj.Ary = [];
    obj.Add = function (name, value) {
        //str.replace(/^\s+|\s+$/g, '');
        name = name.trim();
        value = value.trim();
        this.Ary.push(name);
        this.Ary.push(value);
    }
    obj.Fix = function (name, value) {
        name = name.trim();
        value = value.trim();
        for (var i = 0; i < this.Ary.length; i+=2) {
            if (this.Ary[i] != name)
                continue;
            this.Ary[i + 1] = value;
            return 1;
        }
        this.Ary.push(name);
        this.Ary.push(value);
        return 0;
    }
    obj.Get = function CssAryGet() {
        var str = "";
        for (var i = 0; i < this.Ary.length; i += 2) {
            str+=this.Ary[i];
            str+= ":";
            str+=this.Ary[i+1];
            str += ";";
        }
        return str;
    }

    return obj;
}