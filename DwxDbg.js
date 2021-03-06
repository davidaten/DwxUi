DwxDbg = {};

DwxDbg.Put = function (cb_obj, cb_tag) {
    var cs_obj = cb_obj.CursorAry[cb_tag];
	cs_obj.MidOff0 = cs_obj.MidOff;
}

DwxUiSlider.DragMoveCbFun = function (cb_obj, cb_tag, stage) {
    var cs_obj = cb_obj.CursorAry[cb_tag];
    var drag_obj = cs_obj.Drager;
    var res;
    switch (stage) {
        case 0:
            drag_obj.CsOnAry[0] = 1;
            drag_obj.CsOnAry[1] = 0;			
			if (cb_obj.CursorDrag0User != null)
				res = cb_obj.CursorDrag0User.CbFun(cb_obj.CursorDrag0User.CbObj, cb_obj.CursorDrag0User.CbTag, cs_obj.CursorIdx, cs_obj.MidOff, drag_obj.CsChgAry[0]);
			else
				res = cb_obj.CursorDrag0Def(cs_obj, drag_obj.CsChgAry[0]);
			if (res==0)
				drag_obj.CsOnAry[0] = 0;
            break;
        case 1:
            cs_obj.MidOff = cs_obj.MidOff0 + drag_obj.CsChgAry[0];
			if (cb_obj.CursorDrag1User != null)
				res = cb_obj.CursorDrag1User.CbFun(cb_obj.CursorDrag1User.CbObj, cb_obj.CursorDrag1User.CbTag, cs_obj.CursorIdx, cs_obj.MidOff, drag_obj.CsChgAry[0]);
			else
				res = cb_obj.CursorDrag1Def(cs_obj, drag_obj.CsChgAry[0]);
            break;
    }
    //console.log(sprintf("cursormov: xoff0=%s, xoff1=%s,chg=%s", obj.DragOff, xoff, xchg));
}
DwxUiSlider.DivWalk = function (cb_obj, cb_tag, node) {
    var name = node.getAttribute("DwxUiSlider");
    if (!name)
        return;
    var ary = name.split("-");
    var idx = Str2Int(ary[1]);
    switch (ary[0]) {
        case "track":
            cb_obj.TrackAry[idx].Div = node;
            break;
        case "segment":
            cb_obj.SegmentAry[idx].Div = node;
            break;
        case "cursor":
            var cs_obj = cb_obj.CursorAry[idx];
            cs_obj.Div = node;
            var drag_obj = DwxUiDrager.ObjInit(node);
            drag_obj.CbStart=CallbackSet(DwxUiSlider.DragStartCbFun, cb_obj, idx);			
            drag_obj.CbMove=CallbackSet(DwxUiSlider.DragMoveCbFun, cb_obj, idx);
            drag_obj.MsDnSet(node);			
            cs_obj.Drager = drag_obj;
            break;
    }
    node.Att4DwxUiSliderObj = cb_obj;
}

//Event for clicking on track/segments
DwxUiSlider.TkSegMsDn = function (evt) {

    var obj = evt.target.Att4DwxUiSliderObj;
	var box = evt.target.getBoundingClientRect();
	var xoff = obj.TrackAry[0].HeadOff + Math.round(evt.clientX - box.left);

	//Call before changing
	var res;
	if (obj.TrackClick0User != null)
	    res = obj.TrackClick1User.CbFun(obj.TrackClick1User.CbObj, obj.TrackClick1User.CbTag, xoff);
	else
		res = obj.TrackClick0Def(xoff);
	if (res == 0)
		return;

	if (obj.TrackClick1User != null)
	    obj.TrackClick1User.CbFun(obj.TrackClick1User.CbObj, obj.TrackClick1User.CbTag, xoff);
	else
		obj.TrackClick1Def(xoff);

	console.log("trackclick");
}

