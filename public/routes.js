
angular.module('imageboard.routes', ['ui.router'])
.config(function($stateProvider){

    $stateProvider

    .state ('home', {
        url: '/',
        views: {
            'main': {
                templateUrl: 'views/main.html',
                controller: function() {
                    console.log("hello! I am your home state");
                }
            }
        }
    })

    .state ('about', {
        url: '/about',
        views: {
            'main': {
                templateUrl: 'views/about.html'
            }
        }
    })

    .state ('singleImage', {
        url: '/image/:imageId',
        views: {
            'main': {
                templateUrl: 'views/singleImage.html',
                controller: function($stateParams, $http, $scope, $state){

                    // getting the image in comments
                    $http({
                        url: '/info/images/' + $stateParams.imageId,
                        method: "GET"
                    })

                    .then((results) => {
                        $scope.imageInfo = results.data;
                        console.log("IMAGEINFO:", $scope.imageInfo);

                        $http({
                            url: '/info/comments/' +  $stateParams.imageId,
                            method: "GET"
                        })
                        .then((results) => {

                            $scope.comments = results.data;
                            $scope.limit = 5;
                            $scope.loadMore = function() {
                                $scope.limit = $scope.limit + 5;
                                $state.reload();
                            }
                        })
                    })
                    .catch((err) => {
                        console.log("singleImage state:", err);
                    });

                    $scope.submitComment = function () {

                        $http({
                            url: '/info/comments/' + $stateParams.imageId,
                            method: "POST",
                            data: {
                                comments:$scope.comment,
                                author:$scope.author
                            }
                        })
                        .then(() => {
                            console.log("Succesfully logged comments");

                        })

                        $http({
                            url: 'info/comments' + $stateProvider.imageId,
                            method: "GET"
                        })
                        .then((results) => {
                            console.log("inside of the get function of our http get request", results);
                            $state.reload();
                        }) //here
                    }
                }//closes controller
            }//closes main
        }//closes views
    });//closes state single image
});//closes stateprovider
