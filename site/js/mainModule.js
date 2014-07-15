angular
    .module('main')
    .controller('deckInputController', ['$scope', function ($scope) {
        $scope.decks = [];
        $scope.addDeck = function () {
            $scope.decks.push({
                name: '',
                share: ''
            });
        };

        $scope.selectDeck = function (deck) {
            $scope.selectedDeck = deck;
        };

        $scope.deckIsSelected = function (deck) {
            return $scope.selectedDeck === deck;
        }
    }]);