angular
    .module('logic')
    .service('simulator', function () {
        this.runExperiment = function (decks, trials) {
            var tournaments = [];
            var settings = {
                rounds: 2,
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
            return p1.points > p2.points;
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
    });