DwxUiSlider.ObjInit = function () {
	var obj = {};
    //obj.WrapId = id;
	obj.Type = "Slider";
	obj.WrapWidth = 0;
	obj.WrapHeight = 0;
	obj.WrapDiv = null;
	obj.DragOn = 0;
	obj.LineAry = [];
	obj.Add = function (type, level, txt) {
	    var line_obj = {};
	    line_obj.txt = txt;		
		if (type)
			line_obj.Type = type;
		else
			line_obj.Type = 1;
			
        line_obj.Class = class;		
		tk_obj.HeadOff = 0;
		tk_obj.Width = w;
		tk_obj.Height = h;
		tk_obj.CssTxt = css;
		tk_obj.Div = null;
		if (this.WrapWidth < w)
		    this.WrapWidth = w;
		this.TrackAry.push(tk_obj);
	}
	obj.ValueOffSet = function (valmin, valmax, offmax) {
	    this.ValueMin = valmin;
	    this.ValueMax = valmax;
	    this.OffMax = offmax;
	}
	obj.ValueToOff = function(val){
        
	    return (val - this.ValueMin) / (this.ValueMax - this.ValueMin) * this.OffMax;
	}
	obj.ValueFromOff = function (off) {

	    var value = (off / this.OffMax) * (this.ValueMax - this.ValueMin) + this.ValueMin;
	    if (this.ValueFloat)
	        return value;
        return Math.round (value);
	}
	//Default check right at the track click
	obj.TrackClick0Def = function (off) {

		return 1;
	}
	//User defined callback: fun(obj, off(current clicked offset)); 
	obj.TrackClick0User = null;
	//Default respose after the track click
	obj.TrackClick1Def = function (off) {

		for (var i = 0; i < obj.CursorAry.length; i++) {
			this.CursorPos(i, off);
		}
		if (this.SegmentAry.length > 0)
			this.SegmentPos(0, 0, off);
	}
	//User defined callback: fun(obj, off(current clicked offset)); 
	obj.TrackClick1User = null;

	obj.SegmentAry = [];
	obj.SegmentAdd = function (tk_idx,css) {
	    var seg_obj = {};
	    seg_obj.Type = "Segment";
		seg_obj.TrackIdx = tk_idx;
		seg_obj.CssTxt = css;
		seg_obj.Div = null;
		this.SegmentAry.push(seg_obj);
	}
	obj.SegmentPos = function (seg_idx, off, w) {
		var seg_obj = this.SegmentAry[seg_idx];
		seg_obj.HeadOff = off;
		seg_obj.Width = w;
		if ( seg_obj.Div != null) {
			seg_obj.Div.style.left = seg_obj.HeadOff + "px";
			seg_obj.Div.style.width = seg_obj.Width + "px";
		}
	}

	obj.CursorAry = [];
	obj.CursorAdd = function (tk_idx, w, h, css) {
	    var cs_obj = {};
	    cs_obj.Type = "Cursor";
		cs_obj.TrackIdx = tk_idx;
		cs_obj.CursorIdx = this.CursorAry.length;
		cs_obj.Width = w;
		cs_obj.Height = h;
		cs_obj.CssTxt = css;
		cs_obj.Div = null;
		this.CursorAry.push(cs_obj);

		this.CursorSet(cs_obj.CursorIdx, 1, 0);
	}
	//User set other settings: min/max, vertical position.
	obj.CursorSet = function (cs_idx, vpos, voff) {

		var cs_obj = this.CursorAry[cs_idx];
		var tk_obj = this.TrackAry[cs_obj.TrackIdx];
		cs_obj.Min = 0;
		cs_obj.Max = tk_obj.Width;

		var h;
		switch (vpos) {
			case 0:
			    cs_obj.Top = -cs_obj.Height + voff;
			    h = tk_obj.Height + cs_obj.Height;
                //tk_obj.
				break;
			case 1:
			    cs_obj.Top = (tk_obj.Height - cs_obj.Height) / 2 + voff;
			    h = tk_obj.Height;
				break;
			case 2:
			    cs_obj.Top = tk_obj.Height + voff;
			    h = tk_obj.Height + cs_obj.Height;
				break;
			default:
			    cs_obj.Top = voff;
			    h = Math.max(tk_obj.Height - cs_obj.Height);
				break;
		};
		if (this.WrapHeight < h)
		    this.WrapHeight = h;

	}
	//User set cursor position
	obj.CursorPos = function (cs_idx, off) {
		var cs_obj = this.CursorAry[cs_idx];
		cs_obj.MidOff = off;
		cs_obj.HeadOff = cs_obj.MidOff - (cs_obj.Width / 2);
		if (cs_obj.Div != null){
			cs_obj.Div.style.left = cs_obj.HeadOff +"px";
		}
	}
	//Default check before the cursor changing
	obj.CursorDrag0Def = function (cs_obj, xchg) {

		var tmp = cs_obj.MidOff0 + xchg;
		if (tmp < cs_obj.Min)
			return 0;
		if (tmp > cs_obj.Max)
			return 0;
        
		return tmp;
	}
	//User defined callback: fun(obj, cs_idx, off(current value), chg(adjustment)); 
	obj.CursorDrag0User = null;
	//Default adjustment after the cursor changing
	obj.CursorDrag1Def = function (cs_obj, xchg) {

		for (var i=0; i<this.CursorAry.length; i++){
			if (i==cs_obj.CursorIdx)
				continue;
			//this.CursorPos(i,cs_obj.MidOff);
		}
		if (this.SegmentAry.length > 0)
			this.SegmentPos(0, 0, cs_obj.MidOff);
	}
	//User defined callback: fun(obj, cs_idx, off(current value), chg(adjustment)); 
	obj.CursorDrag1User = null;
	//Buildthe div
	obj.DivMake = function () {

		this.WrapDiv = document.createElement('div');
		this.WrapDiv.style.cssText = "margin: 0px; padding: 0px; border: 0px solid red; box-sizing: content-box; position: relative;" +
		    sprintf(" width: %spx; height: %spx; ", this.WrapWidth, this.WrapHeight);
		this.WrapDiv.Att4DwxUiSliderObj = this;
		var ary=[];
		var css,txt;
		for (var i = 0; i < this.TrackAry.length; i++) {
			var tk_obj = this.TrackAry[i];
			var css = "margin: 0px; padding: 0px; box-sizing: border-box;" +
			sprintf(" width: %spx; height: %spx; ", tk_obj.Width, tk_obj.Height) + tk_obj.CssTxt;
			txt = sprintf('<div style="%s" DwxUiSlider="track-%s" onmousedown="DwxUiSlider.TkSegMsDn(event,%s,%s);"></div>',
                css, i, 0, i);
			ary.push(txt);
			for (var j = 0; j < this.SegmentAry.length; j++) {
				if (this.SegmentAry[j].TrackIdx != i)
					break;
				var seg_obj = this.SegmentAry[j];
				var css = "margin: 0px; padding: 0px; box-sizing: border-box; position: absolute; " +
				sprintf(" top: %spx; height: %spx; ", 0, tk_obj.Height) +
				sprintf(" left: %spx; width: %spx; ", seg_obj.HeadOff, seg_obj.Width) + seg_obj.CssTxt;
				txt = sprintf('<div style="%s" DwxUiSlider="segment-%s" onmousedown="DwxUiSlider.TkSegMsDn(event,%s,%s);"></div>',
                    css, j, 1, j);
				ary.push(txt);
			}
			for (var j = 0; j < this.CursorAry.length; j++) {
				if (this.CursorAry[j].TrackIdx != i)
					break;
				var cs_obj = this.CursorAry[j];
				var css = "margin: 0px; padding: 0px; box-sizing: border-box; position: absolute;" +
					sprintf(" width: %spx; height: %spx;", cs_obj.Width, cs_obj.Height) +
					sprintf(" left: %spx; top: %spx; ", cs_obj.HeadOff, cs_obj.Top) + cs_obj.CssTxt;
				txt = sprintf('<div style="%s" DwxUiSlider="cursor-%s"></div>', css, j, 2, j);
					
				ary.push(txt);
			}
			this.WrapDiv.innerHTML = ary.join("");
		}

		//obj.WrapDiv.innerHTML = txt;
		this.WrapDiv.Att4DwxUiSliderObj = this;
		var cb_obj = CallbackSet(DwxUiSlider.DivWalk, this, 0);
		ElementWalk(this.WrapDiv, cb_obj);
		return obj.WrapDiv;
	}
	return obj;
}
DwxUiSlider.DemoLoad = function () {
/*
    <h1>asdfafaf1</h1>  
    <div id="div1">
    </div>
    </script>
    <h1>asdfafaf2</h1>
    <div id="div2">
    </div>
    <h1>asdfafaf3</h1>
    <div id="div3">
    </div>
    <h1>asdfafaf4</h1>
    <div style="background-color: #2B353E; height: 20px; padding: 8px;">
        <div id="div4">
        </div>
    </div>
    <h1>asdfafaf5</h1>
    <div id="div5">
    </div>
    <h1>asdfafaf6</h1>
    <div id="div6">
    </div>
    <h1>asdfafaf7</h1>
    <div id="div7">
    </div>
    <h1>asdfafaf8</h1>
    <div id="div8">
    </div>
	*/
	var obj, div;
	obj = DwxUiSlider.ObjInit();
	obj.TrackAdd(384, 16, DwxUiSlider.CssExp.PlainWhite);
	obj.CursorAdd(0, 16, 16, DwxUiSlider.CssExp.Cur1);
	obj.CursorPos(0, 124);
	obj.DivMake();
	obj.WrapDiv.id = "div1";
	ElementReplace(obj.WrapDiv);
	
	obj = DwxUiSlider.ObjInit();
	obj.TrackAdd(384, 10, DwxUiSlider.CssExp.PlainInset);
	obj.CursorAdd(0, 20, 20, DwxUiSlider.CssExp.Cur2);
	obj.CursorPos(0, 124);
	obj.DivMake();
	obj.WrapDiv.id = "div2";
	ElementReplace(obj.WrapDiv);

	
	obj = DwxUiSlider.ObjInit();
	obj.TrackAdd(384, 16, DwxUiSlider.CssExp.PlainBlue);
	obj.CursorAdd(0, 16, 32, DwxUiSlider.CssExp.Cur3);
	obj.CursorPos(0, 124);
	obj.DivMake();
	obj.WrapDiv.id = "div3";
	ElementReplace(obj.WrapDiv);

	obj = DwxUiSlider.ObjInit();
	obj.TrackAdd(384, 2, DwxUiSlider.CssExp.DarkBlue);
	obj.CursorAdd(0, 14, 14, DwxUiSlider.CssExp.Cur4);
	obj.CursorPos(0, 124);
	obj.DivMake();
	obj.WrapDiv.id = "div4";
	ElementReplace(obj.WrapDiv);

	obj = DwxUiSlider.ObjInit();
	obj.TrackAdd(384, 4, DwxUiSlider.CssExp.iOSBlue);
	obj.CursorAdd(0, 20, 20, DwxUiSlider.CssExp.Cur5);
	obj.CursorPos(0, 124);
	obj.DivMake();
	obj.WrapDiv.id = "div5";
	ElementReplace(obj.WrapDiv);

	obj = DwxUiSlider.ObjInit();
	obj.TrackAdd(384, 12, DwxUiSlider.CssExp.bstBlue);
	obj.SegmentAdd(0, DwxUiSlider.CssExp.bstBlueV);
	obj.CursorAdd(0, 78, 33, DwxUiSlider.CssExp.bstBlue1);
	obj.SegmentPos(0, 0, 124);
	obj.CursorPos(0, 124); 
	obj.DivMake();
	obj.WrapDiv.id = "div6";
	ElementReplace(obj.WrapDiv);

	obj = DwxUiSlider.ObjInit();
	obj.TrackAdd(384, 20, DwxUiSlider.CssExp.jqGreenR);
	obj.SegmentAdd(0, DwxUiSlider.CssExp.jqGreen);
	obj.CursorAdd(0, 42, 42, DwxUiSlider.CssExp.jqGreen1);
	obj.CursorAdd(0, 18, 18, DwxUiSlider.CssExp.jqGreen2);
	obj.SegmentPos(0, 0, 124);
	obj.CursorPos(0, 124);
	obj.CursorPos(1, 124);
	obj.DivMake();
	obj.WrapDiv.id = "div7";
	ElementReplace(obj.WrapDiv);
    // 18x18, linear-gradient(rgba(0, 0, 0, 0.13), rgba(255, 255, 255, 0))

	obj = DwxUiSlider.ObjInit();
	obj.TrackAdd(500, 12, DwxUiSlider.CssExp.HuePick);
	obj.CursorAdd(0, 40, 40, DwxUiSlider.CssExp.TriangleCur);
	obj.CursorSet(0, 2, 0);
	//obj.CursorAdd(0, 14, 20, DwxUiSlider.CssExp.HueCur);
	obj.CursorPos(0, 124);
	obj.DivMake();
	obj.WrapDiv.id = "div8";
	ElementReplace(obj.WrapDiv);

}