/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var $app = angular.module('PushLocatorApp', []);
$app.controller('contractorsCtrl', function ($scope, $http) {
    $scope.locations = [];
    $scope.tempContractor = {};
    $scope.editMode = false;
    $scope.index = '';
    var url = "updater.php";
    var locData = "data/locations.json";
    
    $scope.init = function () {
        $http.get(locData)
                .then(function (response) {
                    $scope.locations = response.data;
                })
    }

    $scope.saveContractor = function () {
        jQuery('.btn-save').text('Saving...');
        $scope.tempContractor.country = 'AU';
        $http({
            method: 'post',
            url: url,
            data: $.param({'contractor': $scope.tempContractor, 'type': 'save_contractor'}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
                .success(function (data, status, headers, config) {
                    if (data.success) {
                        if ($scope.editMode) {
                            //$scope.locations[$scope.index].id = data.id;
                            $scope.locations[$scope.index].name = $scope.tempContractor.name;
                            $scope.locations[$scope.index].address = $scope.tempContractor.address;
                            $scope.locations[$scope.index].postal = $scope.tempContractor.postal;
                            $scope.locations[$scope.index].country = $scope.tempContractor.country;
                            $scope.locations[$scope.index].lat = $scope.tempContractor.lat;
                            $scope.locations[$scope.index].lng = $scope.tempContractor.lng;
                        } else {
                            $scope.locations.push({
                                //id : data.id,
                                name: $scope.tempContractor.name,
                                address: $scope.tempContractor.address,
                                postal: $scope.tempContractor.postal,
                                country: $scope.tempContractor.country,
                                lat: $scope.tempContractor.lat,
                                lng: $scope.tempContractor.lng
                            });
                        }
                        $scope.messageSuccess(data.message);
                        //$scope.userForm.$setPristine();
                        $scope.tempUser = {};

                    } else {
                        $scope.messageFailure(data.message);
                    }
                })
                .error(function (data, status, headers, config) {
                    //$scope.codeStatus = response || "Request failed";
                });

        jQuery('.btn-save').text('Save');
        $('#myModal').modal('hide');
    }

    $scope.addContractor = function () {
        //$scope.saveContractor();
        $scope.editMode = false;
        $scope.index = '';
        jQuery('#myModalLabel').text('Add a new Contractor');
    }

    $scope.editContractor = function (location) {
        $scope.tempContractor = {
            //id: location.id,
            name: location.name,
            address: location.address,
            postal: location.postal,
            country: location.country,
            lat: location.lat,
            lng: location.lng
        };
        $scope.editMode = true;
        $scope.index = $scope.locations.indexOf(location);
        $scope.tempContractor.index = $scope.locations.indexOf(location);
        jQuery('#myModalLabel').text('Edit Contractor');
    }
    
    
    $scope.deleteContractor = function (location) {
        var r = confirm("Are you sure want to delete this user!");
        if (r == true) {
            $http({
                method: 'post',
                url: url,
                data: $.param({'index': $scope.locations.indexOf(location), 'type': 'delete_contractor'}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                    success(function (data, status, headers, config) {
                        if (data.success) {
                            var index = $scope.locations.indexOf(location);
                            $scope.locations.splice(index, 1);
                            $scope.messageSuccess(data.message);
                        } else {
                            $scope.messageFailure(data.message);
                        }
                    }).
                    error(function (data, status, headers, config) {
                        $scope.messageFailure(data.message);
                    });
        }
    }
    $scope.messageFailure = function (msg) {
        jQuery('.alert-failure-div > p').html(msg);
        jQuery('.alert-failure-div').show();
        jQuery('.alert-failure-div').delay(5000).slideUp(function () {
            jQuery('.alert-failure-div > p').html('');
        });
    }

    $scope.messageSuccess = function (msg) {
        jQuery('.alert-success-div > p').html(msg);
        jQuery('.alert-success-div').show();
        jQuery('.alert-success-div').delay(5000).slideUp(function () {
            jQuery('.alert-success-div > p').html('');
        });
    }


    $scope.getError = function (error, name) {
        if (angular.isDefined(error)) {
            if (error.required && name == 'name') {
                return "Please enter name";
            } else if (error.email && name == 'address') {
                return "Please enter valid address";
            } else if (error.required && name == 'postal') {
                return "Please enter postcode";
            } 
            //else if (error.required && name == 'designation') {
//                return "Please enter designation";
//            } else if (error.required && name == 'email') {
//                return "Please enter email";
//            } else if (error.minlength && name == 'name') {
//                return "Name must be 3 characters long";
//            } else if (error.minlength && name == 'company_name') {
//                return "Company name must be 3 characters long";
//            } else if (error.minlength && name == 'designation') {
//                return "Designation must be 3 characters long";
//            }
        }
    }

    $scope.getGeoCode = function()
    {
        var b = $scope.tempContractor.address + " "+ $scope.tempContractor.postal ;
        var c = new GoogleGeocode, d = b;
        c.geocode(d, function (a) {
            if (null !== a) {
                var b = a.latitude, c = a.longitude;
                //alert(b+' '+c);
                $scope.$apply(function(){
                    $scope.tempContractor.lat = b;
                    $scope.tempContractor.lng = c;
             })
            } else
                alert("ERROR! Unable to geocode address")
        })
    }



});

