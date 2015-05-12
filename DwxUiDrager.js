DwxUiDrager = {};
DwxUiDrager.DragObj = null;
//http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
//mouse and keyboard
//http://www.quirksmode.org/js/dragdrop.html
DwxUiDrager.ObjInit = function (div) {
    var drag_obj = {};
    drag_obj.DragOn=0;
    drag_obj.Div=div;	
    drag_obj.CbStart=null;		
    drag_obj.CbMove=null;	
    drag_obj.CbStop=null;		
	//Basic dragging: start(),move(),stop().
    drag_obj.Start = function (ary) {
		
        this.DragOn = 1;
		this.CsOldAry = [0,0];		
		this.CsOldAry[0] = ary[0];
		this.CsOldAry[1] = ary[1];		
		this.CsChgAry = [0,0];		
		this.CsOnAry = [0,0];				
        if (this.CbStart != null)
            this.CbStart.CbFun(this.CbStart.CbObj, this.CbStart.CbTag, 0);
			
        var gcs=getComputedStyle(this.Div);
		this.DivOldAry = [0,0];
        this.DivOldAry[0] = parseFloat(gcs.getPropertyValue("left"));
        this.DivOldAry[1] = parseFloat(gcs.getPropertyValue("top"));
        if (this.CbStart != null)
            this.CbStart.CbFun(this.CbStart.CbObj, this.CbStart.CbTag, 0);
    }
    drag_obj.Move = function (ary) {

        if (this.DragOn==0)
            return;
			
        this.CsChgAry[0] = ary[0] - this.CsOldAry[0];
        this.CsChgAry[1] = ary[1] - this.CsOldAry[1];
        this.CsOnAry[0] = 1;
        this.CsOnAry[1] = 1;
        //Call before changing
        if (this.CbMove != null)
            this.CbMove.CbFun(this.CbMove.CbObj, this.CbMove.CbTag, 0);
        //Change 
        if (this.CsOnAry[0])
            this.Div.style.left = sprintf("%spx",this.DivOldAry[0] + this.CsChgAry[0]);
        if (this.CsOnAry[1])
            this.Div.style.top = sprintf("%spx",this.DivOldAry[1] + this.CsChgAry[1]);	
        //Call after changing
		if (this.CsOnAry[0]||this.CsOnAry[1]){
			if (this.CbMove != null)
				this.CbMove.CbFun(this.CbMove.CbObj, this.CbMove.CbTag, 1);
		}
        //console.log(sprintf("cursormov: xoff0=%s, xoff1=%s,chg=%s", obj.DragOff, xoff, xchg));
    }
    drag_obj.Stop = function () {

        if (this.DragOn == 0)
            return;
        this.DragOn = 0;
        if (this.CbStop != null)
            this.CbStop.CbFun(this.CbStop.CbObj, this.CbStop.CbTag, 0);
		
    }
	//http://stackoverflow.com/questions/111102/how-do-javascript-closures-work
	//http://stackoverflow.com/questions/19774202/how-to-removeeventlistener-that-was-added-using-closure
	//http://stackoverflow.com/questions/12930272/javascript-closures-vs-anonymous-functions?rq=1
	//http://stackoverflow.com/questions/8714472/cant-pass-event-to-addeventlistener-closure-issue
	//http://stackoverflow.com/questions/9928754/removing-event-listeners-with-anonymous-function-calls-in-javascript
    //http://kangax.github.io/nfe/#named-expr
	//onmousedown to start dragging in a div
	drag_obj.MsDnFun = function (evt) {
	    var ary=[evt.clientX, evt.clientY];
	    this.Start(ary);
	    this.MsMovSet();
	    this.MsEndSet();
	}
	//For the div which starts dragging
	drag_obj.MsDnSet = function (div) {
	    var obj = this;
		div.addEventListener("mousedown",	
			(function(){
				//var obj=this;
				obj.MsDnDiv = div;
				obj.MsDnHnd = function (evt){
				    obj.MsDnFun(evt);
				}
				return obj.MsDnHnd;
			})(), false);
		//span.addEventListener('click', (function (obj) {
		//    return obj.listener = function () {
		//        obj.removeSpan(this);
		//    }
		//})(this), false);
	}
	drag_obj.MsDnClr = function () {
		this.MsDnDiv.removeEventListener("mousedown", this.MsDnHnd, 0);
		this.MsDnHnd = null;		
	}
	//onmousemove to drag in the whole document:
	drag_obj.MsMovFun = function (evt) {
	    var ary=[evt.clientX, evt.clientY];
		this.Move(ary);
	}
	drag_obj.MsMovSet = function () {
	    var obj = this;
		document.addEventListener("mousemove",	
		(function(){
			//var obj=this;//this is the window
			obj.MsMovHnd = function(evt){
				obj.MsMovFun(evt);
			}
			return obj.MsMovHnd;
		})(),false);
	}
	drag_obj.MsMovClr = function () {
    	document.removeEventListener("mousemove", this.MsMovHnd, 0);
		this.MsMovHnd = null;		
	}
	//onmouseup to stop drag in the whole document:
	drag_obj.MsUpFun = function (evt) {
	    this.MsMovClr();
	    this.MsEndClr();
		var ary=[evt.clientX, evt.clientY];
	    this.Stop(ary);
	}
	//Mouseleave didn't work for us.
	drag_obj.MsOutFun = function (evt) {
	    if(evt.relatedTarget === document.querySelector('html')) {
			this.MsMovClr();
			this.MsEndClr();
			var ary=[evt.clientX, evt.clientY];
			this.Stop(ary);
		}
	}
	/*
	document.body.addEventListener('mouseout', function(e) {
    if(e.relatedTarget === document.querySelector('html')) {
        console.log('We\'re OUT !');
    }
});
	*/
	drag_obj.MsEndSet = function () {
	    var obj = this;
		obj.MsUpHnd = function(evt){
			obj.MsUpFun(evt);
		}
		obj.MsOutHnd = function(evt){
			obj.MsOutFun(evt);
		}

		document.addEventListener("mouseup", this.MsUpHnd, 0);
		document.addEventListener("mouseout", this.MsOutHnd, 0);
		/*
		document.addEventListener("mouseup",	
		(function(){
		    //var obj=this;//this is the window
			obj.MsUpHnd = function(evt){
				obj.MsUpFun(evt);
			}
			return obj.MsUpHnd;
		})(),false);
		*/
	}
	drag_obj.MsEndClr = function () {
	    document.removeEventListener("mouseup", this.MsUpHnd, 0);
    	document.removeEventListener("mouseout", this.MsOutHnd, 0);
        this.MsUpHnd = null;		
		this.MsOutHnd = null;
	}
	
	return drag_obj;
}
