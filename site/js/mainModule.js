angular
    .module('main')
    .controller('deckInputController', ['$scope', function ($scope) {
        $scope.decks = [];

        var id = 0;

        var nextId = function () {
            id++;
            return id;
        };

        $scope.addDeck = function () {
            var newDeck = {
                id: nextId(),
                name: '',
                share: '',
                matchups: {}
            };

            _.each($scope.decks, function (deck) {
                newDeck.matchups[deck.id] = 50;
                deck.matchups[newDeck.id] = 50;
            });

            $scope.decks.push(newDeck);
        };

        $scope.selectDeck = function (deck) {
            $scope.selectedDeck = deck;
        };

        $scope.deckIsSelected = function (deck) {
            return $scope.selectedDeck === deck;
        };

        $scope.unselectedDecks = function () {
            return _.filter($scope.decks, function (deck) {
                return deck !== $scope.selectedDeck;
            })
        }

        $scope.syncMatchup = function (deck, otherDeck) {
            otherDeck.matchups[deck.id] = 100 - deck.matchups[otherDeck.id];
        };
    }]);