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
        $scope.predict = function() {
            var d = {
                "Inputs": {
                    "input1": {
                        "ColumnNames": [
                            "type",
                            "Weekday",
                            "Base_Hour_Flag",
                            "TemperatureF",
                            "Dew_PointF",
                            "Humidity",
                            "Wind_SpeedMPH",
                            "WindDirDegrees",
                            "base_hr_usage",
                            "area_floor._m.sqr"
                        ],
                        "Values": [
                            [
                                $scope.type,
                                $scope.weekday,
                                $scope.Base_Hour_Flag,
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

            console.log(d);
            $http.post('/prediction/neural-network', d)
                .then(function (response) {
                    console.log(response.data);
                    var result = JSON.parse(response.data);
                    console.log(result.Results);
                    result = result.Results.output1.value.Values;
                    for (var i = 0; i < result.length; i++) {
                        output.push({
                            'type': "Neural Network",
                            'persqm': parseFloat(result[i]),
                            'total': parseFloat(result[i]) * d.Inputs.input1.Values[0][9]
                        });
                        console.log(parseFloat(result[i]) * d.Inputs.input1.Values[0][9]);
                    }
                    $scope.results = output;
                    $http.post('/prediction/linear-regression', d)
                        .then(function (response) {
                            console.log(response.data);
                            var result = JSON.parse(response.data);
                            console.log(result.Results);
                            result = result.Results.output1.value.Values;
                            for (var i = 0; i < result.length; i++) {
                                output.push({
                                    'type': "Linear Regression",
                                    'persqm': parseFloat(result[i]),
                                    'total': parseFloat(result[i]) * d.Inputs.input1.Values[0][9]
                                });
                                console.log(parseFloat(result[i]) * d.Inputs.input1.Values[0][9]);
                            }
                            $scope.results = output;
                            $http.post('/prediction/random-regression', d)
                                .then(function (response) {
                                     console.log(response.data);
                                     var result = JSON.parse(response.data);
                                     console.log(result);
                                     result = result.Results.output1.value.Values;
                                     for (var i = 0; i < result.length; i++) {
                                         output.push({
                                              'type': "Random Forest Regression",
                                                'persqm': parseFloat(result[i]),
                                                'total': parseFloat(result[i]) * d.Inputs.input1.Values[0][9]
                                            });
                                            console.log(parseFloat(result[i]) * d.Inputs.input1.Values[0][9]);
                                        }
                            $scope.results = output;
                        });
                        });
                });
        }
    }
})();
