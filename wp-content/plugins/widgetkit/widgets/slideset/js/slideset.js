/* Copyright (C) YOOtheme GmbH, YOOtheme Proprietary Use License (http://www.yootheme.com/license) */

(function($){var support=$widgetkit.support,prefix=$widgetkit.prefix;var instances=[],Plugin=function(){},defaults={width:"auto",height:"auto",index:0,autoplay:false,effect:"slide",interval:5e3,easing:"easeOutCirc",duration:300};Plugin.prototype=$.extend(Plugin.prototype,{name:"slideset",initialize:function(options){this.options=$.extend({},defaults,options);var $this=this,element=this.element;this.sets=element.find("ul.html");this.navitems=element.find("ul.nav").children();this.current=this.sets[this.options.index]?this.options.index:0;this.busy=false;this.timer=null;this.hover=false;this.gwidth=this.options.width=="auto"?element.width():this.options.width;this.navitems.each(function(i){$(this).bind("click",function(e){$this.stop().show(i)})});element.find(".next, .prev").bind("click",function(){$this.stop()[$(this).hasClass("next")?"next":"previous"]()});if("ontouchend"in document){element.bind("touchstart",function(event){var data=event.originalEvent.touches?event.originalEvent.touches[0]:event,start={time:(new Date).getTime(),coords:[data.pageX,data.pageY],origin:$(event.target)},stop;function moveHandler(event){if(!start){return}var data=event.originalEvent.touches?event.originalEvent.touches[0]:event;stop={time:(new Date).getTime(),coords:[data.pageX,data.pageY]};if(Math.abs(start.coords[0]-stop.coords[0])>10){event.preventDefault()}}element.bind("touchmove",moveHandler).one("touchend",function(event){element.unbind("touchmove",moveHandler);if(start&&stop){if(stop.time-start.time<1e3&&Math.abs(start.coords[0]-stop.coords[0])>30&&Math.abs(start.coords[1]-stop.coords[1])<75){start.origin.trigger("swipe").trigger(start.coords[0]>stop.coords[0]?"swipeleft":"swiperight")}}start=stop=undefined})});element.bind("swipeleft",function(){$this.next()}).bind("swiperight",function(){$this.previous()})}this.resize();$(window).bind("debouncedresize",function(){$this.resize()});if(jQuery.support.opacity){}this.navitems.eq(this.current).addClass("active");element.hover(function(){$this.hover=true},function(){$this.hover=false});if(this.options.autoplay)this.start()},resize:function(){this.sets.css($widgetkit.css3({transform:""}));var set_container=this.element.find(".sets:first"),maxwidth=set_container.css({width:""}).width(),optimalwidth=0,gwidth=this.options.width=="auto"?this.element.width():this.options.width,gheight=this.options.height=="auto"?this.sets.eq(0).children().eq(0).outerHeight(true):this.options.height,$this=this;this.sets.each(function(setindex){var set=$(this).show(),childs=$(this).children(),marginleft=0;tmp=0;childs.each(function(index){var child=$(this);child.css("left",tmp).data("left",tmp);tmp+=child.width()});optimalwidth=Math.max(optimalwidth,tmp);set.css("width",tmp).css("margin-left","").css("margin","0 auto").data("width",tmp)});$this.element.data("optimalwidth",optimalwidth);gwidth=this.options.width=="auto"?this.element.width():this.options.width,gheight=this.options.height=="auto"?this.sets.eq(0).children().eq(0).outerHeight(true):this.options.height;this.sets.css({height:gheight});set_container.css({height:gheight});if(this.element.data("optimalwidth")>maxwidth){gwidth=optimalwidth;var ratio=optimalwidth/maxwidth;this.sets.css($widgetkit.css3({transform:"scale("+1/ratio+")"}));set_container.css("height",gheight/ratio)}this.sets.each(function(){var set=$(this);set.data("margin-left",(gwidth-set.data("width"))/2)});this.sets.hide().eq(this.current).show();this.gheight=gheight},next:function(){this.show(this.sets[this.current+1]?this.current+1:0)},previous:function(){this.show(this.current-1>-1?this.current-1:this.sets.length-1)},start:function(){if(this.timer)return;var $this=this;this.timer=setInterval(function(){if(!$this.hover&&!$this["busy"]){$this.next()}},this.options.interval);return this},stop:function(){if(this.timer){clearInterval(this.timer);if(this["tmptimer"])clearTimeout(this.tmptimer);var $this=this;this.tmptimer=setTimeout(function(){$this.start();this.tmptimer=false},3e4);this.timer=false}return this},show:function(index){if(this.current==index||this.busy)return;this.element.trigger("slideset-show",[this.current,index]);this[this[this.options.effect]?this.options.effect:"slide"](index);this.navitems.removeClass("active").eq(index).addClass("active")},slide:function(index){var dir=index>this.current?"left":"right",set=this.sets.eq(index),$this=this;this.busy=true;this.sets.eq(this.current).animate({"margin-left":(dir=="left"?-1:1)*2*this.gwidth},{complete:function(){set.css("margin-left","auto").children().hide().css({left:(dir=="left"?1:-1)*2*$this.gwidth});set.show();$this.sets.eq($this.current).hide();var childs=set.children(),iterator=0;childs.each(function(c){if(dir=="right")var c=childs.length-1-c;(function(c,index){setTimeout(function(){childs.eq(c).show().animate({left:childs.eq(c).data("left")},{complete:function(){if(dir=="left"&&c==childs.length-1||dir=="right"&&c==0){$this.busy=false;$this.current=index}},duration:$this.options.duration,easing:$this.options.easing})},100*iterator)})(c,index);iterator=iterator+1})}})},zoom:function(index){var set=this.sets.eq(index),stat=0,curchilds=this.sets.eq(this.current).children(),$this=this;this.busy=true;this.sets.eq(this.current).children().animate(jQuery.support.opacity?{transform:"scale(0)",opacity:0}:{opacity:0},{complete:function(p){stat=stat+1;if(stat!=-1&&stat<curchilds.length-1)return;stat=-1;var childs=set.children().css(jQuery.support.opacity?{transform:"scale(0)",opacity:0}:{opacity:0}),iterator=0;$this.sets.eq($this.current).hide();set.show();childs.each(function(c){childs.eq(c).css({left:childs.eq(c).data("left")}).show();(function(c,index){setTimeout(function(){childs.eq(c).show().animate(jQuery.support.opacity?{transform:"scale(1)",opacity:1}:{opacity:1},{complete:function(){if(c==childs.length-1){$this.busy=false;$this.current=index}},duration:$this.options.duration,easing:$this.options.easing})},Math.round($this.options.duration/3)*iterator)})(c,index);iterator=iterator+1})},easing:"swing",duration:Math.round($this.options.duration/2)})},deck:function(index){if(!jQuery.support.opacity){return this.zoom(index)}var dir=index>this.current?"left":"right",set=this.sets.eq(index),outChilds=this.sets.eq(this.current).children(),inChilds=this.sets.eq(index).children(),targetOut=outChilds[index>this.current?"first":"last"](),sourceIn=inChilds[index>this.current?"last":"first"](),$this=this;if(dir=="right")outChilds._reverse();if(dir=="right")inChilds._reverse();this.busy=true;outChilds.each(function(i){var item=$(this);(function(i,item){setTimeout(function(){item.animate({transform:"scale(0)",opacity:0},{complete:function(){item.hide();if(i==outChilds.length-1){$this.sets.eq($this.current).hide();inChilds.css({transform:"scale(0)",opacity:0});set.show();inChilds.each(function(c){var item2=$(this);(function(c,item2){setTimeout(function(){item2.animate({transform:"scale(1)",opacity:1},{complete:function(){if(c==inChilds.length-1){outChilds.show().each(function(i){outChilds.eq(i).css({transform:"scale(1)",opacity:1,left:outChilds.eq(i).data("left")})});$this.busy=false;$this.current=index}},duration:$this.options.duration,easing:$this.options.easing})},Math.round($this.options.duration/3)*c)})(c,item2)})}},duration:$this.options.duration,easing:$this.options.easing})},Math.round($this.options.duration/3)*i)})(i,item)})},drops:function(index){if(!jQuery.support.opacity){return this.zoom(index)}var dir=index>this.current?"left":"right",set=this.sets.eq(index),outChilds=this.sets.eq(this.current).children().css(css3({transition:""})).css(css3({transform:"rotate(0deg)",top:0,opacity:1})),inChilds=this.sets.eq(index).children().css(css3({transition:""})),targetOut=outChilds[index>this.current?"first":"last"](),sourceIn=inChilds[index>this.current?"last":"first"](),$this=this;if(dir=="right")outChilds._reverse();if(dir=="right")inChilds._reverse();this.busy=true;outChilds.each(function(i){var item=$(this);(function(i,item){setTimeout(function(){if(support.transition){item.css(css3({transition:"all "+$this.options.duration+"ms ease-out"}));if(i==outChilds.length-1){item.one("webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd",function(){$this.sets.eq($this.current).hide();inChilds.css(css3({top:$this.gheight,opacity:0,transform:"rotate(15deg)"}));set.show();inChilds.each(function(c){var item2=$(this);(function(c,item2){setTimeout(function(){item2.css(css3({transition:"all "+$this.options.duration+"ms ease-in"}));if(c==inChilds.length-1){item2.one("webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd",function(){$this.busy=false;$this.current=index})}item2.css(css3({opacity:1,top:0,transform:"rotate(0deg)"}))},Math.round($this.options.duration/3)*c)})(c,item2)})})}item.css(css3({opacity:0,top:$this.gheight,transform:"rotate(15deg)"}))}else{item.animate({opacity:0,top:$this.gheight},{complete:function(){item.hide();if(i==outChilds.length-1){$this.sets.eq($this.current).hide();inChilds.css({top:$this.gheight,opacity:0});set.css("margin-left","").show();inChilds.each(function(c){var item2=$(this);(function(c,item2){setTimeout(function(){item2.animate({opacity:1,top:0},{complete:function(){if(c==inChilds.length-1){outChilds.show().each(function(i){outChilds.eq(i).css({opacity:1,top:0})});$this.busy=false;$this.current=index}},duration:$this.options.duration,easing:$this.options.easing})},Math.round($this.options.duration/3)*c)})(c,item2)})}},duration:$this.options.duration,easing:$this.options.easing})}},20+Math.round($this.options.duration/3)*i)})(i,item)})}});if(!$.fn["_reverse"]){$.fn._reverse=[].reverse}function css3(cssprops){return $widgetkit.css3(cssprops)}$.fn[Plugin.prototype.name]=function(){var args=arguments;var method=args[0]?args[0]:null;return this.each(function(){var element=$(this);if(Plugin.prototype[method]&&element.data(Plugin.prototype.name)&&method!="initialize"){element.data(Plugin.prototype.name)[method].apply(element.data(Plugin.prototype.name),Array.prototype.slice.call(args,1))}else if(!method||$.isPlainObject(method)){var plugin=new Plugin;plugin.element=element;instances.push(plugin);if(Plugin.prototype["initialize"])plugin.initialize.apply(plugin,args);element.data(Plugin.prototype.name,plugin)}else{$.error("Method "+method+" does not exist on jQuery."+Plugin.prototype.name)}})}})(jQuery);(function($){var div=document.createElement("div"),divStyle=div.style,propertyName="transform",suffix="Transform",testProperties=["O"+suffix,"ms"+suffix,"Webkit"+suffix,"Moz"+suffix,propertyName],i=testProperties.length,supportProperty,supportMatrixFilter,propertyHook,propertyGet,rMatrix=/Matrix([^)]*)/;while(i--){if(testProperties[i]in divStyle){$.support[propertyName]=supportProperty=testProperties[i];continue}}if(!supportProperty){$.support.matrixFilter=supportMatrixFilter=divStyle.filter===""}div=divStyle=null;$.cssNumber[propertyName]=true;if(supportProperty&&supportProperty!=propertyName){$.cssProps[propertyName]=supportProperty;if(supportProperty=="Moz"+suffix){propertyHook={get:function(elem,computed){return computed?$.css(elem,supportProperty).split("px").join(""):elem.style[supportProperty]},set:function(elem,value){elem.style[supportProperty]=/matrix[^)p]*\)/.test(value)?value.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/,"matrix$1$2px,$3px"):value}}}else if(/^1\.[0-5](?:\.|$)/.test($.fn.jquery)){propertyHook={get:function(elem,computed){return computed?$.css(elem,supportProperty.replace(/^ms/,"Ms")):elem.style[supportProperty]}}}}else if(supportMatrixFilter){propertyHook={get:function(elem,computed){var elemStyle=computed&&elem.currentStyle?elem.currentStyle:elem.style,matrix;if(elemStyle&&rMatrix.test(elemStyle.filter)){matrix=RegExp.$1.split(",");matrix=[matrix[0].split("=")[1],matrix[2].split("=")[1],matrix[1].split("=")[1],matrix[3].split("=")[1]]}else{matrix=[1,0,0,1]}matrix[4]=elemStyle?elemStyle.left:0;matrix[5]=elemStyle?elemStyle.top:0;return"matrix("+matrix+")"},set:function(elem,value,animate){var elemStyle=elem.style,currentStyle,Matrix,filter;if(!animate){elemStyle.zoom=1}value=matrix(value);if(!animate||animate.M){Matrix=["Matrix("+"M11="+value[0],"M12="+value[2],"M21="+value[1],"M22="+value[3],"SizingMethod='auto expand'"].join();filter=(currentStyle=elem.currentStyle)&&currentStyle.filter||elemStyle.filter||"";elemStyle.filter=rMatrix.test(filter)?filter.replace(rMatrix,Matrix):filter+" progid:DXImageTransform.Microsoft."+Matrix+")";if(centerOrigin=$.transform.centerOrigin){elemStyle[centerOrigin=="margin"?"marginLeft":"left"]=-(elem.offsetWidth/2)+elem.clientWidth/2+"px";elemStyle[centerOrigin=="margin"?"marginTop":"top"]=-(elem.offsetHeight/2)+elem.clientHeight/2+"px"}}if(!animate||animate.T){elemStyle.left=value[4]+"px";elemStyle.top=value[5]+"px"}}}}if(propertyHook){$.cssHooks[propertyName]=propertyHook}propertyGet=propertyHook&&propertyHook.get||$.css;$.fx.step.transform=function(fx){var elem=fx.elem,start=fx.start,end=fx.end,split,pos=fx.pos,transform,translate,rotate,scale,skew,T=false,M=false,prop;translate=rotate=scale=skew="";if(!start||typeof start==="string"){if(!start){start=propertyGet(elem,supportProperty)}if(supportMatrixFilter){elem.style.zoom=1}split=end.split(start);if(split.length==2){end=split.join("");fx.origin=start;start="none"}fx.start=start=start=="none"?{translate:[0,0],rotate:0,scale:[1,1],skew:[0,0]}:unmatrix(toArray(start));fx.end=end=~end.indexOf("matrix")?unmatrix(matrix(end)):components(end);for(prop in start){if(prop=="rotate"?start[prop]==end[prop]:start[prop][0]==end[prop][0]&&start[prop][1]==end[prop][1]){delete start[prop]}}}if(start.translate){translate=" translate("+(start.translate[0]+(end.translate[0]-start.translate[0])*pos+.5|0)+"px,"+(start.translate[1]+(end.translate[1]-start.translate[1])*pos+.5|0)+"px"+")";T=true}if(start.rotate!=undefined){rotate=" rotate("+(start.rotate+(end.rotate-start.rotate)*pos)+"rad)";M=true}if(start.scale){scale=" scale("+(start.scale[0]+(end.scale[0]-start.scale[0])*pos)+","+(start.scale[1]+(end.scale[1]-start.scale[1])*pos)+")";M=true}if(start.skew){skew=" skew("+(start.skew[0]+(end.skew[0]-start.skew[0])*pos)+"rad,"+(start.skew[1]+(end.skew[1]-start.skew[1])*pos)+"rad"+")";M=true}transform=fx.origin?fx.origin+translate+skew+scale+rotate:translate+rotate+scale+skew;propertyHook&&propertyHook.set?propertyHook.set(elem,transform,{M:M,T:T}):elem.style[supportProperty]=transform};function matrix(transform){transform=transform.split(")");var trim=$.trim,i=transform.length-1,split,prop,val,A=1,B=0,C=0,D=1,A_,B_,C_,D_,tmp1,tmp2,X=0,Y=0;while(i--){split=transform[i].split("(");prop=trim(split[0]);val=split[1];A_=B_=C_=D_=0;switch(prop){case"translateX":X+=parseInt(val,10);continue;case"translateY":Y+=parseInt(val,10);continue;case"translate":val=val.split(",");X+=parseInt(val[0],10);Y+=parseInt(val[1]||0,10);continue;case"rotate":val=toRadian(val);A_=Math.cos(val);B_=Math.sin(val);C_=-Math.sin(val);D_=Math.cos(val);break;case"scaleX":A_=val;D_=1;break;case"scaleY":A_=1;D_=val;break;case"scale":val=val.split(",");A_=val[0];D_=val.length>1?val[1]:val[0];break;case"skewX":A_=D_=1;C_=Math.tan(toRadian(val));break;case"skewY":A_=D_=1;B_=Math.tan(toRadian(val));break;case"skew":A_=D_=1;val=val.split(",");C_=Math.tan(toRadian(val[0]));B_=Math.tan(toRadian(val[1]||0));break;case"matrix":val=val.split(",");A_=+val[0];B_=+val[1];C_=+val[2];D_=+val[3];X+=parseInt(val[4],10);Y+=parseInt(val[5],10)}tmp1=A*A_+B*C_;B=A*B_+B*D_;tmp2=C*A_+D*C_;D=C*B_+D*D_;A=tmp1;C=tmp2}return[A,B,C,D,X,Y]}function unmatrix(matrix){var scaleX,scaleY,skew,A=matrix[0],B=matrix[1],C=matrix[2],D=matrix[3];if(A*D-B*C){scaleX=Math.sqrt(A*A+B*B);A/=scaleX;B/=scaleX;skew=A*C+B*D;C-=A*skew;D-=B*skew;scaleY=Math.sqrt(C*C+D*D);C/=scaleY;D/=scaleY;skew/=scaleY;if(A*D<B*C){A=-A;B=-B;skew=-skew;scaleX=-scaleX}}else{rotate=scaleX=scaleY=skew=0}return{translate:[+matrix[4],+matrix[5]],rotate:Math.atan2(B,A),scale:[scaleX,scaleY],skew:[skew,0]}}function components(transform){transform=transform.split(")");var translate=[0,0],rotate=0,scale=[1,1],skew=[0,0],i=transform.length-1,trim=$.trim,split,name,value;while(i--){split=transform[i].split("(");name=trim(split[0]);value=split[1];if(name=="translateX"){translate[0]+=parseInt(value,10)}else if(name=="translateY"){translate[1]+=parseInt(value,10)}else if(name=="translate"){value=value.split(",");translate[0]+=parseInt(value[0],10);translate[1]+=parseInt(value[1]||0,10)}else if(name=="rotate"){rotate+=toRadian(value)}else if(name=="scaleX"){scale[0]*=value}else if(name=="scaleY"){scale[1]*=value}else if(name=="scale"){value=value.split(",");scale[0]*=value[0];scale[1]*=value.length>1?value[1]:value[0]}else if(name=="skewX"){skew[0]+=toRadian(value)}else if(name=="skewY"){skew[1]+=toRadian(value)}else if(name=="skew"){value=value.split(",");skew[0]+=toRadian(value[0]);skew[1]+=toRadian(value[1]||"0")}}return{translate:translate,rotate:rotate,scale:scale,skew:skew}}function toRadian(value){return~value.indexOf("deg")?parseInt(value,10)*(Math.PI*2/360):~value.indexOf("grad")?parseInt(value,10)*(Math.PI/200):parseFloat(value)}function toArray(matrix){matrix=/\(([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(matrix);return[matrix[1],matrix[2],matrix[3],matrix[4],matrix[5],matrix[6]]}$.transform={centerOrigin:"margin"}})(jQuery);