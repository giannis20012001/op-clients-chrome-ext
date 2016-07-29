angular.module('notifications', [])
    .factory("notificationService", function ($rootScope) {


        var notifications = [
            {
                id: 0,
                sender: "WatchDog",
                title: "Warning!",
                content: "Please review your Facebook settings.",
                type: "alert-warning"
            },
            {
                id: 1,
                sender: "WatchDog",
                title: "Well done!",
                content: "Your LinkedIn privacy settings were successfully applied!",
                type: "alert-success"
            },
            {
                id: 2,
                sender: "WatchDog",
                title: "Heads up!",
                content: "A new privacy setting is available for Twitter!",
                type: "alert-info"
            },
            {
                id: 3,
                sender: "WatchDog",
                title: "First scan!",
                content: "Please perform a social network privacy settings scan in order to help you to apply the suitable settings.",
                type: "alert-info"
            }
        ];

        /*  var getNotifications = function(){
         return notifications;
         }*/

        var hideNotification = function (notificationId) {
            for (var i = 0; i < notifications.length; i++) {
                if (notifications[i].id == notificationId) {
                    notifications.splice(i, 1);
                    $rootScope.$broadcast("notifications", notifications);
                    break;

                }
            }
        }


        return {
            notifications: notifications,
            hideNotification: hideNotification
        }

    });


angular.module('notifications')
    .directive('notificationCounter', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            link: function ($scope) {

            },
            controller: function ($scope, notificationService) {
                $scope.notifications = {};
                $scope.notifications.counter = notificationService.notifications.length;

                $scope.$on('notifications', function (event, notifications) {
                    console.log(notifications);
                    $scope.notifications.counter = notifications.length;
                });
            },
            templateUrl: '/operando/tpl/notifications/notification-counter.html'
        }
    });


angular.module('notifications').
    directive('notifications', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            link: function ($scope) {

            },
            controller: function ($scope, notificationService) {
                $scope.notifications = notificationService.notifications;

                $scope.$on('notifications', function (event, notifications) {
                    $scope.notifications.counter = notifications;
                });

            },
            templateUrl: '/operando/tpl/notifications/notifications.html'
        }
    })
    .directive('notification', function () {
        return {

            restrict: 'E',
            replace: true,
            scope: {notification: "="},
            link: function ($scope) {

            },
            controller: function ($scope, notificationService) {

                $scope.hideNotification = function () {
                    notificationService.hideNotification($scope.notification.id);
                }

            },
            templateUrl: '/operando/tpl/notifications/notification.html'
        }
    });



