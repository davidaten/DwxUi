DwxUiBtnPlus = {};

DwxUiBtnPlus.ObjInit = function () {
    var obj = {};
    //SecWidth for char Icon, SecWidth&SecHeight for image
    obj.SecWidth = 16;
    obj.SecHeight = 20;

    obj.prototype = {};
    obj.prototype.WrapDiv = null;
    obj.WrapCss = DwxUiCssAry();
    obj.WrapCssSet = function () {
        this.WrapCss.Set("box-sizing", "border-box");
        this.WrapCss.Set("display", "inline-block");
        this.WrapCss.Set("vertical-align", "middle");
    };
    obj.WrapCssSet();

    obj.SecAry = [];
    obj.SecCssSet = function (sec_obj) {
        sec_obj.Css.Set("display", "inline-block");
        sec_obj.Css.Set("box-sizing", "content-box");
        sec_obj.Css.Set("margin", "0px");
        sec_obj.Css.Set("border", "0px solid black");
        sec_obj.Css.Set("padding", "0px");
        sec_obj.Css.Set("vertical-align", "middle");
        sec_obj.Css.Set("text-align", "center");
    };
    obj.SecAdd = function (type, value, tag) {
        var sec_obj = {};
        sec_obj.Type = type;
        sec_obj.Value = value;
        if (tag)
            sec_obj.Tag = tag;
        else
            sec_obj.Tag = this.SecAry.length;
        sec_obj.Hovered = 0;
        sec_obj.Css = DwxUiCssAry();
        this.SecCssSet(sec_obj);
        sec_obj.Div = null;
        this.SecAry.push(sec_obj);
        return sec_obj;
    }

    obj.DivImgMake = function (sec_obj) {
        var div = document.createElement('div');
        sec_obj.Div = div;
        div.innerHTML = sprintf('<img src="%s"/>', sec_obj.Value);
        sec_obj.Css.Set("width", sprintf("%spx", Int2Str(this.SecWidth)));
        sec_obj.Css.Set("height", sprintf("%spx", Int2Str(this.SecHeight)));
        div.style.cssText = sec_obj.Css.Make();
        return div;
    }
    obj.DivSubMake = function (sec_obj) {
        var div = document.createElement('div');
        sec_obj.Div = div;
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
        sec_obj.Css.Set("width", sprintf("%spx", Int2Str(this.SecWidth)));
        div.style.cssText = sec_obj.Css.Make();
        return div;
    }
    obj.DivCheckMake = function (sec_obj) {
        var div = document.createElement('div');
        sec_obj.Div = div;
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
        sec_obj.Css.Set("width", sprintf("%spx", Int2Str(this.SecWidth)));
        div.style.cssText = sec_obj.Css.Make();
        return div;
    }
    obj.DivTextMake = function (sec_obj) {
        var div = document.createElement('div');
        sec_obj.Div = div;
        div.innerHTML = sec_obj.Value;
        sec_obj.Css.Set("text-align", "left");
        div.style.cssText = sec_obj.Css.Make();;
        return div;
    }

    obj.MsOnEvt = function (sec_obj,dir) {
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
    obj.MsOnSet = function (sec_obj) {

        sec_obj.Div.addEventListener("mouseenter",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                obj.MsOnEvt(sec_obj,1);
            }
            return hnd;
        })(), false);
        sec_obj.Div.addEventListener("mouseleave",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                obj.MsOnEvt(sec_obj, 0);
            }
            return hnd;
        })(), false);
    }
    obj.MsDnCb = null;
    obj.MsDnEvt = function (sec_obj) {
        if (this.MsDnCb) {
            //var this_obj=this.MsDnCb.CbObj;
            this.MsDnCb.CbFun(this.MsDnCb.CbObj, this.MsDnCb.CbTag, sec_obj);
        }
        else {

           
        }
    }
    obj.MsDnSet = function (sec_obj) {
        sec_obj.Div.addEventListener("mousedown",
        (function () {
            //var ver_idx = idx;
            var hnd = function () {
                obj.MsDnEvt(sec_obj);
            }
            return hnd;
        })(), false);
    }
    
    obj.DivSecMake = function (sec_obj) {
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
        this.MsOnSet(sec_obj);
        this.MsDnSet(sec_obj);
        this.WrapDiv.appendChild(sec_obj.Div);
    }
    

    obj.DivMake = function () {
        var div;
        div = document.createElement('div');
        this.WrapDiv = div;

        for (var i = 0; i < this.SecAry.length; i++) {
            var sec_obj = this.SecAry[i];
            this.DivSecMake(sec_obj);
        }

        div.style.cssText = this.WrapCss.Make();

        return this.WrapDiv;
    }

    //obj.WrapCssInit();
    return obj;
}
DwxUiBtnPlus.DemoLoad = function () {
    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf";
    document.body.appendChild(div);

    var test = DwxUiBtnPlus.ObjInit();
    test.WrapCss.Set("display", "block");
    test.SecWidth = 16;
    //test.WrapCss.Add("font-size", sprintf("%spx",Int2Str(test.SecWidth)));
    //test.WrapCss.Add("line-height", sprintf("%spx",Int2Str(this.LineHeight)));
    test.SecAdd("Img", "ftv2node.gif", 0);
    test.SecAdd("Sub", 1, 0);
    test.SecAdd("Check", 1, 1);
    test.SecAdd("Text", "Level 0", 2);
    test.DivMake();
    document.body.appendChild(test.WrapDiv);
    var test = DwxUiBtnPlus.ObjInit();
    test.WrapCss.Set("display", "block");
    test.SecAdd("Sub", 0, 0);
    test.SecAry[0].Css.Set("margin", sprintf("0 %spx 0 0", Int2Str(test.SecWidth * 2)));
    test.SecAdd("Check", 1, 1);
    test.SecAdd("Text", "Level 1", 2);
    test.DivMake();
    document.body.appendChild(test.WrapDiv);

    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf\u4e01";
    document.body.appendChild(div);

  
}