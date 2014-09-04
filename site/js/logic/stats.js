angular
    .module('logic')
    .factory('stats', function () {
        return {
            getDeckMetagameShare: function (deck, allDecks) {
                var totalShare = _.reduce(allDecks, function(sum, deck) {
                    return sum += _.parseInt(deck.share);
                }, 0);
                return _.parseInt(deck.share)/totalShare;
            },

            getDeckTournamentWinRate: function (tournaments, deck) {
                var winners = 0;
                var total = 0;
                _.each(tournaments, function (tournament) {
                    total++;
                    var winner = _.find(tournament, function(player) {
                        return player.win;
                    });
                    if (winner.deck === deck) {
                        winners++;
                    }
                });
                return winners/total;
            },

            getDeckTop8Rate: function (tournaments, deck) {
                var top8s = 0;
                var total = 0;
                _.each(tournaments, function (tournament) {
                    total++;
                    var top8 = _.filter(tournament, function(player) {
                        return player.top8;
                    });
                    _.each(top8, function (player) {
                        if (player.deck === deck) {
                            top8s++;
                        }
                    });
                });
                return top8s/total;
            },

            getDeckTournamentWinRateAdjustedForPopularity: function (tournaments, deck, allDecks) {
                return this.getDeckTournamentWinRate(tournaments, deck) /
                    this.getDeckMetagameShare(deck, allDecks);
            }
        };
    });
