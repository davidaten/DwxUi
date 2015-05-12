DwxUiMenu = {};

DwxUiMenu.ObjInit = function () {
    var obj = {};

    obj.FontSize = 16;
    obj.ItemColorStr = "hsl(0,0%,100%)";
    obj.ItemBkColorStr = "#428bca";//"hsl(0,0%,100%)";
    obj.ItemMarginStr = "0px";
    obj.ItemPaddingStr = "5px 10px";
    obj.ItemBdNum = 1;
    obj.ItemBdType = "solid";

    obj.MenuAlign = 0;
    obj.WidthEven = 0;

    obj.ColorStr = "hsl(0,0%,0%)";
    obj.BkColorStr = "#428bca";//"hsl(0,0%,100%)";

    obj.ItemAry = [];
    obj.ItemAryAdd = function (ary) {

        for (var i = 0; i < ary.length; i++) {
            this.ItemAdd(ary[i]);
        }
        return this.ItemAry;
    }
    obj.ItemAdd = function (text, tag) {
        var item_obj = {};
        item_obj.Selected = 0;
        item_obj.Hovered = 0;
        item_obj.SubMenu = null;
        item_obj.Div = null;
        item_obj.Text = text;
        if (tag)
            item_obj.Tag = tag;
        else
            item_obj.Tag = text;
        this.ItemAry.push(item_obj);
        return item_obj;
    }
    obj.ItemSubSet = function (idx,menu,alignx,aligny) {
        var item_obj = this.ItemAry[idx];
        item_obj.SubMenu = menu;
        item_obj.SubMenuOn = 0;
		item_obj.SubMenuX = alignx;
		item_obj.SubMenuY = aligny;
		menu.MenuAlign = 1;
        //item_obj.Div.appendChild(menu.WrapDiv);
    }

    
    obj.TextCssUpd = function (item_obj) {
        //item_obj.Div.children[0].style.cssText = this.TextCssGet(item_obj);
        item_obj.Div.style.cssText = this.ItemCssGet(item_obj);
    }
    obj.SubShow = function (item_obj, on_off) {
        if (!item_obj.SubMenu)
            return;
        //item_obj.Div.children[0].style.cssText = this.TextCssGet(item_obj);
        item_obj.SubMenuOn = on_off;
        if (on_off) {
			var offsets = item_obj.Div.getBoundingClientRect();
			var top = offsets.top;
			var left = offsets.left;
			switch(item_obj.SubMenuX){
                case 0:
					item_obj.SubMenu.WrapDiv.style.left = "0px";//sprintf("px", this.WrapDiv.offsetWidth);
                    break;
                case 1:
					item_obj.SubMenu.WrapDiv.style.left = sprintf("%spx", offsets.left);;
					break;
				case 2:
					item_obj.SubMenu.WrapDiv.style.left = sprintf("%spx", offsets.left+item_obj.Div.offsetWidth);
                    break;
            }
			switch(item_obj.SubMenuY){
                case 0:
					item_obj.SubMenu.WrapDiv.style.top = "0px";//sprintf("px", this.WrapDiv.offsetWidth);
                    break;
                case 1:
					item_obj.SubMenu.WrapDiv.style.top = sprintf("%spx", offsets.top);;
					break;
				case 2:
					item_obj.SubMenu.WrapDiv.style.top = sprintf("%spx", offsets.top+item_obj.Div.offsetHeight);
                    break;
            }
            
        }
        else {
            item_obj.SubMenu.WrapDiv.style.left = "-9999px";
            item_obj.SubMenu.WrapDiv.style.top = "-9999px";
        }
    }

    obj.MsOnEvt = function (item_obj,dir) {
        if (dir) {
            item_obj.Hovered = 1;
            //obj.SubShow(item_obj, 1);//Menuitem_obj.SubMenu.WrapDiv.style.display = "block";
        }
        else {
            item_obj.Hovered = 0;
            //this.SubShow(item_obj, 0);
        }
        this.TextCssUpd(item_obj);
    }
    obj.MsOnSet = function (item_obj) {

        item_obj.Div.addEventListener("mouseenter",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                obj.MsOnEvt(item_obj,1);
            }
            return hnd;
        })(), false);
        item_obj.Div.addEventListener("mouseleave",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                obj.MsOnEvt(item_obj, 0);
            }
            return hnd;
        })(), false);
    }
    obj.SelectType = 0;
    obj.SelectedAry = [];
    obj.SelectMsDn = function (item_obj) {
        switch (this.SelectType) {
            case 0:
                return;
            case 1:
                if (this.SelectedAry.length > 0) {
                    if (this.SelectedAry[0] == item_obj)
                        return;
                    this.SelectedAry[0].Selected = 0;
                    this.TextCssUpd(this.SelectedAry[0]);
                    this.SelectedAry[0] = item_obj;
                }
                else
                    this.SelectedAry.push(item_obj);
                this.SelectedAry[0].Selected = 1;
                this.TextCssUpd(this.SelectedAry[0]);
                break;
            case 2:
        }
    }
    obj.MsDnCb = null;
    obj.MsDnEvt = function (item_obj) {
        if (this.MsDnCb) {
            //var this_obj=this.MsDnCb.CbObj;
            this.MsDnCb.CbFun(this.MsDnCb.CbObj, this.MsDnCb.CbTag, item_obj.Tag);
        }
        else{ 
            this.SelectMsDn(item_obj);

            if (item_obj.SubMenuOn) 
                this.SubShow(item_obj, 0);
            else
                this.SubShow(item_obj, 1);
        }
    }
    obj.MsDnSet = function (item_obj) {
        item_obj.Div.addEventListener("mousedown",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                obj.MsDnEvt(item_obj);
            }
            return hnd;
        })(), false);
    }
    

    obj.WrapCssGet = function () {
        var ary = [];
        //ary.push("list-style: none");
        ary.push("box-sizing: border-box");
        ary.push("display: block");
        if (this.MenuAlign) {
            ary.push("position: fixed");
            ary.push("top: -9999px");
            ary.push("left: -9999px");
        }
        else {
			//ary.push("position: relative");
            if (this.WidthEven) {
                ary.push("width: 100%");
                ary.push("display: table");
            };
        }
        ary.push("margin: 0px");
        ary.push("border: 0px solid red");
        //ary.push("border-radius: 6px 6px 6px 6px"); 
        ary.push("padding: 0px");
        //ary.push("overflow: hidden");

        //ary.push(sprintf("background-color: %s",this.BkColorStr));
        //ary.push(sprintf("height: %spx", h));
        return ary.join(";");
    }

    obj.ItemCssGet = function (item_obj) {
        var ary = [];

        ary.push("box-sizing: border-box");
        //ary.push("position: relative");
        if (this.DirX) {
                     //if (this.WidthEven)
            if (this.WidthEven) {
                ary.push("display: table-cell");
                ary.push(sprintf("width: %s%", 100 / this.ItemAry.length));
            }
            else
				//ary.push("float: left");//inline will make height/width may like 13.223
                ary.push("display: inline-block");//inline will make height/width may like 13.223
        }
        ary.push(sprintf("margin: %s", this.ItemMarginStr));
        ary.push(sprintf("padding: %s", this.ItemPaddingStr));
        ary.push("vertical-align: middle");
        ary.push("text-align: left");

        var fc = this.ItemColorStr;
        var bc = this.ItemBkColorStr;
        if (item_obj.Selected) {
            fc = this.ItemBkColorStr;
            bc = this.ItemColorStr;
        }
        var bdc = bc;
        if (item_obj.Hovered)
            bdc = fc;
        ary.push(sprintf("border: %spx %s %s", this.ItemBdNum, this.ItemBdType, bdc));
        ary.push(sprintf("color: %s", fc));
        ary.push(sprintf("background-color: %s", bc));

        return ary.join(";");
        //if (this.WidthEven)
        //    ary.push(sprintf("width: %s%", 100 / this.ItemAry.length));
    };

    obj.DivMake = function () {
        var div;
        div=document.createElement('div');
        div.style.cssText = this.WrapCssGet();
        this.WrapDiv = div;

        for (var i = 0; i < this.ItemAry.length; i++) {
            var item_obj = this.ItemAry[i];
            div = document.createElement('div');
            this.WrapDiv.appendChild(div);
            item_obj.Div = div;
            div.style.cssText = this.ItemCssGet(item_obj);
            div.innerHTML  = item_obj.Text;
            this.MsOnSet(item_obj);
            this.MsDnSet(item_obj);
            if (!item_obj.SubMenu)
                continue;
            item_obj.SubMenu.DivMake();
            item_obj.Div.appendChild( item_obj.SubMenu.WrapDiv);
        }
        return this.WrapDiv;
    }


    return obj;
}
DwxUiMenu.DemoLoad = function () {
    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf";
    document.body.appendChild(div);

    var menu = DwxUiMenu.ObjInit();
    menu.SelectType = 1;
    menu.DirX = 1;
    menu.ItemAryAdd(["1fads", "1sfdgsd", "1sdfgsdfgsd"]);


    var sub1 = DwxUiMenu.ObjInit();
    sub1.DirX = 0;
    sub1.ItemAryAdd(["1-1fads","1-2sfdgsd","1-3sdfgsdfgsd","1-4sdfgsdfgsd"]);
    //sub1.DivMake();
    menu.ItemSubSet(0, sub1, 1, 2);

    var sub2 = DwxUiMenu.ObjInit();
    sub2.DirX = 0;
    sub2.ItemAryAdd(["2-1fads","2-2sfdgsd","2-3sdfgsdfgsd"]);
    sub2.DivMake();
    var sub3 = DwxUiMenu.ObjInit();
    sub3.DirX = 0;
    sub3.ItemAryAdd(["2-1fads", "2-2sfdgsd", "2-3sdfgsdfgsd"]);
    sub3.DivMake();

    menu.DivMake();
    document.body.appendChild(menu.WrapDiv);


    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf";
    document.body.appendChild(div);

  
}