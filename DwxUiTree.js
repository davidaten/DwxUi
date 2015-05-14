DwxUiTree= {};

DwxUiTree.ObjInit = function () {
    var obj = {};

    obj.FontSize = 16;
    obj.LineHeight = 20;
    obj.ColorStr = "hsl(0,0%,100%)";
    obj.BkColorStr = "#428bca";//"hsl(0,0%,100%)";
    obj.ItemMarginStr = "0px";
    obj.ItemPaddingStr = "5px 10px";
    obj.ItemBdNum = 1;
    obj.ItemBdType = "solid";

    obj.WrapCssInit = function () {
        this.WrapCss = DwxUiCssAry();
        this.WrapCss.Add("box-sizing", "border-box");
        this.WrapCss.Add("display", "inline-block");
        this.WrapCss.Add("vertical-align", "middle");
        this.WrapCss.Add("font-size", sprintf("%spx",Int2Str(this.FontSize)));
        this.WrapCss.Add("line-height", sprintf("%spx",Int2Str(this.LineHeight)));

        var fc = this.ColorStr;
        var bc = this.BkColorStr;
        if (this.Selected) {
            fc = this.BkColorStr;
            bc = this.ColorStr;
        }
        //this.WrapCss.Add("color", fc);
        //this.WrapCss.Add("background-color", bc);

        //var bdc = bc;
        //if (this.Hovered)
        //    bdc = fc;
        //ary.push(sprintf("border: %spx %s %s", this.ItemBdNum, this.ItemBdType, bdc));
    };

    obj.SecAry = [];
    obj.SecAdd = function (type,value,tag) {
        var sec_obj = {};
        sec_obj.Type = type;
        sec_obj.Value = value;
        /*
        switch (type) {
            case "Check":
                sec_obj.Color = "hsl(127, 100%, 40%)";
                sec_obj.State = 0;
                break;
            case "Expand":
                sec_obj.Color = "hsl(4, 100%, 45%)";
                sec_obj.State = 0;
                break;
            case "Text":
                break;
            default:
        };
        */
        if (tag)
            sec_obj.Tag = tag;
        else
            sec_obj.Tag = this.SecAry.length;
        sec_obj.Hovered = 0;
        this.SecCssInit(sec_obj);
        sec_obj.Div = null;
        this.SecAry.push(sec_obj);
        return sec_obj;
    }

    obj.SecCssInit = function (sec_obj) {
        sec_obj.Css = DwxUiCssAry();

        sec_obj.Css.Add("display", "inline-block");
        sec_obj.Css.Add("box-sizing", "content-box");
        //sec_obj.Css.Add(sprintf("width", "%dpx",sec_obj.FontSize));
        sec_obj.Css.Add("margin", "0px");
        sec_obj.Css.Add("border", "0px solid black");
        //sec_obj.Css.Add("border-radius", "6px 6px 6px 6px"); 
        sec_obj.Css.Add("padding", "0px");
        sec_obj.Css.Add("vertical-align", "middle");
        sec_obj.Css.Add("text-align", "center");

    };

    obj.DivImgMake = function (sec_obj) {
        var div = document.createElement('div');
        div.innerHTML = sprintf('<img src="%s"/>',sec_obj.Value);
        //sec_obj.Css.Add("width", sprintf("%spx", Int2Str(this.FontSize)));
        div.style.cssText = sec_obj.Css.Make();

        sec_obj.Div = div;
        //sec_obj.Div.children[0].style.cssText = this.TextCssGet(sec_obj);
        return div;
    }


    obj.DivSubMake = function (sec_obj) {
        var div = document.createElement('div');
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
        sec_obj.Css.Add("width", sprintf("%spx", Int2Str(this.FontSize)));
        div.style.cssText = sec_obj.Css.Make();
        sec_obj.Div = div;
        //sec_obj.Div.children[0].style.cssText = this.TextCssGet(sec_obj);
        return div;
    }

    obj.DivCheckMake = function (sec_obj) {
        
        var div = document.createElement('div');
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
        sec_obj.Css.Add("width", sprintf("%spx", Int2Str(this.FontSize)));
        div.style.cssText = sec_obj.Css.Make();
        sec_obj.Div = div;
        //sec_obj.Div.children[0].style.cssText = this.TextCssGet(sec_obj);
        return div;
    }
    obj.DivTextMake = function (sec_obj) {

        var div = document.createElement('div');
        div.innerHTML = sec_obj.Value;
        sec_obj.Css.Fix("text-align", "left");
        div.style.cssText = sec_obj.Css.Make();;
        sec_obj.Div = div;
        //sec_obj.Div.children[0].style.cssText = this.TextCssGet(sec_obj);
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
            this.MsDnCb.CbFun(this.MsDnCb.CbObj, this.MsDnCb.CbTag, sec_obj.Tag);
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
        div=document.createElement('div');
        div.style.cssText = this.WrapCss.Make();
        this.WrapDiv = div;

        for (var i = 0; i < this.SecAry.length; i++) {
            var sec_obj = this.SecAry[i];
            this.DivSecMake(sec_obj);
        }
        return this.WrapDiv;
    }

    obj.WrapCssInit();
    return obj;
}
DwxUiTree.DemoLoad = function () {
    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf";
    document.body.appendChild(div);

    var test = DwxUiTree.ObjInit();
    test.WrapCss.Fix("display", "block");
    test.SecAdd("Img", "ftv2node.gif", 0);
    test.SecAdd("Sub", 1, 0);
    test.SecAdd("Check", 1, 1);
    test.SecAdd("Text", "Level 0", 2);
    test.DivMake();
    document.body.appendChild(test.WrapDiv);
    var test = DwxUiTree.ObjInit();
    test.WrapCss.Fix("display", "block");
    test.SecAdd("Sub", 0, 0);
    test.SecAry[0].Css.Fix("margin",sprintf("0 %spx 0 0",Int2Str(test.FontSize)));
    test.SecAdd("Check", 1, 1);
    test.SecAdd("Text", "Level 1", 2);
    test.DivMake();
    document.body.appendChild(test.WrapDiv);

    var div = document.createElement('div');
    div.innerHTML = "adsfasdfasdfaf\u4e01";
    document.body.appendChild(div);

  
}