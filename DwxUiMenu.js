
DwxUiMenu = function () {
    DwxUiDiv.call(this);

    this.FontSize = 16;
    this.ItemColorStr = "hsl(0,0%,100%)";
    this.ItemBkColorStr = "#428bca";//"hsl(0,0%,100%)";
    this.ItemMarginStr = "0px";
    this.ItemPaddingStr = "5px 10px";
    this.ItemBdNum = 1;
    this.ItemBdType = "solid";

    this.MenuAlign = 0;
    this.WidthEven = 0;

    this.ColorStr = "hsl(0,0%,0%)";
    this.BkColorStr = "#428bca";//"hsl(0,0%,100%)";

    this.ItemAry = [];
    this.ItemAryAdd = function (ary) {

        for (var i = 0; i < ary.length; i++) {


            this.ItemAdd(ary[i],ary[i]);
        }
        return this.ItemAry;
    }
    this.ItemAdd = function (tag, text) {
        var item_obj = {};
        item_obj.Selected = 0;
        item_obj.Hovered = 0;
        item_obj.SubMenu = null;
        item_obj.Div = null;
        if (tag)
            item_obj.Tag = tag;
        else
            item_obj.Tag = this.ItemAry.length;
        var btn_obj = new DwxUiBtnPlus();
        if (text) {
            btn_obj.SecAdd("Text", text, text);
        }
        btn_obj.MsDnCb = CallbackSet(this.MsDnCbFun, this, item_obj);        item_obj.BtnObj = btn_obj;
        //item_obj.prototype.WrapDiv=btn_obj.WrapDiv;
        //item_obj.BtnObj = DwxUiBtnPlus.ObjInit();
        this.ItemAry.push(item_obj);
        return item_obj;
    }
    this.ItemSubSet = function (idx,menu,alignx,aligny) {
        var item_obj = this.ItemAry[idx];
        item_obj.SubMenu = menu;
        item_obj.SubMenuOn = 0;
		item_obj.SubMenuX = alignx;
		item_obj.SubMenuY = aligny;
		menu.MenuAlign = 1;
		menu.WrapCssSet();
        //item_obj.Div.appendChild(menu.WrapDiv);
    }

    
    this.SubShow = function (item_obj, on_off) {
        if (!item_obj.SubMenu)
            return;
        //item_obj.Div.children[0].style.cssText = this.TextCssGet(item_obj);
        item_obj.SubMenuOn = on_off;
        if (on_off) {
            //var offsets = item_obj.BtnObj.WrapDiv.getBoundingClientRect();
            var offsets = item_obj.BtnObj.WrapDiv.getBoundingClientRect();
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

    this.MsOnEvt = function (item_obj,dir) {
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
    this.MsOnSet = function (item_obj) {
        /*
        item_obj.Div.addEventListener("mouseenter",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                this.MsOnEvt(item_obj,1);
            }
            return hnd;
        })(), false);
        item_obj.Div.addEventListener("mouseleave",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                this.MsOnEvt(item_obj, 0);
            }
            return hnd;
        })(), false);
        */
    }
    this.SelectType = 0;
    this.SelectedAry = [];
    this.SelectMsDn = function (item_obj) {
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
    this.MsDnCb = null;
    this.MsDnCbFun = function (cb_obj, item_obj,sec_obj) {

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
  
    this.WrapCssSet = function () {
        //ary.push("list-style: none");
        this.CssAttSet("box-sizing", "border-box");
        this.CssAttSet("display", "block");
        if (this.MenuAlign) {
            this.CssAttSet("position", "fixed");
            this.CssAttSet("top", "-9999px");
            this.CssAttSet("left", "-9999px");
        }
        else {
			//this.CssAttSet("position", "relative");
            if (this.WidthEven) {
                this.CssAttSet("width", "100%");
                this.CssAttSet("display", "table");
            };
        }
        this.CssAttSet("margin", "0px");
        this.CssAttSet("border", "0px solid red");
        //this.CssAttSet("border-radius", "6px 6px 6px 6px"); 
        this.CssAttSet("padding", "0px");
        //this.CssAttSet("overflow", "hidden");

        //this.CssAttSet(sprintf("background-color", "%s",this.BkColorStr));
        //this.CssAttSet(sprintf("height", "%spx", h));
    }
    this.WrapCssSet();

    this.TextCssUpd = function (item_obj) {

        var btn = item_obj.BtnObj;
        //item_obj.Div.children[0].style.cssText = this.TextCssGet(item_obj);

        btn.CssAttSet("box-sizing", "border-box");
        //btn.CssAttSet("position", "relative");
        if (this.DirX) {
                     //if (this.WidthEven)
            if (this.WidthEven) {
                btn.CssAttSet("display", "table-cell");
                btn.CssAttSet("width", sprintf("%s%", 100 / this.ItemAry.length));
            }
            else
                //btn.CssAttSet("float", "left");//inline will make height/width may like 13.223
                btn.CssAttSet("display", "inline-block");//inline will make height/width may like 13.223
        }
        btn.CssAttSet("margin", sprintf("%s", this.ItemMarginStr));
        btn.CssAttSet("padding", sprintf("%s", this.ItemPaddingStr));
        btn.CssAttSet("vertical-align", "middle");
        btn.CssAttSet("text-align", "left");

        var fc = this.ItemColorStr;
        var bc = this.ItemBkColorStr;
        if (item_obj.Selected) {
            fc = this.ItemBkColorStr;
            bc = this.ItemColorStr;
        }
        var bdc = bc;
        if (item_obj.Hovered)
            bdc = fc;
        btn.CssAttSet("border", sprintf("%spx %s %s", this.ItemBdNum, this.ItemBdType, bdc));
        btn.CssAttSet("color", sprintf("%s", fc));
        btn.CssAttSet("background-color", sprintf("%s", bc));

        //item_obj.BtnObj.CssAttSet("display", "block");
        btn.WrapDiv.style.cssText = btn.CssStrGet();
    }
    this.DivMake = function () {
        var div;
        div=document.createElement('div');
        div.style.cssText = this.CssStrGet();
        this.WrapDiv = div;

        for (var i = 0; i < this.ItemAry.length; i++) {
            var item_obj = this.ItemAry[i];
            item_obj.BtnObj.DivMake();
            this.WrapDiv.appendChild(item_obj.BtnObj.WrapDiv);
            this.TextCssUpd(item_obj);
            this.MsOnSet(item_obj);
            if (!item_obj.SubMenu)
                continue;
            item_obj.SubMenu.DivMake();
            item_obj.BtnObj.WrapDiv.appendChild( item_obj.SubMenu.WrapDiv);
        }
        return this.WrapDiv;
    }
}
DwxUiMenu.DemoLoad = function () {
    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf";
    document.body.appendChild(div);

    var menu = new DwxUiMenu();
    menu.SelectType = 1;
    menu.DirX = 1;
    menu.ItemAryAdd(["1fads", "1sfdgsd", "1sdfgsdfgsd"]);


    var sub1 = new DwxUiMenu();
    sub1.DirX = 0;
    sub1.ItemAryAdd(["1-1fads","1-2sfdgsd","1-3sdfgsdfgsd","1-4sdfgsdfgsd"]);
    //sub1.DivMake();
    menu.ItemSubSet(0, sub1, 1, 2);

    var sub2 = new DwxUiMenu();
    sub2.DirX = 0;
    sub2.ItemAryAdd(["2-1fads","2-2sfdgsd","2-3sdfgsdfgsd"]);
    sub2.DivMake();
    var sub3 = new DwxUiMenu();
    sub3.DirX = 0;
    sub3.ItemAryAdd(["2-1fads", "2-2sfdgsd", "2-3sdfgsdfgsd"]);
    sub3.DivMake();

    menu.DivMake();
    document.body.appendChild(menu.WrapDiv);


    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf";
    document.body.appendChild(div);

  
}