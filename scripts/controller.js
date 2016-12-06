angular
	.module('app')
	.controller('controller', ['$scope', 'JSTagsCollection', IRSController]);

	function IRSController ($scope, JSTagsCollection) {
		$scope.saveJSON = function () {
			$scope.toJSON = '';
			$scope.toJSON = angular.toJson($scope.data);
			var blob = new Blob([$scope.toJSON], { type:"application/json;charset=utf-8;" });			
			var downloadLink = angular.element('<a></a>');
                        downloadLink.attr('href',window.URL.createObjectURL(blob));
                        downloadLink.attr('download', 'default.mamspec');
			downloadLink[0].click();
		};

		// data
		$scope.data = {
			Frequency: null,
			Object: null,
			UnitOfAnalysis: null,
			ReportType: null,
			Metrics: null
    	};

    	// Frequency
    	$scope.frequencyTypes = [
			'Daily',
			'Daily Average',
			'Monthly'
		];

		// Object
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
				GroupSpec: []
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
				GroupSpec: []
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
		}

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
		}

	}