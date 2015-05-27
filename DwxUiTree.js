DwxUiTree = function () {
    DwxUiDiv.call(this);
    this.FontSize = 16;
    this.LineHeight = 20;
    this.ColorStr = "hsl(0,0%,100%)";
    this.BkColorStr = "#428bca";//"hsl(0,0%,100%)";
    this.WrapCssSet = function () {
        //ary.push("list-style: none");
        this.CssAttSet("box-sizing", "border-box");
        this.CssAttSet("display", "block");
        this.CssAttSet("margin", "0px");
        this.CssAttSet("border", "0px solid red");
        //this.CssAttSet("border-radius", "6px 6px 6px 6px"); 
        this.CssAttSet("padding", "0px");
        this.CssAttSet("font-size", sprintf("%spx", Int2Str(this.FontSize)));
        this.CssAttSet("line-height", sprintf("%spx", Int2Str(this.LineHeight)));
        this.CssAttSet("color", sprintf("%s", this.ColorStr));
        this.CssAttSet("background-color", sprintf("%s", this.BkColorStr));
    }
    this.WrapCssSet();


    this.ChkOnDef = 1;
    this.ChkStatDef = 0;
    this.SubOnDef = 1;
    this.SubStatDef = 1;


    this.NodeAry = [];
    this.NodeAdd = function (up_obj, pos, tag, text) {
        var up_ary,up_cnt;
        if (!up_obj){
            up_cnt=0;
            up_ary=this.NodeAry;
        }
        else{
            up_cnt=up_obj.UpCnt+1;
            up_ary=up_obj.NodeAry;
        }
        node_obj = new DwxUiBtnPlus();
        node_obj.UpCnt = up_cnt;
        if (pos < 0)
            pos = up_ary.length;
        up_ary.splice(pos, 0, node_obj);
        if (tag)
            node_obj.Tag = tag;
        else
            node_obj.Tag = node_ary.length;
        if (text)
            node_obj.Text = text;
        else 
            node_obj.Text = null;
        node_obj.NodeAry = [];
        node_obj.SubOn = this.SubOnDef;
        node_obj.SubStat = this.SubStatDef;
        node_obj.ChkOn = this.ChkOnDef;
        node_obj.ChkStat = this.ChkStatDef; 

        node_obj.MsDnCb = CallbackSet(this.MsDnCbFun, this, node_obj);

        return node_obj;
    }

    this.NodeAryShowChg = function(node_ary, show_stat) {
        for (var i = 0; i < node_ary.length; i++) {
            node_ary[i].Show(show_stat);
            this.NodeAryShowChg(node_ary[i].NodeAry, show_stat);
        }
    };
    this.NodeSubChg = function (node_obj, sub_stat) {
        if (!node_obj.SubOn)
            return;
        if (node_obj.SubStat==sub_stat) 
            return;
        if (node_obj.SubStat) {
            node_obj.SubStat = 0;
            node_obj.SecAry[node_obj.SubPos].Value = 1;
        }
        else {
            node_obj.SubStat = 1;
            node_obj.SecAry[node_obj.SubPos].Value = 2;
        }
        var old=node_obj.WrapDiv;
        node_obj.DivMake();
        old.parentElement.replaceChild(node_obj.WrapDiv,old);
        this.NodeAryShowChg(node_obj.NodeAry, sub_stat);
    }
    this.NodeChkChg = function (node_obj, chk_stat) {
        if (!node_obj.ChkOn)
            return;
        if (node_obj.ChkStat == chk_stat)
            return;
        if (node_obj.ChkStat) {
            node_obj.ChkStat = 0;
            node_obj.SecAry[node_obj.ChkPos].Value = 0;
        }
        else {
            node_obj.ChkStat = 1;
            node_obj.SecAry[node_obj.ChkPos].Value = 1;
        }
        var old = node_obj.WrapDiv;
        node_obj.DivMake();
        old.parentElement.replaceChild(node_obj.WrapDiv, old);
        for (var i = 0; i < node_obj.NodeAry.length;i++)
            this.NodeChkChg(node_obj.NodeAry[i], chk_stat); 
    }


    this.NodePreMake = function (node_obj) {

        if (this.DirX==0)
            node_obj.CssAttSet("display", "block");
        else
            node_obj.CssAttSet("display", "inline-block");
        node_obj.SecWidth = 16;
        node_obj.SecAry = [];
        //node_obj.NodeAry.length = 0;
        if (node_obj.SubOn) {
            if (this.DirX == 0) {
                for (var i = 0; i < node_obj.UpCnt; i++)
                    node_obj.SecAdd("Sub", 0, "sub0");
            }
            node_obj.SubPos = node_obj.SecAry.length;
            if (node_obj.NodeAry.length > 0) {
                if (node_obj.SubStat)
                    node_obj.SecAdd("Sub", 2, "sub");
                else
                    node_obj.SecAdd("Sub", 1, "sub");
            }
            else
                node_obj.SecAdd("Sub", 0, "sub0");
        }
        if (node_obj.ChkOn) {
            node_obj.ChkPos = node_obj.SecAry.length;
            if (node_obj.ChkStat)
                node_obj.SecAdd("Check", 0, "chk");
            else
                node_obj.SecAdd("Check", 1, "chk");
        }
        node_obj.SecAdd("Text", node_obj.Text, "txt");

        for (var i = 0; i < node_obj.NodeAry.length; i++) {
            this.NodePreMake(node_obj.NodeAry[i]);
        }
    }
   
    this.MsDnCb = null;
    this.MsDnCbFun = function (cb_obj, node_obj, sec_obj) {
        if (cb_obj.MsDnCb) {
            //var obj_obj=cb_obj.MsDnCb.CbObj;
            var res = cb_obj.MsDnCb.CbFun(cb_obj.MsDnCb.CbObj, cb_obj.MsDnCb.CbTag, item_obj.Tag, sec_obj.Tag);
            if (!res) return;
        }
     

        switch (sec_obj.Tag) {
            case "sub":
                if (node_obj.NodeAry.length == 0)
                    break;
                var stat = 0;
                if (node_obj.SubStat==0 )
                    stat = 1;
                cb_obj.NodeSubChg(node_obj,stat);
                break;
            case "chk":
                var stat = 0;
                if (node_obj.ChkStat == 0)
                    stat = 1;
                cb_obj.NodeChkChg(node_obj, stat);
                break;
            case "txt":
                break;
        };
        return;
    }

   
    this.PreNodeMake = function (node_obj) {

        node_obj.CssAttSet("display", "block");
        node_obj.SecWidth = 16;
        node_obj.SecAry = [];
        //node_obj.NodeAry.length = 0;
        if (node_obj.SubOn) {
            for (var i = 0; i < node_obj.UpCnt; i++)
                node_obj.SecAdd("Sub", 0, "sub0");
            node_obj.SubPos = node_obj.SecAry.length;
            if (node_obj.NodeAry.length > 0) {
                if (node_obj.SubStat)
                    node_obj.SecAdd("Sub", 2, "sub");
                else
                    node_obj.SecAdd("Sub", 1, "sub");
            }
            else
                node_obj.SecAdd("Sub", 0, "sub0");
        }
        if (node_obj.ChkOn) {
            node_obj.ChkPos = node_obj.SecAry.length;
            if (node_obj.ChkStat)
                node_obj.SecAdd("Check", 0, "chk");
            else
                node_obj.SecAdd("Check", 1, "chk");
        }
        node_obj.SecAdd("Text", node_obj.Text, "txt");

        for (var i = 0; i < node_obj.NodeAry.length; i++) {
            this.PreNodeMake(node_obj.NodeAry[i]);
        }
    }
    //Must to call this to init all node_objs' SecAry
    this.PreMake = function () {
        for (var i = 0; i < this.NodeAry.length; i++) {
            this.PreNodeMake(this.NodeAry[i], 1);
        }
    }

    this.DivNodeMake = function (node_obj, show_on) {
        node_obj.DivMake();
        node_obj.Show(show_on);
        this.WrapDiv.appendChild(node_obj.WrapDiv);
        for (var i = 0; i < node_obj.NodeAry.length; i++) {
            this.DivNodeMake(node_obj.NodeAry[i], node_obj.SubStat);
        }
    }
    this.DivMake = function () {
        var div;
        div = document.createElement('div');
        div.style.cssText = this.CssStrGet();
        this.WrapDiv = div;

        for (var i = 0; i < this.NodeAry.length; i++) {
            this.DivNodeMake(this.NodeAry[i], 1);
        }
    }
}
DwxUiTree.DemoLoad = function () {
    var div = document.createElement('div');
    div.innerHTML = "DwxUiTreeDemoBegin";
    document.body.appendChild(div);

    var test = new DwxUiTree();
    test.NodeAdd(0, -1, "0-0","Level 0 - 0");
    test.NodeAdd(0, -1, "0-1", "Level 0 - 1");
    test.NodeAdd(0, -1, "0-2", "Level 0 - 2fdskl gj sldfgjs dfgjs dfgjs dfgjs dlfgjs dlfgjsdl fgjsdlf gjsdflkgjsdflkgjsdflkgjsd lfkgjsd lfkgj sdfg") 
    test.NodeAdd(test.NodeAry[1], -1, "0-1-0", "Level 0 - 1 - 0");
    test.NodeAdd(test.NodeAry[1], -1, "0-1-1", "Level 0 - 1 - 1");
    var menu = new DwxUiMenu();
    menu.SelectType = 1;
    menu.DirX = 1;
    menu.ItemAryAdd(["1fads", "1sfdgsd", "1sdfgsdfgsd"]);
    test.PreMake();
    test.DivMake();
    document.body.appendChild(test.WrapDiv);

    var div = document.createElement('div');
    div.innerHTML = "DwxUiTreeDemoEnd";
    document.body.appendChild(div);

  
}