// *** Directives *** //
Global.directive('sliderItem', [function() {
        return {
            link: function(scope, elem, attrs) {
                if (scope.$last) {
                    $('.home-slider').flexslider({
                        directionNav: true,
                        pauseOnHover: true,
                        
                        //controlNav: true,
                        //pausePlay: true,
                        //pauseText: '<i class="glyphicon glyphicon-pause white"></i>',
                        //playText: '<i class="glyphicon glyphicon-play white"></i>'
                    });
                }
            }
        };
    }
]); 
Global.controller('HomeHeader', ['$scope', 'Requestor', function($scope, Requestor) {
	var getActiveData = function(){
		Requestor.get_active_data().then(function(d){
			if(d.d.results[0]){
				var HomeOption = JSON.parse(d.d.results[0].data);
				try{
					angular.forEach(HomeOption.Data, function(opt){
						if (opt.ActiveOption[opt.Selected].content){
							opt.ActiveOption[opt.Selected].content = opt.ActiveOption[opt.Selected].content.split("\\").join("");
						}
					});
				}catch(ex){
					console.log(ex);
				}
				$scope.HomeOption = HomeOption;
			}
			
		});
	}
	getActiveData();
}]).controller("ThumbView", ["$scope", function($scope){
	if(thumbOptions){
		$scope.ThumbOptions = thumbOptions;
	}
}])
.controller("NoticeBoard", ["$scope", function($scope){
	if(localStorage.breakingnewsMin == 1){
		$(".BreakingNews").toggleClass("min-state");
		$(".BreakingNews .min i").toggleClass("glyphicon-chevron-up",300);
	}
	$(".BreakingNews .min").click(function(){
		$(".BreakingNews").toggleClass("min-state",300);
		$(".BreakingNews .min i").toggleClass("glyphicon-chevron-up",300);
		
		if(localStorage.breakingnewsMin == 0){
	        $(".BreakingNews .min i").removeClass("glyphicon-chevron-down");
			localStorage.breakingnewsMin = 1;
		}else{
	        $(".BreakingNews .min i").addClass("glyphicon-chevron-down");
			localStorage.breakingnewsMin = 0;
		}
	});
	$scope.noticeboardOptions = {
		State:false
	}
	if(noticeboardOptions){
		$scope.noticeboardOptions = noticeboardOptions;
	}
	$scope.setMin = function(value){
        $scope.noticeboardOptions.Minimised = value;
    }
}]).factory('Requestor', function($q) {
	var service = {};
	service.getAllData = function(){
		var query = {
			'action': "get_data",
			'security': myAjax.security
		};
		return service.request(myAjax.ajaxurl, query);
	}
	service.find_data = function(where, eq){
		var query = {
			'action': "find_data",
			'find': {
				"where": where,
				"eq": eq
			},
			'security': myAjax.security
		};
		return service.request(myAjax.ajaxurl, query);
	}
	service.get_active_data = function(){
		var query = {
			'action': "find_data",
			'find': {
				"where": "status",
				"eq": "Active"
			},
			'security': myAjax.security
		};
		return service.request(myAjax.ajaxurl, query);
	}
	service.request = function(url, query){
		var dfd = $q.defer();
		jQuery.ajax({
			method:"POST",
			url:url,
			data:query,
			success:function(d){
				dfd.resolve(d);
			},
			error:function(err){
				dfd.reject(err);
			}
		});
		return dfd.promise;
	}
	return service;
});