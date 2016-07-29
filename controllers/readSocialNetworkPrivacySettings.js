angular.module("operando").
controller("readSocialNetworkPrivacySettings", ["$scope","$state", function($scope, $state){
    var osps = getOSPs();

    $scope.osps = [];
    osps.forEach(function(osp){
        $scope.osps.push({
            key:osp.toLowerCase(),
            title:osp,
            settings:getOSPSettings(osp)
        });
    });

    $scope.isItemIncluded = function (item) {
        return $state.$current.locals.globals.sn === item;
    }
}]);



