(function(){
    angular
        .module("productCustomizer")
        .controller("MainController", MainController);

    function MainController($scope, $http){
        $scope.method = 'prediction';
        $scope.show = "teat";
        $scope.slider = {
            value: 10,
            options: {
                showSelectionBar: true
            }
        };
        var output = [];
        var classification_result = [];
        var clustering = [];
        $scope.predict = function() {
            if ($scope.method == 'prediction'){
                var d = {
                    "Inputs": {
                        "input1": {
                            "ColumnNames": [
                                "Date",
                                "Hours",
                                "TemperatureF",
                                "Dew_PointF",                            
                                "base_hr_usage",    
                                "area_floor._m.sqr"
                            ],
                            "Values": [
                                [   $scope.date,
                                    $scope.hours,                           
                                    $scope.TemperatureF,
                                    $scope.Dew_PointF,                              
                                    $scope.base_hr_usage,
                                    $scope.area_floor
                                ]
                            ]
                        }
                    },
                    "GlobalParameters": {}
                };
                $http.post('/prediction/regression', d)
                    .then(function (response) {
                        var result = JSON.parse(response.data);
                        result = result.Results.output1.value.Values;
                        for (var i = 0; i < result.length; i++) {
                            output.push({
                                'type': result[i][1],
                                'persqm': parseFloat(result[i][0]),
                                'total': parseFloat(result[i][0]) * d.Inputs.input1.Values[0][5]
                            });
                        }
                        $scope.results = output;
                    
                });                      
            } else if($scope.method == 'classification'){
                var d = {
                    "Inputs": {
                        "input1": {
                            "ColumnNames": [
                                "Date",
                                "Hours",
                                "Weekday",
                                "Base_Hour_Flag",
                                "TemperatureF",
                                "area_floor._m.sqr"
                              ],
                            "Values": [
                                [   $scope.date,
                                    $scope.hours,
                                    $scope.weekday,
                                    $scope.Base_Hour_Flag,
                                    $scope.TemperatureF,
                                    $scope.area_floor
                                ]
                            ]
                        }
                    },
                    "GlobalParameters": {}
                };
                $http.post('/classification', d)
                    .then(function (response) {
                        console.log(result);
                        var result = JSON.parse(response.data);
                        result = result.Results.output1.value.Values;
                        for (var i = 0; i < result.length; i++) {
                            classification_result.push({
                                'name': result[i][2],
                                'base_hr_class': result[i][0],
                                'probability': result[i][1]
                            });
                        }
                        $scope.classification_results = classification_result;                        
                });
            } else if($scope.method == 'clustering'){
                var d = {
                    "Inputs": {
                        "input1": {
                            "ColumnNames": [
                                "Hours",
                                "consumption.Kwh.sqm",
                                "TemperatureF",
                                "Dew_PointF",
                                "Humidity",
                                "Wind_SpeedMPH",
                                "WindDirDegrees",
                                "base_hr_usage",
                                "area_floor._m.sqr"
                              ],
                            "Values": [
                                [   $scope.hours,
                                    $scope.consumption_kwh_sqm,
                                    $scope.TemperatureF,
                                    $scope.Dew_PointF,
                                    $scope.Humidity,
                                    $scope.Wind_SpeedMPH,
                                    $scope.WindDirDegrees,
                                    $scope.base_hr_usage,
                                    $scope.area_floor                                   
                                ]
                            ]
                        }
                    },
                    "GlobalParameters": {}
                };
                $http.post('/clustering', d)
                    .then(function (response) {
                        var result = JSON.parse(response.data);
                        console.log(result);
                        result = result.Results.output1.value.Values;
                        for (var i = 0; i < result.length; i++) {
                            clustering.push({
                                'type2': 'K-Means Clustering',
                                'cluster': result[i][0]                                
                            });
                        }
                        $scope.clustering = clustering;                        
                });
            } 
        }
    }
})();