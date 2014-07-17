angular
    .module('logic')
    .service('simulator', function () {
        this.runExperiment = function (decks, trials) {
            var tournaments = [];
            var settings = {
                rounds: 8,
                top8: true
            };
            for (var i = 0; i < trials; i++) {
                var players = generatePlayers(decks);
                var tournament = runTournament(players, decks, settings);
                console.log('trny');
                console.log(tournament);
                tournaments.push(tournament);
            }
            return tournaments;
        };

        var generatePlayers = function (decks) {
            var players = [];
            _.each(decks, function (deck) {
                for (var i = 0; i < deck.share; i++) {
                    var player = {
                        deck: deck,
                        points: 0,
                        opponents: []
                    };
                    players.push(player);
                }
            });
            return players;
        };

        var runTournament = function (players, decks, settings) {
            for (var round = 1; round <= settings.rounds; round++) {
                var pairings = makePairings(players);
                playMatches(pairings);
            }
            var top8 = makeCut(players, 8);
            playTop8(top8);
            return players;
        };

        var makePairings = function (players) {
            var pairings = [];
            players = _.shuffle(players);
            players.sort(comparePlayers);
            var processedPlayers = 0;
            while (processedPlayers + 2 <= players.length) {
                var pairing = {
                    p1: players[processedPlayers],
                    p2: players[processedPlayers + 1]
                };
                pairings.push(pairing);
                processedPlayers += 2;
            };
            if (processedPlayers + 1 === players.length) { // bye
                pairings.push({
                    p1: players[processedPlayers]
                });
            }

            return pairings;
        };

        var comparePlayers = function (p1, p2) {
            return p2.points - p1.points;
        };

        var playMatches = function (pairings) {
            _.each(pairings, function (pairing) {
                if (pairing.p2 === undefined) {
                    pairing.p1.points += 3;
                    return;
                }

                pairing.p1.opponents.push(pairing.p2);
                pairing.p2.opponents.push(pairing.p1);
                var winner = determineWinner(pairing);
                winner.points += 3;
            });
        };

        var determineWinner = function (pairing) {
            var deck1 = pairing.p1.deck;
            var deck2 = pairing.p2.deck;
            var p1WinRate = deck1.matchups[deck2.id] / 100;
            var result = Math.random() < p1WinRate ? pairing.p1 : pairing.p2;
            return result;
        };

        var makeCut = function (players, count) {
            players.sort(comparePlayers);
            return _.first(players, count);
        };

        var playTop8 = function (top8) {
            _.each(top8, function(player) {
                player.top8 = true;
            });
            while (top8.length > 1) {
                var pairings = makeTopPairings(top8);
                var winners = _.map(pairings, determineWinner);
                top8 = winners;
            }

            top8[0].win = true;
        };

        var makeTopPairings = function (top) {
            var pairings = [];
            var size = top.length / 2;
            var topHalf = _.first(top, size);
            var bottomHalf = _.last(top, size).reverse();
            var pairsOfPlayers = _.zip(topHalf, bottomHalf);
            pairings = _.map(pairsOfPlayers, function (pair) {
                return _.zipObject(['p1', 'p2'], pair);
            });
            return pairings;
        };
    });