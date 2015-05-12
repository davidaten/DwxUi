/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}


DwxUiColorPick = {};
DwxUiColorPick.DivMake = function () {
    var ary = [];
    ary.push('<table>');
    ary.push('    <tr>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; "><input type="checkbox" size="3" checked /></td>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; ">Hue:</td>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; "><div DwxUiColorPick="slider-0"></div></td>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; "><input DwxUiColorPick="input-0" type="number" size="3" value="124" /></td>');
    ary.push('    </tr>');
    ary.push('    <tr>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; "><input type="checkbox" size="3" checked /></td>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; ">Saturation:</td>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; "><div DwxUiColorPick="slider-1"></div></td>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; "><input DwxUiColorPick="input-1" type="number" size="3" value="124" /></td>');
    ary.push('    </tr>');
    ary.push('    <tr>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; "><input type="checkbox" size="3" checked /></td>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; ">Lightness:</td>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; "><div DwxUiColorPick="slider-2"></div></td>');
    ary.push('        <td style="vertical-align: top; border:1px solid black; "><input DwxUiColorPick="input-2" type="number" size="3" value="124" /></td>');
    ary.push('    </tr>');
    ary.push('</table>');
    var div = document.createElement('div');
    div.innerHTML = ary.join("");
    return div;
}
DwxUiColorPick.DivWalk = function (cb_obj, cb_tag, node) {
    /*
    console.log(node.tagName + ":" + node.innerHTML);
    switch (node.tagName) {
        case "INPUT":
            console.log(node.tagName);
            break;
        case "DIV":
            console.log(node.tagName);
            break;

    }
    */
    var name = node.getAttribute("DwxUiColorPick");
    if (!name)
        return;
    var ary = name.split("-");
    switch (ary[0]) {
        case "input":
            cb_obj.InputAry.push(node);
            break;
        case "slider":
            slider_obj = cb_obj.SliderAry[ary[1]];
            node.parentElement.replaceChild(slider_obj.WrapDiv, node);
            break;
    }
}
DwxUiColorPick.TkCssBdGet = function () {
    var ary = [" border: 1px solid #a4bed4",
    //" box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d"
    ];
    return ary.join(";");
}
DwxUiColorPick.CsCssBdGet = function () {
    var ary = ["border-style: solid"];
    ary.push(" border-width: 0px 20px 40px 20px");
    ary.push(" border-color: transparent transparent red transparent");
    return ary.join(";");
}
DwxUiColorPick.CsCssBkGet = function (hue, satur, light, alpha) {
    var txt = sprintf("hsla(%s, %s%, %s%, %s)", hue, satur, light, alpha);
    return txt;
}
DwxUiColorPick.HueTkCssBkGet = function (hue, satur, light, alpha) {
    var ary = ["linear-gradient(to right"];
    var gap = 10;
    var txt;
    for (var i = 0; i < 36; i++) {
        txt = sprintf(" hsla(%s, %s%, %s%, %s)", i * gap, satur, light, alpha);
        ary.push(txt);
    }
    txt = sprintf(" hsla(360, %s%, %s%, %s))", satur, light, alpha);
    ary.push(txt);

    return ary.join(",");
}
DwxUiColorPick.SaturTkCssBkGet = function (hue, satur, light, alpha) {
    var ary = ["linear-gradient(to right"];
    var gap = 4;
    var txt;
    for (var i = 0; i < 25; i++) {
        txt = sprintf(" hsla(%s, %s%, %s%, %s)", hue, i * gap, light, alpha);
        ary.push(txt);
    }
    txt = sprintf(" hsla(%s, 100%, %s%,%s))", hue, light, alpha);
    ary.push(txt);
    return ary.join(",");
}
DwxUiColorPick.LightTkCssBkGet = function (hue, satur, light, alpha) {
    var ary = ["linear-gradient(to right"];
    var gap = 4;
    var txt;
    for (var i = 0; i < 25; i++) {
        txt = sprintf(" hsla(%s, %s%, %s%, %s)", hue, satur, i * gap, alpha);
        ary.push(txt);
    }
    txt = sprintf(" hsla(%s, %s%, 100%, %s))", hue, satur, alpha);
    ary.push(txt);
    return ary.join(",");
}
DwxUiColorPick.SliderClick1 = function (pick_obj, slider_idx, off) {
    var tmp = pick_obj.SliderAry[slider_idx].ValueFromOff(off);
    switch(slider_idx){
        case 0:
            pick_obj.Hue = tmp;
            break;
        case 1:
            pick_obj.Satur = tmp;
            break;
        case 2:
            pick_obj.Light = tmp;
            break;
    }
    pick_obj.CsCssBkSetAll();
    pick_obj.TkCssBkSetAll(slider_idx);

    pick_obj.SliderAry[slider_idx].CursorPos(0, off);
}
DwxUiColorPick.SliderDrag1 = function (pick_obj, slider_idx, cs_idx, off, chg) {
    var tmp = pick_obj.SliderAry[slider_idx].ValueFromOff(off);
    if (tmp < 0) {
        console.log("value invalid");
    }
    switch(slider_idx){
        case 0:
            pick_obj.Hue = tmp;
            break;
        case 1:
            pick_obj.Satur = tmp;
            break;
        case 2:
            pick_obj.Light = tmp;
            break;
    }
    pick_obj.InputAry[slider_idx].value = Int2Str(tmp);
    pick_obj.CsCssBkSetAll();
    pick_obj.TkCssBkSetAll(slider_idx);
}

