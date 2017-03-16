const {getArray, splitEvery} = require('../utils')

function getMatch (team1, team2) {
  return {
    team1: team1,
    team2: team2
  }
}

function getRound (entrantsNumber) {
  const entrants = getArray(entrantsNumber, null)
  let round = {
    matches: [],
    nextRound: null
  }

  splitEvery(2, entrants).forEach(function (teams) {
    round.matches.push(
      getMatch(teams[0], teams[1] || null)
    )
  })

  if (round.matches.length !== 1) {
    round.nextRound = getRound(
      round.matches.length % 2 === 0
        ? round.matches.length
        : round.matches.length + 1
    )
  }

  return round
}

function singleEliminationScaffold (entrantsNumber) {
  return getRound(entrantsNumber)
}

function getNumberOfByes (entrantsNumber) {
  let i = 2
  while (i < entrantsNumber) {
    i = Math.pow(i, 2)
  }
  return i - entrantsNumber
}

function populateSingleEliminationScaffold (entrants) {
  const scaffold = singleEliminationScaffold(entrants.length)
  const numberOfByes = getNumberOfByes(entrants.length)

  const roundOne = scaffold.matches
  const roundTwo = scaffold.nextRound.matches

  let matchNumber = 0
  for (let i = 0; i < (entrants.length - numberOfByes); i++) {
    let team = (i % 2 === 0) ? 'team1' : 'team2'
    roundOne[matchNumber][team] = entrants[i]
    if (team === 'team2') {
      matchNumber++
    }
  }

  // delete all matches in roundOne that no longer have any participants
  scaffold.matches = roundOne.filter(function (match) {
    return (match.team1 !== null || match.team2 !== null)
  })

  // then, according to the number of byes, bump them up to round two
  matchNumber = 0
  for (let i = (entrants.length - numberOfByes); i < entrants.length; i++) {
    if (!roundTwo[matchNumber]) {
      roundTwo[matchNumber] = {team1: null, team2: null}
    }
    roundTwo[matchNumber].team1 = entrants[i]
    matchNumber++
  }

  return scaffold
}

exports.getSingleElimination = function (entrants) {
  if (entrants.length > 3) {
    return null
  }

  return populateSingleEliminationScaffold(entrants)
}
