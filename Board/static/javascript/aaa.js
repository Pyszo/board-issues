var app=angular.module('board', ['ngDragDrop'], function ($interpolateProvider) {
        $interpolateProvider.startSymbol("{[{");
        $interpolateProvider.endSymbol("}]}");
    }
);

app.directive('cloud', function(){
	return{
		restrict: 'E',
		templateUrl: '/static/javascript/template/cloud.html'
	}
});

app.controller('feedCtrl', ['$http', '$scope', function($http, $scope){
	$scope.feed = function(token){
		$scope.story = [];
		$scope.todo = [];
		$scope.inpro = [];
		$scope.tover = [];
		$scope.done = [];
		$http({method: 'GET', url: 'https://api.github.com/repos/Pyszo/simple-blog/issues', headers:{'Accept': 'application/json', 'Authorization':'token '+token}})
			.success(function(data, status, headers, config){
				$scope.alldata = data;
				for(var issue in data){
					for(var label in data[issue].labels){
						if(data[issue].labels[label].name == 'Story')$scope.story.push(data[issue]);
						if(data[issue].labels[label].name == 'To do')$scope.todo.push(data[issue]);
						if(data[issue].labels[label].name == 'In progress')$scope.inpro.push(data[issue]);
						if(data[issue].labels[label].name == 'To verify')$scope.tover.push(data[issue]);
						if(data[issue].labels[label].name == 'Done')$scope.done.push(data[issue]);
					};
				};
				$scope.token = token;
				//$scope.headers = headers;
		});
	};
}]);

app.controller('printCtrl', ['$scope', function($scope){
	$scope.steps = ['Story', 'To do', 'In progress', 'To verify', 'Done'];

}]);

app.controller('dragDropCtrl', ['$scope','$http', function($scope, $http){
	var t = this;
	t.sendLabels = function(issue,step){
		var labels = [];
		for(var label in issue.labels){
			if(issue.labels[label].name == 'js')labels.push(issue.labels[label].name);
			if(issue.labels[label].name == 'python')labels.push(issue.labels[label].name);
			if(issue.labels[label].name == 'css')labels.push(issue.labels[label].name);
			if(issue.labels[label].name == 'help wanted')labels.push(issue.labels[label].name);
			if(issue.labels[label].name == 'invalid')labels.push(issue.labels[label].name);
			if(issue.labels[label].name == 'bug')labels.push(issue.labels[label].name);
		};
		labels.push(step);

		var dat={"labels":labels};
		$scope.editIssue(dat, issue.number);
	};


	$scope.dropSuccessHandler = function($event, index, array){
		array.splice(index,1);
	};
	

	$scope.onDrop = function($event,$data,array,step){
		array.push($data);
		t.sendLabels($data,step);
	};

	$scope.editIssue = function(editet, nr){
		token = $scope.token;
		$http({method: 'PATCH', url: 'https://api.github.com/repos/Pyszo/simple-blog/issues/'+nr, data: editet, headers:{'Accept': 'application/json', 'Authorization':'token '+token}}).success(function(data, status, headers, config){
				//location.reload();
			});
	};



}]);

app.controller('addIssue', ['$http', '$scope', function($http, $scope){
	$scope.show=false;
	$scope.show2=false;
	$scope.newIssue = function(title, body, step, token){
		var dat = {'title':title, 'body':body, 'labels':[step]};
		$http({method: 'POST', url: 'https://api.github.com/repos/Pyszo/simple-blog/issues', data: dat, headers:{'Accept': 'application/json', 'Authorization':'token '+token}})
			.success(function(data, status, headers, config){
				$scope.feed(token);
			});
	};
}]);

app.controller('labelsCtrl', ['$scope', function($scope){
	var t = this;

	this.ifLabel = function(issue){
		t.js = false;
		t.pt = false;
		t.css = false;
		t.hw = false;
		t.iv = false;
		t.bug = false;
		for(var label in issue.labels){
			if(issue.labels[label].name == 'js')t.js=true;
			if(issue.labels[label].name == 'python')t.pt=true;
			if(issue.labels[label].name == 'css')t.css=true;
			if(issue.labels[label].name == 'help wanted')t.hw=true;
			if(issue.labels[label].name == 'invalid')t.iv=true;
			if(issue.labels[label].name == 'bug')t.bug=true;
		};
	};
	this.sendLabels = function(issue){
		var labels = [];
		for(var label in issue.labels){
			if(issue.labels[label].name == 'Story')labels.push(issue.labels[label].name);
			if(issue.labels[label].name == 'To do')labels.push(issue.labels[label].name);
			if(issue.labels[label].name == 'In progress')labels.push(issue.labels[label].name);
			if(issue.labels[label].name == 'To verify')labels.push(issue.labels[label].name);
			if(issue.labels[label].name == 'Done')labels.push(issue.labels[label].name);
		};
		if(t.js == true)labels.push('js');
		if(t.pt == true)labels.push('python');
		if(t.css == true)labels.push('css');
		if(t.hw == true)labels.push('help wanted');
		if(t.iv == true)labels.push('invalid');
		if(t.bug == true)labels.push('bug');

		var dat={"labels":labels};
		$scope.editIssue(dat, issue.number);
	};
}]);