DwxUiColorPick.ObjInit = function (hue,satur,light,alpha){
    var obj = {};
    obj.Hue = 124;
    obj.Satur = 94;
    obj.Light = 59;
    obj.Alpha = 1;
    obj.SliderAry = [];
    obj.InputAry = [];

    obj.CsCssBkSetAll = function () {
        for (var i=0;i<this.SliderAry.length; i++){
            this.SliderAry[i].CursorAry[0].Div.style.borderBottomColor = DwxUiColorPick.CsCssBkGet(
                this.Hue, this.Satur, this.Light, this.Alpha);
        }       
    }
    obj.TkCssBkSetAll = function (slider_idx) {
        for (var i = 0; i < this.SliderAry.length; i++) {
            if (i == slider_idx)
                continue;
            switch (i) {
                case 0:
                    this.SliderAry[0].TrackAry[0].Div.style.background = DwxUiColorPick.HueTkCssBkGet(
                        this.Hue, this.Satur, this.Light, this.Alpha);
                    break;
                case 1:
                    this.SliderAry[1].TrackAry[0].Div.style.background = DwxUiColorPick.SaturTkCssBkGet(
                        this.Hue, this.Satur, this.Light, this.Alpha);
                    break;
                case 2:
                    this.SliderAry[2].TrackAry[0].Div.style.background = DwxUiColorPick.LightTkCssBkGet(
                        this.Hue, this.Satur, this.Light, this.Alpha);
                    break;
            }
        }
    }
    obj.SliderObjInit = function () {
        var tk_w = 360, tk_h = 16, cs_w = 40, cs_h = 40;

        for (var i = 0; i < 3; i++) {

            var slider_obj = DwxUiSlider.ObjInit();
            this.SliderAry.push(slider_obj);
            slider_obj.TrackAdd(tk_w, tk_h, DwxUiColorPick.TkCssBdGet());
            slider_obj.CursorAdd(0, cs_w, cs_h, DwxUiColorPick.CsCssBdGet());
            slider_obj.CursorSet(0, 2, 0);

            switch (i) {
                case 0:
                    slider_obj.ValueOffSet(0, 360, tk_w);
                    break;
                case 1:
                    slider_obj.ValueOffSet(0, 100, tk_w);
                    break;
                case 2:
                    slider_obj.ValueOffSet(0, 100, tk_w);
                    break;
            }

            slider_obj.TrackClick1User = CallbackSet(DwxUiColorPick.SliderClick1, this, i);
            slider_obj.CursorDrag1User = CallbackSet(DwxUiColorPick.SliderDrag1, this, i);
        };
    }
    obj.SliderDivMake = function () {

        for (var i = 0; i < 3; i++) {
            var slider_obj = this.SliderAry[i];
            var tmp;
            switch (i) {
                case 0:
                    tmp = slider_obj.ValueToOff(this.Hue);
                    break;
                case 1:
                    tmp = slider_obj.ValueToOff(this.Satur);
                    break;
                case 2:
                    tmp = slider_obj.ValueToOff(this.Light);
                    break;
            };
            slider_obj.CursorPos(0, tmp);
            slider_obj.DivMake();
        };
        this.CsCssBkSetAll();
        this.TkCssBkSetAll(4);
    }
    obj.DivMake = function () {
        this.WrapDiv = DwxUiColorPick.DivMake();
        this.SliderDivMake();
        var cb_obj = CallbackSet(DwxUiColorPick.DivWalk, this, 0);
        ElementWalk(this.WrapDiv, cb_obj);
    }

    obj.SliderObjInit();

    return obj;
    /*
    obj.SliderDivShow = function (id_ary) {
        for (var i = 0; i < 3; i++) {
            var slider_obj = this.SliderAry[i];
            slider_obj.Div.id = id_ary[i];
            ElementReplace(slider_obj.Div.id);
        }
    }
    obj = DwxUiSlider.ObjInit("DwxUiColorPickS");
    DwxUiColorPick.SliderAry.push(obj);
    obj.ValueOffSet(0, 100, 360);
    obj.TrackAdd(360, 16, DwxUiColorPick.TkCssBdGet());
    obj.CursorAdd(0, 40, 40, DwxUiColorPick.CsCssBdGet());
    obj.CursorSet(0, 2, 0);
    obj.CursorPos(0, obj.ValueToOff(DwxUiColorPick.Satur));
    div = obj.DivMake();

    ElementReplace(div);

    obj = DwxUiSlider.ObjInit("DwxUiColorPickL");
    DwxUiColorPick.SliderAry.push(obj);
    obj.ValueOffSet(0, 100, 360);
    obj.TrackAdd(360, 16, DwxUiColorPick.TkCssBdGet());
    obj.CursorAdd(0, 40, 40, DwxUiColorPick.CsCssBdGet());
    obj.CursorSet(0, 2, 0);
    obj.CursorPos(0, obj.ValueToOff(DwxUiColorPick.Light));
    div = obj.DivMake();
    obj.TrackAry[0].Div.style.background = DwxUiColorPick.LightTkCssBkGet(
        DwxUiColorPick.Hue, DwxUiColorPick.Satur, DwxUiColorPick.Light, DwxUiColorPick.Alpha);
    obj.CursorAry[0].Div.style.borderBottomColor = DwxUiColorPick.CsCssBkGet(
        DwxUiColorPick.Hue, DwxUiColorPick.Satur, DwxUiColorPick.Light, DwxUiColorPick.Alpha);
    obj.TrackClick1User = DwxUiColorPick.LightClick1;
    obj.CursorDrag1User = DwxUiColorPick.LightDrag1;
    ElementReplace(div);
    */
};
