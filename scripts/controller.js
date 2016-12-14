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
		
		$scope.output = null;
		$scope.codebook = null;
		$scope.selectedItem = null;
		$scope.searchText = null;
		$scope.demographics = loadDemographics()

    	// Add code book to mamspec
		$scope.addCodebook = function () {
			// body...
			var filename = 'scripts/' + $scope.data.Object + 'Codebook.json';
			$http.get(filename)
				.then(function(res){
					$scope.codebook = res.data;
					$scope.output.parse = $scope.codebook.parse;
					$scope.output.Directory = $scope.codebook.Directory;
					console.log('Codebook Get!');
				});
		};
		
		// clear output
		$scope.clearOutput = function () {
			$scope.output = angular.copy($scope.data);
			if ($scope.output.ReportType.Type=='Usage By Target Report') {
				$scope.output.ReportType.TargetGroup = $scope.output.ReportType.TargetGroup.map(function (item) {
					delete item.QueryArray;
					return item;
				});};
		};

		// Save JSON
		$scope.saveJSON = function () {
			$scope.toJSON = '';
			$scope.toJSON = angular.toJson($scope.output);
			var blob = new Blob([$scope.toJSON], { type:"application/json;charset=utf-8;" });			
			var downloadLink = angular.element('<a></a>');
                        downloadLink.attr('href',window.URL.createObjectURL(blob));
                        downloadLink.attr('download', 'default.mamspec');
			downloadLink[0].click();
			console.log('Save Done!');
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

    	// Target Group Editable
    	$scope.targetGroupEditable = true;
    	$scope.targetGroupOps = 'SAVE';
    	$scope.toggleTargetGroup = function () {
    		$scope.targetGroupEditable = !$scope.targetGroupEditable;
    		if ($scope.targetGroupEditable) {
    			$scope.targetGroupOps = 'SAVE';
    		} else {
    			$scope.targetGroupOps = 'EDIT';
    		};
    	}
	
	// Day Part Editable
    	$scope.dayPartEditable = true;
    	$scope.dayPartOps = 'SAVE';
    	$scope.toggleDayPart = function () {
    		$scope.dayPartEditable = !$scope.dayPartEditable;
    		if ($scope.dayPartEditable) {
    			$scope.dayPartOps = 'SAVE';
    		} else {
    			$scope.dayPartOps = 'EDIT';
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


    	// Search Demographics
    	$scope.querySearchDemo = function (query) {
    		var results = query ? $scope.demographics.filter($scope.createFilterFor(query)) : [];
    		return results
    	}

    	$scope.createFilterFor = function (query) {
    		var lowercaseQuery = angular.lowercase(query);

    		return function filterFn(item) {
    			return (item._lowername.indexOf(lowercaseQuery)===0) || (item._lowercat.indexOf(lowercaseQuery)===0);
    		};
    	};
		
		var idIncrementor = 0;
		//Transform Chip to make Operator duplicatable.
		$scope.transformChip = function (chip, index) {
			if (chip.cat == 'Operator') {
				return {_id: ++idIncrementor, name: chip.name, query: chip.query};
			} else {
				return {_id: -1, name: chip.name, query: chip.query};
			};
		};

    	// Remove Row: App/Web Group
    	$scope.removeUnitGroupRow = function (index) {
    		console.log(index);
    		$scope.data.UnitOfAnalysis.GroupSpec.splice(index, 1)
    	};

    	// Add Row: App/Web Group
    	$scope.addUnitGroupRow = function () {
    		$scope.data.UnitOfAnalysis.GroupSpec.push({GroupName: "", GroupItems: []});
    	}

    	// Remove Row: Target Group
    	$scope.removeTargetGroupRow = function (index) {
    		console.log(index);
    		$scope.data.ReportType.TargetGroup.splice(index, 1)
    	};

    	// Add Row: Target Group
    	$scope.addTargetGroupRow = function () {
    		$scope.data.ReportType.TargetGroup.push({GroupName: "", QueryArray: [], Query: ""});
    	}

    	// Target Group: Join Group Query
    	$scope.join2Query = function (queryarray) {
    		//return queryarray.join(' ');
    		var results = queryarray.map(function (item){
    			return item.query;
    		});
    		return results.join(' ');

    	}

    	function loadDemographics() {
    		var demographics = [{
					name: 'and', cat: 'Operator', query: "&"
				},{
					name: 'or', cat: 'Operator', query: "|"
				},{
					name: '(', cat: 'Operator', query: '('
				},{
					name: ')', cat: 'Operator', query: ')'
				},{
					name: 'Male', cat: 'Gender', query: "Gender=='01'"
				},{
					name: 'Female', cat: 'Gender', query: "Gender=='02'"
				},{
					name: '18 - 24', cat: 'Age Group', query: "(Age_Group=='01' | Age_Group=='02')"
				},{
					name: '25 - 34', cat: 'Age Group', query: "(Age_Group=='03' | Age_Group=='04')"
				},{
					name: '35 - 49', cat: 'Age Group', query: "(Age_Group=='05' | Age_Group=='06' | Age_Group=='07')"
				},{
					name: '50 - 64', cat: 'Age Group', query: "(Age_Group=='08' | Age_Group=='09' | Age_Group=='10')"
				}];

			return demographics.map(function (demo) {
				demo._lowername = demo.name.toLowerCase();
				demo._lowercat = demo.cat.toLowerCase();
				return demo;
			});
    	};

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
				TargetGroup: [{GroupName: "", QueryArray: [], Query: ""}],
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
