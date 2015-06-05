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

    this.SubLevel = 0;
    this.SubOnDef = 1;
    this.SubStatDef = 1;


    this.NodeAry = [];
    this.NodeAdd = function (pos, tag, text) {
        var node_obj = new DwxUiBtnPlus();
        if (pos < 0)
            pos = this.NodeAry.length;
        this.NodeAry.splice(pos, 0, node_obj);
        if (tag)
            node_obj.Tag = tag;
        else
            node_obj.Tag = this.NodeAry.length;
        if (text)
            node_obj.Text = text;
        else 
            node_obj.Text = null;
        node_obj.SubOn = this.SubOnDef;
        node_obj.SubStat = this.SubStatDef;
        node_obj.SubList = null;
        node_obj.ChkOn = this.ChkOnDef;
        node_obj.ChkStat = this.ChkStatDef; 

        node_obj.MsDnCb = CallbackSet(this.MsDnCbFun, this, node_obj);

        return node_obj;
    }
    this.NodeSubSet = function (node_idx, sub_list) {
        var node_obj = this.NodeAry[node_idx];
        sub_list.SubLevel = this.SubLevel + 1;
        node_obj.SubList = sub_list;
    }
    //Sub mark change
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
        if (node_obj.SubList) {
            //No need to rebuild the Sublist.WrapDiv
            //node_obj.SubList.DivMake();
            node_obj.SubList.Show(sub_stat);
            node_obj.WrapDiv.appendChild(node_obj.SubList.WrapDiv);
        }
        old.parentElement.replaceChild(node_obj.WrapDiv, old);
    }
    //Check mark change
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
        if (node_obj.SubList) {
            for (var i = 0; i < node_obj.SubList.NodeAry.length; i++)
                this.NodeChkChg(node_obj.SubList.NodeAry[i], chk_stat);
            node_obj.WrapDiv.appendChild(node_obj.SubList.WrapDiv);
        }
        old.parentElement.replaceChild(node_obj.WrapDiv, old);
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
                if (node_obj.SubList == 0)
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

        if (this.DirX) {
            node_obj.CssAttSet("display", "inline-block");
            node_obj.CssAttSet("margin ", sprintf("0px 0px 0px %spx",this.SubLevel*node_obj.SecWidth));
        }
        else
            node_obj.CssAttSet("display", "block");
        node_obj.SecWidth = 16;
        node_obj.SecAry = [];
        //node_obj.NodeAry.length = 0;
        if (node_obj.SubOn) {
            if (this.DirX == 0) {
                for (var i = 0; i < this.SubLevel; i++)
                    node_obj.SecAdd("Sub", 0, "sub0");
            }
            node_obj.SubPos = node_obj.SecAry.length;
            if (node_obj.SubList) {
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

        if (!node_obj.SubList)
            return;
        node_obj.SubList.PreMake();
    }
    //Must to call this to init all node_objs' SecAry
    this.PreMake = function () {
        for (var i = 0; i < this.NodeAry.length; i++) {
            this.PreNodeMake(this.NodeAry[i], 1);
        }
    }

    this.DivNodeMake = function (node_obj) {
        node_obj.DivMake();
        if (node_obj.SubList) {
            node_obj.SubList.DivMake();
            node_obj.WrapDiv.appendChild(node_obj.SubList.WrapDiv);
            if (node_obj.SubStat == 0)
                node_obj.SubList.Show(0);
        };
        this.WrapDiv.appendChild(node_obj.WrapDiv);
        /*
        for (var i = 0; i < node_obj.NodeAry.length; i++) {
            this.DivNodeMake(node_obj.NodeAry[i], node_obj.SubStat);
        }
        */
    }
    this.DivMake = function () {
        var div;
        div = document.createElement('div');
        div.style.cssText = this.CssStrGet();
        this.WrapDiv = div;

        for (var i = 0; i < this.NodeAry.length; i++) {
            this.DivNodeMake(this.NodeAry[i]);
        }
    }
}
DwxUiTree.DemoLoad = function () {
    var div = document.createElement('div');
    div.innerHTML = "DwxUiTreeDemoBegin";
    document.body.appendChild(div);


    var listA = new DwxUiTree();
    listA.DirX = 1;
    //listA.SubOnDef = 0;
    listA.NodeAdd(-1, "0-0", "Level A - 0");
    listA.NodeAdd(-1, "0-1", "Level A - 1");
    listA.NodeAdd(-1, "0-2", "Level A - 2fdskl gj sldfgjs dfgjs dfgjs dfgjs dlfgjs dlfgjsdl fgjsdlf gjsdflkgjsdflkgjsdflkgjsd lfkgjsd lfkgj sdfg");

    listA.PreMake();
    listA.DivMake();
    document.body.appendChild(listA.WrapDiv);

    var list0 = new DwxUiTree();
    list0.NodeAdd(-1, "0-0","Level 0 - 0");
    list0.NodeAdd(-1, "0-1", "Level 0 - 1");
    list0.NodeAdd(-1, "0-2", "Level 0 - 2fdskl gj sldfgjs dfgjs dfgjs dfgjs dlfgjs dlfgjsdl fgjsdlf gjsdflkgjsdflkgjsdflkgjsd lfkgjsd lfkgj sdfg")
    var list1 = new DwxUiTree();
    list1.NodeAdd(-1, "0-1-0", "Level 0 - 1 - 0");
    list1.NodeAdd(-1, "0-1-1", "Level 0 - 1 - 1");
    list0.NodeSubSet(1, list1);

    listA = new DwxUiTree();
    listA.DirX = 1;
    //listA.SubOnDef = 0;
    listA.NodeAdd(-1, "0-0-0", "Level 0 - 0 - 0");
    listA.NodeAdd(-1, "0-0-1", "Level 0 - 0 - 1");
    listA.NodeAdd(-1, "0-0-2", "Level 0 - 0 - 2fdskl gj sldfgjs dfgjs dfgjs dfgjs dlfgjs dlfgjsdl fgjsdlf gjsdflkgjsdflkgjsdflkgjsd lfkgjsd lfkgj sdfg");
    list0.NodeSubSet(0, listA);
    /*
    var menu = new DwxUiMenu();
    menu.SelectType = 1;
    menu.DirX = 1;
    menu.ItemAryAdd(["1fads", "1sfdgsd", "1sdfgsdfgsd"]);
    */
    list0.PreMake();
    list0.DivMake();
    document.body.appendChild(list0.WrapDiv);

    var div = document.createElement('div');
    div.innerHTML = "DwxUiTreeDemoEnd";
    document.body.appendChild(div);

  
}