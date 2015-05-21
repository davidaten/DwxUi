
DwxUiBtnPlus = function () {
    //DwxUiBtnPlus.prototype = new DwxUiDiv();
    //obj= new DwxUiDiv();
    DwxUiDiv.call(this);
    //SecWidth for char Icon, SecWidth&SecHeight for image
    this.SecWidth = 16;
    this.SecHeight = 20;

    this.WrapCssSet = function () {
        this.CssAttSet("box-sizing", "border-box");
        this.CssAttSet("display", "inline-block");
        this.CssAttSet("vertical-align", "middle");
    };
    this.WrapCssSet();

    this.SecAry = [];
    this.SecCssSet = function (sec_obj) {
        sec_obj.CssAttSet("display", "inline-block");
        sec_obj.CssAttSet("box-sizing", "content-box");
        sec_obj.CssAttSet("margin", "0px");
        sec_obj.CssAttSet("border", "0px solid black");
        sec_obj.CssAttSet("padding", "0px");
        sec_obj.CssAttSet("vertical-align", "middle");
        sec_obj.CssAttSet("text-align", "center");
    };
    this.SecAdd = function (type, value, tag) {
        var sec_obj = new DwxUiDiv();
        sec_obj.Type = type;
        sec_obj.Value = value;
        if (tag)
            sec_obj.Tag = tag;
        else
            sec_obj.Tag = this.SecAry.length;
        sec_obj.Hovered = 0;

        this.SecCssSet(sec_obj);
        this.SecAry.push(sec_obj);
        return sec_obj;
    }

    this.DivImgMake = function (sec_obj) {
        var div = document.createElement('div');
        sec_obj.WrapDiv = div;
        div.innerHTML = sprintf('<img src="%s"/>', sec_obj.Value);
        sec_obj.CssAttSet("width", sprintf("%spx", Int2Str(this.SecWidth)));
        sec_obj.CssAttSet("height", sprintf("%spx", Int2Str(this.SecHeight)));
        div.style.cssText = sec_obj.CssStrGet();
        return div;
    }
    this.DivSubMake = function (sec_obj) {
        var div = document.createElement('div');
        sec_obj.WrapDiv = div;
        switch (sec_obj.Value) {
            case 0:
                div.innerHTML = "\u00A0";//empty
                //ary.push("color: hsl(0, 0%, 0%)");
                break;
            case 1:
                div.innerHTML = "\u25BC";//down10004
                //ary.push("color: hsl(127, 100%, 40%)");
                break;
            case 2:
                div.innerHTML = "\u25B2";//10008
                //ary.push("color: hsl(4, 100%, 45%)");
                break;
        };
        sec_obj.CssAttSet("width", sprintf("%spx", Int2Str(this.SecWidth)));
        div.style.cssText = sec_obj.CssStrGet();
        return div;
    }
    this.DivCheckMake = function (sec_obj) {
        var div = document.createElement('div');
        sec_obj.WrapDiv = div;
        switch (sec_obj.Value) {
            case 0:
                div.innerHTML = "\u2610";//box=2610
                //ary.push("color: hsl(0, 0%, 0%)");
                break;
            case 1:
                div.innerHTML = "\u2611";//boxOk=2611 //10004
                //ary.push("color: hsl(127, 100%, 40%)");
                break;
            case 2:
                div.innerHTML = "\u2612";//boxNg=2612 //10008
                //ary.push("color: hsl(4, 100%, 45%)");
                break;
        };
        sec_obj.CssAttSet("width", sprintf("%spx", Int2Str(this.SecWidth)));
        div.style.cssText = sec_obj.CssStrGet();
        return div;
    }
    this.DivTextMake = function (sec_obj) {
        var div = document.createElement('div');
        sec_obj.WrapDiv = div;
        div.innerHTML = sec_obj.Value;
        sec_obj.CssAttSet("text-align", "left");
        div.style.cssText = sec_obj.CssStrGet();;
        return div;
    }

    this.MsOnEvt = function (sec_obj,dir) {
        if (dir) {
            sec_obj.Hovered = 1;
            //obj.SubShow(sec_obj, 1);//Menuitem_obj.SubMenu.WrapDiv.style.display = "block";
        }
        else {
            sec_obj.Hovered = 0;
            //this.SubShow(sec_obj, 0);
        }
        //this.TextCssUpd(sec_obj);
    }
    this.MsOnSet = function (evt_obj, sec_obj) {

        sec_obj.WrapDiv.addEventListener("mouseenter",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                evt_obj.MsOnEvt(sec_obj,1);
            }
            return hnd;
        })(), false);
        sec_obj.WrapDiv.addEventListener("mouseleave",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                evt_obj.MsOnEvt(sec_obj, 0);
            }
            return hnd;
        })(), false);
    }
    this.MsDnCb = null;
    this.MsDnEvt = function (sec_obj) {
        if (this.MsDnCb) {
            //var this_obj=this.MsDnCb.CbObj;
            this.MsDnCb.CbFun(this.MsDnCb.CbObj, this.MsDnCb.CbTag, sec_obj);
        }
        else {

           
        }
    }
    this.MsDnSet = function (evt_obj, sec_obj) {
        sec_obj.WrapDiv.addEventListener("mousedown",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                evt_obj.MsDnEvt(sec_obj);
            }
            return hnd;
        })(), false);
    }
    
    this.DivSecMake = function (sec_obj) {
        if (sec_obj.Hidden)
            return;
        switch (sec_obj.Type) {
            case "Img":
                this.DivImgMake(sec_obj);
                break;
            case "Check":
                this.DivCheckMake(sec_obj);
                break;
            case "Sub":
                this.DivSubMake(sec_obj);
                break;
            case "Text":
                this.DivTextMake(sec_obj);
                break;
        }
        this.MsOnSet(this, sec_obj);
        this.MsDnSet(this, sec_obj);
        this.WrapDiv.appendChild(sec_obj.WrapDiv);
    }
    

    this.DivMake = function () {
        var div;
        div = document.createElement('div');
        this.WrapDiv = div;

        for (var i = 0; i < this.SecAry.length; i++) {
            var sec_obj = this.SecAry[i];
            this.DivSecMake(sec_obj);
        }

        div.style.cssText = this.CssStrGet();

        return this.WrapDiv;
    }
}
//DwxUiBtnPlus.prototype = new DwxUiDiv();
DwxUiBtnPlus.DemoLoad = function () {
    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf";
    document.body.appendChild(div);

    var test = new DwxUiBtnPlus();
    test.CssAttSet("display", "block");
    test.SecWidth = 16;
    //test.WrapCss.Add("font-size", sprintf("%spx",Int2Str(test.SecWidth)));
    //test.WrapCss.Add("line-height", sprintf("%spx",Int2Str(this.LineHeight)));
    test.SecAdd("Img", "ftv2node.gif", 0);
    test.SecAdd("Sub", 1, 0);
    test.SecAdd("Check", 1, 1);
    test.SecAdd("Text", "Level 0", 2);
    test.DivMake();
    document.body.appendChild(test.WrapDiv);
    var test = new DwxUiBtnPlus();
    test.CssAttSet("display", "block");
    test.SecAdd("Sub", 0, 0);
    test.SecAry[0].CssAttSet("margin", sprintf("0 %spx 0 0", Int2Str(test.SecWidth * 2)));
    test.SecAdd("Check", 1, 1);
    test.SecAdd("Text", "Level 1", 2);
    test.DivMake();
    document.body.appendChild(test.WrapDiv);

    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf\u4e01";
    document.body.appendChild(div);

  
}