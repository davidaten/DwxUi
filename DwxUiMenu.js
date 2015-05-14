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
            var btn_obj=DwxUiBtnPlus.ObjInit();
            btn_obj.SecAdd("Text", ary[i], ary[i]);
            this.ItemAdd(btn_obj,ary[i]);
        }
        return this.ItemAry;
    }
    obj.ItemAdd = function (btn_obj, tag) {
        var item_obj = {};
        item_obj.Selected = 0;
        item_obj.Hovered = 0;
        item_obj.SubMenu = null;
        item_obj.Div = null;
        if (tag)
            item_obj.Tag = tag;
        else
            item_obj.Tag = this.ItemAry.length;
        btn_obj.MsDnCb = CallbackSet(obj.MsDnCbFun, obj, item_obj);
        item_obj.BtnObj = btn_obj;
        item_obj.prototype = btn_obj.prototype;
        //item_obj.prototype.WrapDiv=btn_obj.WrapDiv;
        //item_obj.BtnObj = DwxUiBtnPlus.ObjInit();
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
		menu.WrapCssSet();
        //item_obj.Div.appendChild(menu.WrapDiv);
    }

    
    obj.SubShow = function (item_obj, on_off) {
        if (!item_obj.SubMenu)
            return;
        //item_obj.Div.children[0].style.cssText = this.TextCssGet(item_obj);
        item_obj.SubMenuOn = on_off;
        if (on_off) {
            //var offsets = item_obj.BtnObj.WrapDiv.getBoundingClientRect();
            var offsets = item_obj.WrapDiv.getBoundingClientRect();
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
					item_obj.SubMenu.WrapDiv.style.top = sprintf("%spx", offsets.top+item_obj.BtnObj.WrapDiv.offsetHeight);
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
        /*
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
        */
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
    obj.MsDnCbFun = function (cb_obj, item_obj,sec_obj) {

        if (cb_obj.MsDnCb) {
            //var obj_obj=cb_obj.MsDnCb.CbObj;
            var res = cb_obj.MsDnCb.CbFun(cb_obj.MsDnCb.CbObj, cb_obj.MsDnCb.CbTag, item_obj.Tag, sec_obj.Tag);
            if (!res) return;
        }
        cb_obj.SelectMsDn(item_obj);

        if (item_obj.SubMenuOn) 
            cb_obj.SubShow(item_obj, 0);
        else
            cb_obj.SubShow(item_obj, 1);
    }
    obj.MsDnSet = function (item_obj) {
        /*
        item_obj.Div.addEventListener("mousedown",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                obj.MsDnEvt(item_obj);
            }
            return hnd;
        })(), false);
        */
    }
    
    obj.WrapCss = DwxUiCssAry();
    obj.WrapCssSet = function () {
        //ary.push("list-style: none");
        this.WrapCss.Set("box-sizing", "border-box");
        this.WrapCss.Set("display", "block");
        if (this.MenuAlign) {
            this.WrapCss.Set("position", "fixed");
            this.WrapCss.Set("top", "-9999px");
            this.WrapCss.Set("left", "-9999px");
        }
        else {
			//this.WrapCss.Set("position", "relative");
            if (this.WidthEven) {
                this.WrapCss.Set("width", "100%");
                this.WrapCss.Set("display", "table");
            };
        }
        this.WrapCss.Set("margin", "0px");
        this.WrapCss.Set("border", "0px solid red");
        //this.WrapCss.Set("border-radius", "6px 6px 6px 6px"); 
        this.WrapCss.Set("padding", "0px");
        //this.WrapCss.Set("overflow", "hidden");

        //this.WrapCss.Set(sprintf("background-color", "%s",this.BkColorStr));
        //this.WrapCss.Set(sprintf("height", "%spx", h));
    }
    obj.WrapCssSet();

    obj.TextCssUpd = function (item_obj) {

        var css = item_obj.BtnObj.WrapCss;
        //item_obj.Div.children[0].style.cssText = this.TextCssGet(item_obj);

        css.Set("box-sizing", "border-box");
        //css.Set("position", "relative");
        if (this.DirX) {
                     //if (this.WidthEven)
            if (this.WidthEven) {
                css.Set("display", "table-cell");
                css.Set("width", sprintf("%s%", 100 / this.ItemAry.length));
            }
            else
                //css.Set("float", "left");//inline will make height/width may like 13.223
                css.Set("display", "inline-block");//inline will make height/width may like 13.223
        }
        css.Set("margin", sprintf("%s", this.ItemMarginStr));
        css.Set("padding", sprintf("%s", this.ItemPaddingStr));
        css.Set("vertical-align", "middle");
        css.Set("text-align", "left");

        var fc = this.ItemColorStr;
        var bc = this.ItemBkColorStr;
        if (item_obj.Selected) {
            fc = this.ItemBkColorStr;
            bc = this.ItemColorStr;
        }
        var bdc = bc;
        if (item_obj.Hovered)
            bdc = fc;
        css.Set("border", sprintf("%spx %s %s", this.ItemBdNum, this.ItemBdType, bdc));
        css.Set("color", sprintf("%s", fc));
        css.Set("background-color", sprintf("%s", bc));

        //item_obj.BtnObj.WrapCss.Set("display", "block");
        item_obj.BtnObj.WrapDiv.style.cssText = css.Make();
    }
    obj.DivMake = function () {
        var div;
        div=document.createElement('div');
        div.style.cssText = this.WrapCss.Make();
        this.WrapDiv = div;

        for (var i = 0; i < this.ItemAry.length; i++) {
            var item_obj = this.ItemAry[i];
            item_obj.BtnObj.DivMake();
            this.WrapDiv.appendChild(item_obj.BtnObj.WrapDiv);
            this.TextCssUpd(item_obj);
            this.MsOnSet(item_obj);
            this.MsDnSet(item_obj);
            if (!item_obj.SubMenu)
                continue;
            item_obj.SubMenu.DivMake();
            item_obj.BtnObj.WrapDiv.appendChild( item_obj.SubMenu.WrapDiv);
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