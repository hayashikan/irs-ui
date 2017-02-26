angular
	.module('irsApp')
	.controller('controller', ['$scope', '$http', '$window', IRSController]);

	function IRSController($scope, $http, $window) {
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
		$scope.demographics = null;
		loadDemographics();
		$scope.showAdditional = {
			'unitGroup': false,
			'targetGroup': false,
			'dayPart': false
		};
		$scope.generated = false;
		
		// Load Demographics code book
		function loadDemographics() {
			var filename = 'scripts/Demographics.json';
			$http.get(filename)
				.then(function(res){
					$scope.demographics = res.data;
					$scope.demographics = $scope.demographics.map(function (demo) {
						demo._lowername = demo.name.toLowerCase();
						demo._lowercat = demo.cat.toLowerCase();
						return demo;
					});
					console.log('Demographics Get!');
				});
		};

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
					if ($scope.output.Frequency=='Weekday-weekend (Monthly data)'){
						$scope.output.parse.APPSWD.usecols = ["Individual_ID", "Date", "Start_Time", "End_Time", "Application"];
					}
				});
		};
		
		// clear output
		$scope.clearOutput = function () {
			$scope.output = angular.copy($scope.data);
			if ($scope.output.ReportType.Type=='Usage By Target Report' || $scope.output.ReportType.Type=='Usage Day Part By Target Report') {
				$scope.output.ReportType.TargetGroup = $scope.output.ReportType.TargetGroup.map(function (item) {
					delete item.QueryArray;
					return item;
				});};
		};
		
		// alert Generate Done!
		$scope.alertGenerate = function() {
			$window.alert('Done! Please click EXPORT then.');
		}

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
				$scope.generated = false;
			};
			$scope.showAdditional.unitGroup = $scope.showUnitGroup();
			$scope.showAdditional.targetGroup = $scope.showTargetGroup();
			$scope.showAdditional.dayPart = $scope.showDayPart();
		};

		// Metric editable
		$scope.metricEditable = true;
		$scope.metricOps = 'SAVE';
		$scope.toggleMetric = function() {
			$scope.metricEditable = !$scope.metricEditable;
			if ($scope.metricEditable) {
				$scope.metricOps = 'SAVE';
			} else {
				$scope.metricOps = 'EDIT';
				$scope.generated = false;
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
				$scope.generated = false;
			};
		};

		// Target Group Editable
		$scope.targetGroupEditable = true;
		$scope.targetGroupOps = 'SAVE';
		$scope.toggleTargetGroup = function () {
			$scope.targetGroupEditable = !$scope.targetGroupEditable;
			if ($scope.targetGroupEditable) {
				$scope.targetGroupOps = 'SAVE';
			} else {
				$scope.targetGroupOps = 'EDIT';
				$scope.generated = false;
			};
		};
	
		// Day Part Editable
		$scope.dayPartEditable = true;
		$scope.dayPartOps = 'SAVE';
		$scope.toggleDayPart = function () {
			$scope.dayPartEditable = !$scope.dayPartEditable;
			if ($scope.dayPartEditable) {
				$scope.dayPartOps = 'SAVE';
			} else {
				$scope.dayPartOps = 'EDIT';
				$scope.generated = false;
			};
		};

		// App/Web Group Spec validation
		$scope.validateGroupItems = function(items, index) {
			var pattern = /^\d{8}$/i;
			var newItem = items[index-1];
			validated = pattern.test(newItem);
			if (!validated) {
				items.splice(index-1, 1);
			}
			return items;
		};
		
		// App/Web Group Show
		$scope.showUnitGroup = function() {
			if (($scope.data.UnitOfAnalysis.Type=='Application Group' || $scope.data.UnitOfAnalysis.Type=='Website Group') && !$scope.basicFeaturesEditable) {
				return true;
			} else {
				return false;
			};
		};
		
		// Target Group Show
		$scope.showTargetGroup = function() {
			if (($scope.data.ReportType.Type=='Usage By Target Report' || $scope.data.ReportType.Type=='Usage Day Part By Target Report') && !$scope.basicFeaturesEditable) {
				return true;
			} else {
				return false;
			};
		};

		// Day Part Show
		$scope.showDayPart = function() {
			if (($scope.data.ReportType.Type=='Usage Day Part Report' || $scope.data.ReportType.Type=='Usage Day Part By Target Report' ) && !$scope.basicFeaturesEditable) {
				return true;
			} else {
				return false;
			};
		};
		
		// Generate Btn Disabled
		$scope.generateBtnDisable = true;
		$scope.generateBtnOps = "Save all sections first!";
		$scope.toggleGenerateBtn = function () {
			if (!$scope.basicFeaturesEditable && !$scope.metricEditable) {
				if ((($scope.showAdditional.unitGroup && !$scope.unitGroupEditable) || !$scope.showAdditional.unitGroup) && (($scope.showAdditional.targetGroup && !$scope.targetGroupEditable) || !$scope.showAdditional.targetGroup) && (($scope.showAdditional.dayPart && !$scope.dayPartEditable) || !$scope.showAdditional.dayPart)) {
					$scope.generateBtnDisable = false;
					$scope.generateBtnOps = "Generate MAM Spec";
				} else {
					$scope.generateBtnDisable = true;
					$scope.generateBtnOps = "Save all sections first!";
				};
			} else {
				$scope.generateBtnDisable = true;
				$scope.generateBtnOps = "Save all sections first!";
			};
		};
		
		// Export Btn Disabled
		$scope.exportBtnDisable = true;
		$scope.exportBtnOps = "Generate spec first!";
		$scope.toggleExportBtn = function () {
			if (!$scope.generateBtnDisable) {
				$scope.exportBtnDisable = false;
				$scope.exportBtnOps = "Export MAM Spec";
			} else {
				$scope.exportBtnDisable = true;
				$scope.exportBtnOps = "Generate spec first!";
			};
		};

		// Search Demographics
		$scope.querySearchDemo = function (query) {
			var results = query ? $scope.demographics.filter($scope.createFilterFor(query)) : [];
			return results;
		};

		$scope.createFilterFor = function (query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(item) {
				return (item._lowername.indexOf(lowercaseQuery)===0) || (item._lowercat.indexOf(lowercaseQuery)===0);
			};
		};
		
		//Transform Chip to make Operator duplicatable.
		var idIncrementor = 0;
		$scope.transformChip = function (chip, index) {
			if (chip.cat == 'Operator') {
				return {_id: ++idIncrementor, name: chip.name, query: chip.query};
			} else {
				return {_id: -1, name: chip.name, query: chip.query};
			};
		};

		// Remove Row: App/Web Group
		$scope.removeUnitGroupRow = function (index) {
			$scope.data.UnitOfAnalysis.GroupSpec.splice(index, 1)
		};

		// Add Row: App/Web Group
		$scope.addUnitGroupRow = function () {
			$scope.data.UnitOfAnalysis.GroupSpec.push({GroupName: "", GroupItems: []});
		};

		// Remove Row: Target Group
		$scope.removeTargetGroupRow = function (index) {
			$scope.data.ReportType.TargetGroup.splice(index, 1)
		};

		// Add Row: Target Group
		$scope.addTargetGroupRow = function () {
			$scope.data.ReportType.TargetGroup.push({GroupName: "", QueryArray: [], Query: ""});
		};

		// Target Group: Join Group Query
		$scope.join2Query = function (queryarray) {
			//return queryarray.join(' ');
			var results = queryarray.map(function (item){
				return item.query;
			});
			return results.join(' ');
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
				Type: 'Category',
				AggCol: 'Category',
				AggColName: 'Category_Name'
			},{
				Type: 'Subcategory',
				AggCol: 'Subcategory',
				AggColName: 'Category_Name'
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
				Type: 'Category',
				AggCol: 'Category',
				AggColName: 'Category_Name'
			},{
				Type: 'Subcategory',
				AggCol: 'Subcategory',
				AggColName: 'Category_Name'
			},{
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
			}, {
				Type: 'Usage Day Part By Target Report',
				TargetGroup: [{GroupName: "", QueryArray: [], Query: ""}],
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
			'App Usage Day Part By Target Report': [
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
