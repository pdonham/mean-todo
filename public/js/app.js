(function () {
    'use strict';
    var theApp =
        angular.module('app', [
            'ngAnimate',        // animations
            'ngRoute',          // routing
            'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
            'ngResource',
            'app.controllers',
            'app.directives',
            'app.services'
        ]);

    //fetchData sets up a constant, CONFIG, which is visible across the angular app
    //Once CONFIG has been created and added to the angular app as a constant,
    //tell angular to go ahead and start the application

    //This solves a sync problem...if we just call for the config API and do not wait
    //angular will continue on (that is a feature...non-blocking) and probably not see the
    //config come back

    //Note that this requires us to remove ng-app from the HTML frame in order to force bootstrapping to be manual

    fetchData().then(bootstrapApplication);


    function fetchData() {
        var initInjector = angular.injector(["ng"]);
        var $http = initInjector.get("$http");
        return $http.get('/todo/config').then(function (response) {
            theApp.constant('CONFIG', response.data);
        }, function (errorResponse) {
            // Handle error case...probably want to retry or display error message
        });
    }

    function bootstrapApplication() {
        angular.element(document).ready(function () {
            angular.bootstrap(document, ["app"]);
        });
    }


    angular.module('app.controllers', []);
    angular.module('app.directives', []);
    angular.module('app.services', []);

}());