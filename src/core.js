import {
    List,
    Map
} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
    return state.set('entries', List(entries));
}

export function next(state) {
    const entries = state.get('entries');
    const tally = state.getIn(['vote', 'tally']);
    const winners = getWinners(tally);
    const nextEntries = entries.concat(winners);
    if (nextEntries.size === 1) {
        return state.remove('vote')
            .remove('entries')
            .set('winner', nextEntries.first())
    }
    return state.merge({
        vote: Map({
            pair: entries.take(2)
        }),
        entries: nextEntries.skip(2)
    });
}

function getWinners(tally) {
    if (!tally) {
        return List();
    }
    return tally.reduce((aggregator, score, title) => {
        if (score > aggregator.maxScore) {
            aggregator.maxScore = score;
            aggregator.winners = List.of(title);
        } else if (score === aggregator.maxScore) {
            aggregator.winners = aggregator.winners.push(title);
        }
        return aggregator;
    }, {
        maxScore: 0
    }).winners;
}

export function vote(voteState, entry) {
    return voteState.updateIn(
        ['tally', entry],
        0,
        tally => tally + 1);
}
