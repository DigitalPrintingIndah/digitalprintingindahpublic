var Global = angular.module('Global',[]);
window.$ = jQuery.noConflict();
Global.filter('toHtml', function($sce) { return $sce.trustAsHtml; });
Global.filter('htmlToPlainText', function() {
    return function(text) {
        var el = angular.element('<span>');
        el.html(text);
        return el.text();
    };
});
Global.filter('truncate', function() {
    return function(text, maxlength, appendEllipses) {
        if (text && text.length > maxlength) {
            text = text.substring(0, maxlength);
            text = text.substr(0, text.lastIndexOf(" "));
            if (appendEllipses) {
                text = text + "...";
            }
        }
        return text;
    };
});
Global.filter('checkEmptyImage', function() {
    return function(text, imagelink) {
        if (!text) {
            return imagelink;
        } else {
            return text;
        }
    };
});
Global.filter('linktarget', function() {
    return function(text) {
        if (text) {
            text = text.toLowerCase().replace("new window", "_blank");
            text = text.toLowerCase().replace("same window", "_self");
        }
        return text;
    };
});
function mergeRecursive(obj1, obj2) {
	  for (var p in obj2) {
	    try {
	      // Property in destination object set; update its value.
	      if ( obj2[p].constructor==Object ) {
	        obj1[p] = mergeRecursive(obj1[p], obj2[p]);
	
	      } else {
	        obj1[p] = obj2[p];
	
	      }
	
	    } catch(e) {
	      // Property in destination object not set; create it and set its value.
	      obj1[p] = obj2[p];
	
	    }
	  }
	
	  return obj1;
	}
$(function(){
	if($("#wpadminbar").length > 0){ 
		//$("nav").attr("style", "margin-top:32px")
	}
	$("input[name='s']").attr("placeholder", "Search..");
	$("#searchsubmit").hide();
})
