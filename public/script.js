(function(){

    var imageboard = angular.module('imageboard', ["imageboard.routes"])

    .controller ('imageList', ($scope, $http, $state) => {

        $http.get('/images').then((resp)=> {
            $scope.images = resp.data;
            $scope.file = {};
        });

        $scope.submit = () => {

            console.log("running submit!");

            var file = $('input[type="file"]').get(0).files[0]; //this line is selecting one image out of the file of images
            var title = $scope.title;
            var username = $scope.username;
            var description = $scope.description;

            var formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('username', username);
            formData.append('description', description);

            $http({
                url: '/upload',
                data: formData,
                method: "POST",
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            })
            .then(() => {
                $state.reload();
                console.log("it worked!");
            });
        };
    });
})();
