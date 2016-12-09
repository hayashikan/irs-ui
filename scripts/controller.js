angular
	.module('irsApp')
	.controller('controller', ['$scope', '$http', IRSController]);

	function IRSController($scope, $http) {
		// data
		$scope.data = {
			Frequency: null,
			Object: null,
			UnitOfAnalysis: null,
			ReportType: null,
			Metrics: []
    	};
		
		$scope.codebook = null;

    	// Add code book to mamspec
		$scope.addCodebook = function () {
			// body...
			var filename = 'scripts/' + $scope.data.Object + 'Codebook.json';
			console.log(filename);
			$http.get(filename)
				.then(function(res){
					console.log('Codebook Get!');
					$scope.codebook = res.data;
					$scope.data.parse = $scope.codebook.parse;
					$scope.data.Directory = $scope.codebook.Directory;
				});
		};
		
		// Save JSON
		$scope.saveJSON = function () {
			$scope.toJSON = '';
			$scope.toJSON = angular.toJson($scope.data);
			var blob = new Blob([$scope.toJSON], { type:"application/json;charset=utf-8;" });			
			var downloadLink = angular.element('<a></a>');
                        downloadLink.attr('href',window.URL.createObjectURL(blob));
                        downloadLink.attr('download', 'default.mamspec');
			downloadLink[0].click();
		};

    	// Basic Features editable
    	$scope.basicFeaturesEditable = true;
    	$scope.basicFeaturesOps = 'SAVE';
    	$scope.toggleBasicFeatures = function() {
    		$scope.basicFeaturesEditable = !$scope.basicFeaturesEditable;
    		if ($scope.basicFeaturesEditable) {
    			$scope.basicFeaturesOps = 'SAVE';
    		} else {
    			$scope.basicFeaturesOps = 'EDIT';
    		};
    	};

    	// Metric toggle editable
    	$scope.metricEditable = true;
    	$scope.metricOps = 'SAVE';
    	$scope.toggleMetric = function() {
    		$scope.metricEditable = !$scope.metricEditable;
    		if ($scope.metricEditable) {
    			$scope.metricOps = 'SAVE';
    		} else {
    			$scope.metricOps = 'EDIT';
    		};
    	};

    	// Unit of Analysis Group Editable
    	$scope.unitGroupEditable = true;
    	$scope.unitGroupOps = 'SAVE';
    	$scope.toggleUnitGroup = function () {
    		$scope.unitGroupEditable = !$scope.unitGroupEditable;
    		if ($scope.unitGroupEditable) {
    			$scope.unitGroupOps = 'SAVE';
    		} else {
    			$scope.unitGroupOps = 'EDIT';
    		};
    	}

    	// App/Web Group Spec validation
    	$scope.validateGroupItems = function(items, index) {
    		var pattern = /^\d{8}$/i;
    		var newItem = items[index-1];
    		validated = pattern.test(newItem);
    		if (!validated) {
    			items.splice(index-1, 1);
    		}
    		return items
    		
    	};


    	// Valid App/Web Group Items Filter


    	// Remove Row: App/Web Group
    	$scope.removeRow = function (index) {
    		console.log(index);
    		$scope.data.UnitOfAnalysis.GroupSpec.splice(index, 1)
    	};

    	// Add Row: App/Web Group
    	$scope.addRow = function () {
    		$scope.data.UnitOfAnalysis.GroupSpec.push({GroupName: "", GroupItems: []});
    	}


    	$scope.frequencyTypes = [
			'Daily',
			'Daily Average',
			'Monthly'
		];

		$scope.objectTypes = [
			'App',
			'Web'
		];

		// Unit of Analysis for different Object
		$scope.unitOATypes = {
			'App': [{
				Type: 'Application',
				AggCol: "Application",
				AggColName: "Application_Name"
			},{
				Type: 'Application Group',
				AggCol: "Group_ID",
				AggColName: "Group_Name",
				GroupSpec: [{GroupName: "", GroupItems: []}]
			},{
				Type: 'Total',
				AggCol: "Group_ID",
				AggColName: "Group_Name"
			}],
			'Web': [{
				Type: 'Website',
				AggCol: "Website",
				AggColName: "Website_Name"
			}, {
				Type: 'Website Group',
				AggCol: "Group_ID",
				AggColName: "Group_Name",
				GroupSpec: [{GroupName: "", GroupItems: []}]
			}, {
				Type: 'Total',
				AggCol: "Group_ID",
				AggColName: "Group_Name"
			}]
		};

		// Report Type for different Object
		$scope.reportTypes = {
			'App': [{
				Type: 'Usage Report'
			}, {
				Type: 'Usage By Target Report',
				TargetGroup: [],
			}, {
				Type: 'Usage Day Part Report',
				Interval: 60,
				StartTime: '000000',
				EndTime: '235959'
			}],
			'Web': [{
				Type: 'Usage Report'
			}, {
				Type: 'Usage By Target Report',
				TargetGroup: [],
			}]
		};


		$scope.metricTypes = {
			'App Usage Report': [
				'Reach (000)',
				'Reach (%)',
				'Total Sessions (000)',
				'Sessions Per User',
				'Total Minutes (000)',
				'Time Per User (in minutes)'
			],
			'App Usage By Target Report': [
				'Reach (000)',
				'Reach (%)',
				'Total Sessions (000)',
				'Sessions Per User',
				'Total Minutes (000)',
				'Time Per User (in minutes)'
			],
			'App Usage Day Part Report': [
				'Reach (000)'
			],
			'Web Usage Report': [
				'Reach (000)',
				'Reach (%)',
				'Total Page Views (000)',
				'Page Views Per User'
			],
			'Web Usage By Target Report': [
				'Reach (000)',
				'Reach (%)',
				'Total Page Views (000)',
				'Page Views Per User'
			],
		};

	}
