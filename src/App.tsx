import React, { useMemo, useState } from 'react'

type Player = {
  name: string
  position: string
  role: string
  offense: number
  defense: number
  playmaking: number
  rebounding: number
  stamina: number
  favoriteAreas: string[]
  systemsFit: string[]
  offenseProfileKey: OffensiveProfileKey
  defenseProfileKey: DefensiveProfileKey
}

type SystemProfile = {
  name: string
  offenseWeight: number
  defenseWeight: number
  playmakingWeight: number
  reboundingWeight: number
  spacingBonusAreas: string[]
  roleNeeds: string[]
}

type PrepFocus = {
  name: string
  description: string
  offenseBoost: number
  defenseBoost: number
  counterBoost: number
  varianceMultiplier: number
}

type OffensiveProfileKey =
  | 'Spot Up Shooter'
  | 'Secondary Ball Handler'
  | 'Primary Ball Handler'
  | 'Rollman'
  | 'Versatile Big'
  | 'Movement Ball Handler'
  | 'Movement Shooter'
  | 'Connector'

type DefensiveProfileKey =
  | 'Rim Protector'
  | 'On-Ball Guard'
  | 'Versatile Wing'
  | 'Switch Big'
  | 'Help Defender'

type OffensiveProfileRaw = {
  usageRate: number
  assistRate: number
  pickAndRollBallHandler: number
  rollMan: number
  spotUp: number
  postUp: number
  isolation: number
  handoff: number
  cut: number
  offScreen: number
  putback: number
  transition: number
}

type DefensiveProfileRaw = {
  craftedDpm: number
  deflections: number
  defensiveReboundRate: number
  stealRate: number
  blockRate: number
  versatility: number
  matchupDifficulty: number
  guarding: {
    dpg: number
    dsg: number
    dsf: number
    dpf: number
    dc: number
  }
}

type OffensiveProfile = {
  usageRate: number
  assistRate: number
  pickAndRollBallHandler: number
  rollMan: number
  spotUp: number
  postUp: number
  isolation: number
  handoff: number
  cut: number
  offScreen: number
  putback: number
  transition: number
}

type DefensiveProfile = {
  craftedDpm: number
  deflections: number
  defensiveReboundRate: number
  stealRate: number
  blockRate: number
  versatility: number
  matchupDifficulty: number
  guarding: {
    dpg: number
    dsg: number
    dsf: number
    dpf: number
    dc: number
  }
}

type OffenseStyle = {
  pickAndRollBallHandler: number
  rollMan: number
  spotUp: number
  postUp: number
  isolation: number
  handoff: number
  cut: number
  offScreen: number
  putback: number
  transition: number
}

type DefenseStyle = {
  rimProtection: number
  perimeterPressure: number
  switchability: number
  rebounding: number
  playDisruption: number
}

const offensiveSystems: (SystemProfile & { playStyle: OffenseStyle })[] = [
  {
    name: '5 Out Motion Offense',
    offenseWeight: 1.15,
    defenseWeight: 0.95,
    playmakingWeight: 1.2,
    reboundingWeight: 0.9,
    spacingBonusAreas: ['Corner', 'Wing', 'Slot'],
    roleNeeds: ['Playmaker', 'Movement Shooter', 'Stretch Big'],
    playStyle: {
      pickAndRollBallHandler: 1.2,
      rollMan: 0.6,
      spotUp: 1.4,
      postUp: 0.4,
      isolation: 0.8,
      handoff: 1.1,
      cut: 1.2,
      offScreen: 1.1,
      putback: 0.6,
      transition: 1.1,
    },
  },
  {
    name: 'Horns Offense',
    offenseWeight: 1.05,
    defenseWeight: 1,
    playmakingWeight: 1.05,
    reboundingWeight: 1.05,
    spacingBonusAreas: ['High Post', 'Wing'],
    roleNeeds: ['Point Forward', 'Roll Big', 'Shot Creator'],
    playStyle: {
      pickAndRollBallHandler: 1.2,
      rollMan: 1.2,
      spotUp: 1,
      postUp: 1.1,
      isolation: 1,
      handoff: 1,
      cut: 0.9,
      offScreen: 0.8,
      putback: 0.9,
      transition: 0.9,
    },
  },
  {
    name: 'Triangle Offense',
    offenseWeight: 1.1,
    defenseWeight: 0.98,
    playmakingWeight: 1.1,
    reboundingWeight: 1.05,
    spacingBonusAreas: ['Low Post', 'Corner'],
    roleNeeds: ['Post Scorer', 'Wing Shooter', 'Connector'],
    playStyle: {
      pickAndRollBallHandler: 0.7,
      rollMan: 0.9,
      spotUp: 1.2,
      postUp: 1.3,
      isolation: 1,
      handoff: 0.8,
      cut: 1.1,
      offScreen: 1,
      putback: 1.1,
      transition: 0.8,
    },
  },
]

const defensiveSystems: (SystemProfile & { defenseStyle: DefenseStyle })[] = [
  {
    name: 'Pack Line Defense',
    offenseWeight: 0.96,
    defenseWeight: 1.2,
    playmakingWeight: 0.95,
    reboundingWeight: 1.1,
    spacingBonusAreas: ['Paint', 'Nail'],
    roleNeeds: ['Anchor Big', 'Point of Attack', 'Help Defender'],
    defenseStyle: {
      rimProtection: 1.3,
      perimeterPressure: 0.9,
      switchability: 0.8,
      rebounding: 1.2,
      playDisruption: 0.9,
    },
  },
  {
    name: 'Switch Defense',
    offenseWeight: 1,
    defenseWeight: 1.12,
    playmakingWeight: 0.98,
    reboundingWeight: 1,
    spacingBonusAreas: ['Perimeter', 'Wing'],
    roleNeeds: ['Versatile Wing', 'Rim Protector', 'On-ball Stopper'],
    defenseStyle: {
      rimProtection: 1,
      perimeterPressure: 1.2,
      switchability: 1.4,
      rebounding: 0.9,
      playDisruption: 1.1,
    },
  },
  {
    name: '2-3 Zone Defense',
    offenseWeight: 0.97,
    defenseWeight: 1.15,
    playmakingWeight: 0.96,
    reboundingWeight: 1.05,
    spacingBonusAreas: ['Paint', 'Corner'],
    roleNeeds: ['Long Wing', 'Shot Blocker', 'Rebounder'],
    defenseStyle: {
      rimProtection: 1.2,
      perimeterPressure: 0.7,
      switchability: 0.7,
      rebounding: 1.1,
      playDisruption: 1,
    },
  },
]

const prepFocuses: PrepFocus[] = [
  {
    name: 'Film Study',
    description: 'Prioritize scouting reports and counters for opponent actions.',
    offenseBoost: 1.8,
    defenseBoost: 1.5,
    counterBoost: 2,
    varianceMultiplier: 0.85,
  },
  {
    name: 'Pace Control',
    description: 'Slow the game down and emphasize execution to cut volatility.',
    offenseBoost: 0.8,
    defenseBoost: 2,
    counterBoost: 0.8,
    varianceMultiplier: 0.75,
  },
  {
    name: 'Physicality',
    description: 'Lean on defense, rebounding, and toughness to wear teams down.',
    offenseBoost: 0.6,
    defenseBoost: 2.4,
    counterBoost: 0.6,
    varianceMultiplier: 0.9,
  },
  {
    name: 'Quick Strike',
    description: 'Push tempo and spacing early to generate offensive edges.',
    offenseBoost: 2.4,
    defenseBoost: 0.4,
    counterBoost: 1,
    varianceMultiplier: 1.05,
  },
]

const offensiveProfiles: Record<OffensiveProfileKey, OffensiveProfileRaw> = {
  'Spot Up Shooter': {
    usageRate: 16.4,
    assistRate: 11.7,
    pickAndRollBallHandler: 2.7,
    rollMan: 6.1,
    spotUp: 32.1,
    postUp: 1.5,
    isolation: 0.9,
    handoff: 1.4,
    cut: 11,
    offScreen: 0.8,
    putback: 8.5,
    transition: 17.9,
  },
  'Secondary Ball Handler': {
    usageRate: 18.2,
    assistRate: 28.4,
    pickAndRollBallHandler: 22.9,
    rollMan: 1.1,
    spotUp: 24.3,
    postUp: 0.7,
    isolation: 3.5,
    handoff: 1.7,
    cut: 2.7,
    offScreen: 0.3,
    putback: 1,
    transition: 23.1,
  },
  'Primary Ball Handler': {
    usageRate: 26.9,
    assistRate: 34.9,
    pickAndRollBallHandler: 32.2,
    rollMan: 0.7,
    spotUp: 13.3,
    postUp: 3.1,
    isolation: 14.8,
    handoff: 5.4,
    cut: 1.7,
    offScreen: 2.6,
    putback: 0.9,
    transition: 20.1,
  },
  Rollman: {
    usageRate: 13.9,
    assistRate: 12.8,
    pickAndRollBallHandler: 0,
    rollMan: 20.9,
    spotUp: 3,
    postUp: 2.8,
    isolation: 0.2,
    handoff: 0,
    cut: 25.6,
    offScreen: 0,
    putback: 17.5,
    transition: 19.1,
  },
  'Versatile Big': {
    usageRate: 22.7,
    assistRate: 18.5,
    pickAndRollBallHandler: 3,
    rollMan: 16.1,
    spotUp: 16.3,
    postUp: 15.6,
    isolation: 5.3,
    handoff: 0.6,
    cut: 11.6,
    offScreen: 1.5,
    putback: 8.6,
    transition: 18.3,
  },
  'Movement Ball Handler': {
    usageRate: 22.4,
    assistRate: 23,
    pickAndRollBallHandler: 25.3,
    rollMan: 0.5,
    spotUp: 22,
    postUp: 0.3,
    isolation: 6.1,
    handoff: 8.8,
    cut: 2.4,
    offScreen: 4,
    putback: 1.4,
    transition: 20.3,
  },
  'Movement Shooter': {
    usageRate: 17.8,
    assistRate: 12.4,
    pickAndRollBallHandler: 7.9,
    rollMan: 2.7,
    spotUp: 31.6,
    postUp: 0.6,
    isolation: 1,
    handoff: 10.2,
    cut: 2.5,
    offScreen: 11.4,
    putback: 1.2,
    transition: 18.7,
  },
  Connector: {
    usageRate: 16.4,
    assistRate: 11.7,
    pickAndRollBallHandler: 2.7,
    rollMan: 6.1,
    spotUp: 32.1,
    postUp: 1.5,
    isolation: 1,
    handoff: 1.4,
    cut: 11,
    offScreen: 0.8,
    putback: 8.5,
    transition: 17.9,
  },
}

const defensiveProfiles: Record<DefensiveProfileKey, DefensiveProfileRaw> = {
  'Rim Protector': {
    craftedDpm: 3.1,
    deflections: 2.1,
    defensiveReboundRate: 27.4,
    stealRate: 1.2,
    blockRate: 5.6,
    versatility: 3.4,
    matchupDifficulty: 3.2,
    guarding: {
      dpg: 6,
      dsg: 8,
      dsf: 18,
      dpf: 30,
      dc: 38,
    },
  },
  'On-Ball Guard': {
    craftedDpm: 1.5,
    deflections: 3.8,
    defensiveReboundRate: 12.6,
    stealRate: 2.7,
    blockRate: 0.6,
    versatility: 4,
    matchupDifficulty: 4,
    guarding: {
      dpg: 40,
      dsg: 30,
      dsf: 15,
      dpf: 10,
      dc: 5,
    },
  },
  'Versatile Wing': {
    craftedDpm: 2.2,
    deflections: 3.2,
    defensiveReboundRate: 16.4,
    stealRate: 1.9,
    blockRate: 1.6,
    versatility: 4.6,
    matchupDifficulty: 4.2,
    guarding: {
      dpg: 20,
      dsg: 25,
      dsf: 30,
      dpf: 20,
      dc: 5,
    },
  },
  'Switch Big': {
    craftedDpm: 2.5,
    deflections: 2.6,
    defensiveReboundRate: 22.1,
    stealRate: 1.5,
    blockRate: 3,
    versatility: 4.3,
    matchupDifficulty: 3.8,
    guarding: {
      dpg: 12,
      dsg: 15,
      dsf: 28,
      dpf: 25,
      dc: 20,
    },
  },
  'Help Defender': {
    craftedDpm: 2.7,
    deflections: 2.8,
    defensiveReboundRate: 19.5,
    stealRate: 1.6,
    blockRate: 2.4,
    versatility: 4.1,
    matchupDifficulty: 3.4,
    guarding: {
      dpg: 16,
      dsg: 18,
      dsf: 26,
      dpf: 25,
      dc: 15,
    },
  },
}

const players: Player[] = [
  {
    name: 'Darius Vale',
    position: 'PG',
    role: 'Playmaker',
    offense: 88,
    defense: 74,
    playmaking: 92,
    rebounding: 50,
    stamina: 86,
    favoriteAreas: ['Slot', 'Wing'],
    systemsFit: ['5 Out Motion Offense', 'Horns Offense'],
    offenseProfileKey: 'Primary Ball Handler',
    defenseProfileKey: 'On-Ball Guard',
  },
  {
    name: 'Malik Crest',
    position: 'SG',
    role: 'Movement Shooter',
    offense: 90,
    defense: 72,
    playmaking: 76,
    rebounding: 58,
    stamina: 84,
    favoriteAreas: ['Corner', 'Wing'],
    systemsFit: ['5 Out Motion Offense', 'Triangle Offense'],
    offenseProfileKey: 'Movement Shooter',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Jaxon Reed',
    position: 'SF',
    role: 'Versatile Wing',
    offense: 82,
    defense: 86,
    playmaking: 78,
    rebounding: 72,
    stamina: 88,
    favoriteAreas: ['Wing', 'Nail'],
    systemsFit: ['Switch Defense', 'Pack Line Defense'],
    offenseProfileKey: 'Connector',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Theo Knox',
    position: 'PF',
    role: 'Stretch Big',
    offense: 84,
    defense: 80,
    playmaking: 70,
    rebounding: 78,
    stamina: 82,
    favoriteAreas: ['High Post', 'Slot'],
    systemsFit: ['5 Out Motion Offense', 'Horns Offense'],
    offenseProfileKey: 'Versatile Big',
    defenseProfileKey: 'Switch Big',
  },
  {
    name: 'Benson Roane',
    position: 'C',
    role: 'Anchor Big',
    offense: 76,
    defense: 90,
    playmaking: 62,
    rebounding: 90,
    stamina: 80,
    favoriteAreas: ['Low Post', 'Paint'],
    systemsFit: ['Pack Line Defense', '2-3 Zone Defense'],
    offenseProfileKey: 'Rollman',
    defenseProfileKey: 'Rim Protector',
  },
  {
    name: 'Quinn Morales',
    position: 'PG',
    role: 'Shot Creator',
    offense: 86,
    defense: 72,
    playmaking: 84,
    rebounding: 44,
    stamina: 82,
    favoriteAreas: ['Slot', 'Wing'],
    systemsFit: ['Horns Offense', 'Triangle Offense'],
    offenseProfileKey: 'Primary Ball Handler',
    defenseProfileKey: 'On-Ball Guard',
  },
  {
    name: 'Arlo Hunter',
    position: 'SG',
    role: '3-and-D Player',
    offense: 78,
    defense: 85,
    playmaking: 68,
    rebounding: 62,
    stamina: 90,
    favoriteAreas: ['Corner', 'Wing'],
    systemsFit: ['Switch Defense', '5 Out Motion Offense'],
    offenseProfileKey: 'Spot Up Shooter',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Miles Hart',
    position: 'SF',
    role: 'Connector',
    offense: 80,
    defense: 80,
    playmaking: 82,
    rebounding: 70,
    stamina: 86,
    favoriteAreas: ['Wing', 'Slot'],
    systemsFit: ['Triangle Offense', 'Pack Line Defense'],
    offenseProfileKey: 'Connector',
    defenseProfileKey: 'Help Defender',
  },
  {
    name: 'Ronan Bishop',
    position: 'PF',
    role: 'Roll Big',
    offense: 78,
    defense: 82,
    playmaking: 64,
    rebounding: 86,
    stamina: 84,
    favoriteAreas: ['Paint', 'High Post'],
    systemsFit: ['Horns Offense', '2-3 Zone Defense'],
    offenseProfileKey: 'Rollman',
    defenseProfileKey: 'Switch Big',
  },
  {
    name: 'Isaiah Vaughn',
    position: 'C',
    role: 'Rim Protector',
    offense: 72,
    defense: 92,
    playmaking: 54,
    rebounding: 92,
    stamina: 79,
    favoriteAreas: ['Paint', 'Low Post'],
    systemsFit: ['Pack Line Defense', '2-3 Zone Defense'],
    offenseProfileKey: 'Rollman',
    defenseProfileKey: 'Rim Protector',
  },
  {
    name: 'Elliot Knox',
    position: 'PG',
    role: 'Point of Attack',
    offense: 76,
    defense: 86,
    playmaking: 80,
    rebounding: 52,
    stamina: 90,
    favoriteAreas: ['Slot', 'Nail'],
    systemsFit: ['Switch Defense', 'Pack Line Defense'],
    offenseProfileKey: 'Secondary Ball Handler',
    defenseProfileKey: 'On-Ball Guard',
  },
  {
    name: 'Carter Wynn',
    position: 'SG',
    role: 'Movement Shooter',
    offense: 88,
    defense: 70,
    playmaking: 72,
    rebounding: 54,
    stamina: 83,
    favoriteAreas: ['Corner', 'Wing'],
    systemsFit: ['5 Out Motion Offense', 'Triangle Offense'],
    offenseProfileKey: 'Movement Shooter',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Zion Mercer',
    position: 'SF',
    role: 'Point Forward',
    offense: 84,
    defense: 78,
    playmaking: 86,
    rebounding: 74,
    stamina: 85,
    favoriteAreas: ['High Post', 'Wing'],
    systemsFit: ['Horns Offense', 'Switch Defense'],
    offenseProfileKey: 'Secondary Ball Handler',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Devin Chase',
    position: 'PF',
    role: 'Rebounder',
    offense: 74,
    defense: 84,
    playmaking: 62,
    rebounding: 88,
    stamina: 81,
    favoriteAreas: ['Paint', 'Low Post'],
    systemsFit: ['2-3 Zone Defense', 'Pack Line Defense'],
    offenseProfileKey: 'Versatile Big',
    defenseProfileKey: 'Help Defender',
  },
  {
    name: 'Silas Rowe',
    position: 'C',
    role: 'Post Scorer',
    offense: 82,
    defense: 78,
    playmaking: 60,
    rebounding: 86,
    stamina: 78,
    favoriteAreas: ['Low Post', 'Paint'],
    systemsFit: ['Triangle Offense', 'Horns Offense'],
    offenseProfileKey: 'Versatile Big',
    defenseProfileKey: 'Switch Big',
  },
  {
    name: 'Jalen Pierce',
    position: 'PG',
    role: 'Playmaker',
    offense: 84,
    defense: 76,
    playmaking: 88,
    rebounding: 46,
    stamina: 87,
    favoriteAreas: ['Slot', 'Wing'],
    systemsFit: ['5 Out Motion Offense', 'Horns Offense'],
    offenseProfileKey: 'Primary Ball Handler',
    defenseProfileKey: 'On-Ball Guard',
  },
  {
    name: 'Kobe Rivers',
    position: 'SG',
    role: 'Shot Creator',
    offense: 87,
    defense: 73,
    playmaking: 78,
    rebounding: 52,
    stamina: 82,
    favoriteAreas: ['Wing', 'Corner'],
    systemsFit: ['Triangle Offense', '5 Out Motion Offense'],
    offenseProfileKey: 'Movement Ball Handler',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Aiden Frost',
    position: 'SF',
    role: 'Long Wing',
    offense: 79,
    defense: 88,
    playmaking: 70,
    rebounding: 76,
    stamina: 88,
    favoriteAreas: ['Wing', 'Nail'],
    systemsFit: ['2-3 Zone Defense', 'Switch Defense'],
    offenseProfileKey: 'Connector',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Troy Benton',
    position: 'PF',
    role: 'Stretch Big',
    offense: 83,
    defense: 76,
    playmaking: 68,
    rebounding: 78,
    stamina: 83,
    favoriteAreas: ['High Post', 'Corner'],
    systemsFit: ['5 Out Motion Offense', 'Triangle Offense'],
    offenseProfileKey: 'Versatile Big',
    defenseProfileKey: 'Switch Big',
  },
  {
    name: 'Micah Stone',
    position: 'C',
    role: 'Anchor Big',
    offense: 74,
    defense: 91,
    playmaking: 58,
    rebounding: 94,
    stamina: 77,
    favoriteAreas: ['Paint', 'Low Post'],
    systemsFit: ['Pack Line Defense', '2-3 Zone Defense'],
    offenseProfileKey: 'Rollman',
    defenseProfileKey: 'Rim Protector',
  },
  {
    name: 'Julian Wolfe',
    position: 'PG',
    role: 'Playmaker',
    offense: 81,
    defense: 74,
    playmaking: 86,
    rebounding: 48,
    stamina: 85,
    favoriteAreas: ['Slot', 'Wing'],
    systemsFit: ['5 Out Motion Offense', 'Horns Offense'],
    offenseProfileKey: 'Secondary Ball Handler',
    defenseProfileKey: 'On-Ball Guard',
  },
  {
    name: 'Dante Knox',
    position: 'SG',
    role: 'Movement Shooter',
    offense: 86,
    defense: 71,
    playmaking: 70,
    rebounding: 50,
    stamina: 84,
    favoriteAreas: ['Corner', 'Wing'],
    systemsFit: ['5 Out Motion Offense', 'Triangle Offense'],
    offenseProfileKey: 'Movement Shooter',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Cole Maddox',
    position: 'SF',
    role: 'Versatile Wing',
    offense: 81,
    defense: 85,
    playmaking: 74,
    rebounding: 72,
    stamina: 86,
    favoriteAreas: ['Wing', 'Nail'],
    systemsFit: ['Switch Defense', 'Pack Line Defense'],
    offenseProfileKey: 'Connector',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Gavin Ricks',
    position: 'PF',
    role: 'Help Defender',
    offense: 72,
    defense: 86,
    playmaking: 64,
    rebounding: 82,
    stamina: 84,
    favoriteAreas: ['Paint', 'Nail'],
    systemsFit: ['Pack Line Defense', '2-3 Zone Defense'],
    offenseProfileKey: 'Versatile Big',
    defenseProfileKey: 'Help Defender',
  },
  {
    name: 'Noah Vance',
    position: 'C',
    role: 'Rebounder',
    offense: 70,
    defense: 88,
    playmaking: 55,
    rebounding: 92,
    stamina: 78,
    favoriteAreas: ['Low Post', 'Paint'],
    systemsFit: ['2-3 Zone Defense', 'Pack Line Defense'],
    offenseProfileKey: 'Rollman',
    defenseProfileKey: 'Rim Protector',
  },
  {
    name: 'Tyrese North',
    position: 'PG',
    role: 'Point of Attack',
    offense: 77,
    defense: 88,
    playmaking: 79,
    rebounding: 50,
    stamina: 90,
    favoriteAreas: ['Slot', 'Nail'],
    systemsFit: ['Switch Defense', 'Pack Line Defense'],
    offenseProfileKey: 'Secondary Ball Handler',
    defenseProfileKey: 'On-Ball Guard',
  },
  {
    name: 'Phoenix Lane',
    position: 'SG',
    role: '3-and-D Player',
    offense: 80,
    defense: 86,
    playmaking: 66,
    rebounding: 60,
    stamina: 88,
    favoriteAreas: ['Corner', 'Wing'],
    systemsFit: ['Switch Defense', '5 Out Motion Offense'],
    offenseProfileKey: 'Spot Up Shooter',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Logan Price',
    position: 'SF',
    role: 'Wing Shooter',
    offense: 85,
    defense: 77,
    playmaking: 72,
    rebounding: 68,
    stamina: 84,
    favoriteAreas: ['Corner', 'Wing'],
    systemsFit: ['Triangle Offense', '5 Out Motion Offense'],
    offenseProfileKey: 'Spot Up Shooter',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Riley Kade',
    position: 'PF',
    role: 'Stretch Big',
    offense: 82,
    defense: 78,
    playmaking: 66,
    rebounding: 80,
    stamina: 83,
    favoriteAreas: ['High Post', 'Slot'],
    systemsFit: ['5 Out Motion Offense', 'Horns Offense'],
    offenseProfileKey: 'Versatile Big',
    defenseProfileKey: 'Switch Big',
  },
  {
    name: 'Ezra Holt',
    position: 'C',
    role: 'Shot Blocker',
    offense: 73,
    defense: 89,
    playmaking: 58,
    rebounding: 90,
    stamina: 79,
    favoriteAreas: ['Paint', 'Low Post'],
    systemsFit: ['2-3 Zone Defense', 'Pack Line Defense'],
    offenseProfileKey: 'Rollman',
    defenseProfileKey: 'Rim Protector',
  },
  {
    name: 'Caleb Starr',
    position: 'PG',
    role: 'Shot Creator',
    offense: 85,
    defense: 73,
    playmaking: 83,
    rebounding: 46,
    stamina: 83,
    favoriteAreas: ['Wing', 'Slot'],
    systemsFit: ['Horns Offense', 'Triangle Offense'],
    offenseProfileKey: 'Movement Ball Handler',
    defenseProfileKey: 'On-Ball Guard',
  },
  {
    name: 'Nico James',
    position: 'SG',
    role: 'Movement Shooter',
    offense: 87,
    defense: 72,
    playmaking: 71,
    rebounding: 52,
    stamina: 82,
    favoriteAreas: ['Corner', 'Wing'],
    systemsFit: ['5 Out Motion Offense', 'Triangle Offense'],
    offenseProfileKey: 'Movement Shooter',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Owen Stiles',
    position: 'SF',
    role: 'Point Forward',
    offense: 83,
    defense: 80,
    playmaking: 84,
    rebounding: 70,
    stamina: 85,
    favoriteAreas: ['High Post', 'Wing'],
    systemsFit: ['Horns Offense', 'Switch Defense'],
    offenseProfileKey: 'Secondary Ball Handler',
    defenseProfileKey: 'Versatile Wing',
  },
  {
    name: 'Hudson Hale',
    position: 'PF',
    role: 'Rebounder',
    offense: 75,
    defense: 85,
    playmaking: 63,
    rebounding: 87,
    stamina: 82,
    favoriteAreas: ['Paint', 'Low Post'],
    systemsFit: ['2-3 Zone Defense', 'Pack Line Defense'],
    offenseProfileKey: 'Rollman',
    defenseProfileKey: 'Help Defender',
  },
  {
    name: 'Grant Sloan',
    position: 'C',
    role: 'Roll Big',
    offense: 78,
    defense: 83,
    playmaking: 60,
    rebounding: 86,
    stamina: 80,
    favoriteAreas: ['Paint', 'High Post'],
    systemsFit: ['Horns Offense', '2-3 Zone Defense'],
    offenseProfileKey: 'Rollman',
    defenseProfileKey: 'Switch Big',
  },
]

const categories = [
  {
    title: 'Offensive Skills',
    sections: [
      {
        title: 'Shooting & Finishing',
        terms: [
          'Shooting',
          'Layup',
          'Dunking',
          'Floater',
          'Fadeaway',
          'Finger Roll',
          'Power Layup',
          'Reverse Layup',
          'Bank Shot',
          'Close-range Shot',
          'Ambidexterity',
          'Catching',
        ],
      },
      {
        title: 'Dribbling & Creation',
        terms: [
          'Dribbling',
          'Dribbling Moves',
          'Crossover Dribble',
          'Behind the Back Dribble',
          'Between the Legs Dribble',
          'Escape Dribble',
          'Speed Dribble',
          'Snake Dribble',
          'Stutter Step',
          'Blow By',
          'Fake and Drive',
        ],
      },
      {
        title: 'Passing & Playmaking',
        terms: [
          'Passing',
          'Hook Pass',
          'Chest Pass',
          'Bounce Pass',
          'Air Pass',
          'Baseball Pass',
          'Behind the Back Pass',
          'Overhead Pass',
          'No Look Pass',
          'Lob Pass',
          'Jump Pass',
          'Kick Pass',
          'Drift Pass',
          'Pocket Pass',
          'Wrap Around Pass',
          'Dribble Pass',
          'Pitch Ahead Pass',
          'Outlet Pass',
          'Inbound Pass',
          'Skip Pass',
        ],
      },
      {
        title: 'Cutting & Screening',
        terms: ['Cutting', 'Screening'],
      },
    ],
  },
  {
    title: 'Defensive Skills',
    sections: [
      {
        title: 'Core Defense',
        terms: [
          'Steal',
          'Block',
          'Closeout Defense',
          'Denial Defense',
          'Chase Down Block',
          'Box Out',
          'Crash the Boards',
        ],
      },
    ],
  },
  {
    title: 'Positions & Roles',
    sections: [
      {
        title: 'Standard Positions',
        terms: [
          'Point Guard',
          'Shooting Guard',
          'Small Forward',
          'Power Forward',
          'Center Position',
        ],
      },
      {
        title: 'Hybrid Positions',
        terms: ['Combo Guard', 'Point Forward', 'Swingman', 'Hybrid Position'],
      },
      {
        title: 'Specialist Roles',
        terms: ['3-and-D Player', 'Role Player', 'Bench Players'],
      },
    ],
  },
  {
    title: 'Traits & Mentality',
    sections: [
      {
        title: 'Physical Traits',
        terms: ['Speed', 'Athleticism', 'Athletic Stance'],
      },
      {
        title: 'Mental Traits',
        terms: ['Aggressiveness', 'Clutch'],
      },
    ],
  },
  {
    title: 'Offensive Systems',
    sections: [
      {
        title: 'Motion Offenses',
        terms: [
          'Motion Offense',
          '5 Out Motion Offense',
          '4 Out 1 In Motion Offense',
          '3 Out 2 In Motion Offense',
          '2 Out 3 In Motion Offense',
        ],
      },
      {
        title: 'Set Offenses',
        terms: [
          'Triangle Offense',
          'Princeton Offense',
          'Horns Offense',
          'Flex Offense',
          'Box Offense',
          'Circle Offense',
          'Wheel Offense',
          'Stack Offense',
          'Shuffle Offense',
          'Swing Offense',
          'UCLA Offense',
          'Hawk Offense',
        ],
      },
      {
        title: 'Continuity Offenses',
        terms: ['Continuity Offense', 'Continuity Ball Screen Offense'],
      },
      {
        title: 'Formation-Based',
        terms: ['1-4 High Offense', '1-4 Low Offense'],
      },
      {
        title: 'Specialty Offenses',
        terms: [
          'Attack and React Offense',
          'Youth Basketball Offense',
          'Zone Offense',
          '2-3 Zone Offense',
          'Box and 1 Offense',
          'Undersized Basketball Team',
        ],
      },
    ],
  },
  {
    title: 'Offensive Actions',
    sections: [
      {
        title: 'Cutting Actions',
        terms: [
          'Cutting',
          'V-cut',
          'Backdoor Cut',
          'Curl Cut',
          'Fade Cut',
          'Laker Cut',
          'Iverson Cut',
          'Slot Cut',
          'Split Cut',
          'Zipper Cut',
        ],
      },
      {
        title: 'Screening Actions',
        terms: [
          'Screening',
          'On-ball Screen',
          'Off-ball Screen',
          'Back Screen',
          'Down Screen',
          'Cross Screen',
          'Flare Screen',
          'Flex Screen',
          'Elevator Screen',
          'Brush Screen',
          'Stagger Screen',
          'Ram Screen',
          'Slip Screen',
          'Step-up Screen',
          'Screen the Screener',
        ],
      },
      {
        title: 'Pick & Roll Concepts',
        terms: [
          'Pick and Roll',
          'Pick and Pop',
          'Spain Pick and Roll',
          'Drag Screen',
          'Roll and Replace',
          'Snake Dribble',
        ],
      },
      {
        title: 'Ball Movement',
        terms: [
          'Ball Reversal',
          'Give and Go',
          'Dribble Handoff',
          'Dribble Entry',
          'Entry Pass',
          'Pass and Cut',
          'Pass and Screen Away',
          'Boomerang Action',
        ],
      },
      {
        title: 'Specialized Actions',
        terms: [
          'Alley-oop',
          'High Low Action',
          'Blind Pig',
          'Floppy Set',
          'Hammer Set',
          'Shake',
          'Penetration',
          'Dribble Penetration',
          'Attack the Rim',
        ],
      },
      {
        title: 'Quick Plays & Situations',
        terms: [
          'Quick Hitters',
          'After Timeout Plays',
          'Baseline Out of Bounds Plays',
          'Sideline Out of Bounds Plays',
          'Tempo Control',
          'Delay Offense',
        ],
      },
      {
        title: 'Transition Systems',
        terms: [
          'Transition Offense',
          'Fast Break',
          'Primary Break',
          'Secondary Break',
          'Numbered Fast Break',
          '2 on 1',
          '2 on 2',
        ],
      },
    ],
  },
  {
    title: 'Defensive Systems',
    sections: [
      {
        title: 'Man to Man',
        terms: [
          'Man to Man Defense',
          'Pack Line Defense',
          'Ball Line Defense',
          'Run and Jump Defense',
        ],
      },
      {
        title: 'Zone Defenses',
        terms: [
          'Zone Defense',
          '2-3 Zone Defense',
          '3-2 Zone Defense',
          '1-2-2 Zone Defense',
          '2-1-2 Zone Defense',
          '1-3-1 Zone Defense',
          '1-1-3 Zone Defense',
          'Point Zone Defense',
        ],
      },
      {
        title: 'Press Defenses',
        terms: [
          'Full Court Press',
          '1-2-1-1 Press Defense',
          '2-2-1 Press Defense',
          '1-2-2 Press Defense',
          '2-1-2 Press Defense',
          '1-3-1 Press Defense',
          '1-1-3 Press Defense',
          'Havoc Press Defense',
        ],
      },
      {
        title: 'Junk Defenses',
        terms: [
          'Junk Defense',
          'Box and 1 Defense',
          'Diamond and 1 Defense',
          'Triangle and 2 Defense',
          'Combination Defense',
        ],
      },
      {
        title: 'Specialty Defenses',
        terms: [
          'Amoeba Defense',
          'Pressure Defense',
          'Transition Defense',
          'On-Ball Defense',
          'Closeout Defense',
          'Denial Defense',
          'Ice Defense',
          'Off-Ball Defense',
          'Help Defense',
          'Jump to the Ball',
          'Stunt Defense',
          'Shoot the Gap',
          'Screen Defense',
          'Ball Screen Defense',
          'Hedge Defense',
          'Drop Coverage',
          'Blitz Defense',
          'Switch Defense',
          'Pressure Tactics',
          'Double Team Defense',
          'Trap Defense',
        ],
      },
      {
        title: 'Stopping Plays',
        terms: ['Defensive Stop', 'Press Break Offense', '1-4 Press Break'],
      },
    ],
  },
  {
    title: 'Game Formats & Court Areas',
    sections: [
      {
        title: 'Game Formats',
        terms: ['1 on 1', '2 on 2', '3 on 3', '4 on 4', '5 on 5'],
      },
      {
        title: 'Practice Games',
        terms: ['Around the World'],
      },
      {
        title: 'Court Divisions',
        terms: ['Frontcourt', 'Backcourt', 'Perimeter', 'Strong Side', 'Weak Side'],
      },
      {
        title: 'Specific Areas',
        terms: [
          'High Post',
          'Low Post',
          'Wing',
          'Corner',
          'Slot',
          'Dunker Spot',
          'Coffin Corner',
          'Nail',
          'Baseline',
        ],
      },
    ],
  },
  {
    title: 'Rules, Violations, and Stats',
    sections: [
      {
        title: 'General Concepts',
        terms: ['Spacing', 'One Pass Away', 'Offense', 'Defense', 'Fake Pass'],
      },
      {
        title: 'Fouls',
        terms: [
          'Fouls',
          'Personal Foul',
          'Defensive Foul',
          'Offensive Foul',
          'Shooting Foul',
          'Blocking Foul',
          'Charging Foul',
          'Flagrant Foul',
          'Technical Foul',
          'Loose Ball Foul',
          'Clear Path Foul',
          'Transition Take Foul',
          'Team Foul',
        ],
      },
      {
        title: 'Violations',
        terms: [
          'Violations',
          'Backcourt Violation',
          'Carrying',
          'Illegal Screen',
          'Air Ball',
        ],
      },
      {
        title: 'Time Rules & Penalties',
        terms: ['Eight-second Rule', '24-second Shot Clock', 'Shot Clock', 'Bonus', 'Foul Out', 'Foul Trouble'],
      },
      {
        title: 'Stats & Scoring',
        terms: [
          'Statistics',
          'Assist',
          'Field Goal',
          'Turnover',
          'Double Double',
          'Time',
          'Period',
          'And One',
          'Blowout',
        ],
      },
      {
        title: 'Drills',
        terms: ['Shell Drill'],
      },
    ],
  },
]

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const percentToRating = (value: number, max: number) => clamp(1 + (value / max) * 98, 1, 99)

const metricToRating = (value: number, max: number) => clamp(1 + (value / max) * 98, 1, 99)

const adjustRating = (value: number, modifier: number, variance: number) => clamp(value * (modifier + variance), 1, 99)

const getRandomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const shuffle = <T,>(items: T[]) =>
  items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item)

const counterMatrix: Record<string, Record<string, number>> = {
  '5 Out Motion Offense': {
    'Pack Line Defense': 2.4,
    'Switch Defense': 1.4,
    '2-3 Zone Defense': 1,
  },
  'Horns Offense': {
    'Pack Line Defense': 1.4,
    'Switch Defense': 2.2,
    '2-3 Zone Defense': 0.6,
  },
  'Triangle Offense': {
    'Pack Line Defense': 1.8,
    'Switch Defense': 1,
    '2-3 Zone Defense': 2.3,
  },
}

const getCounterBonus = (offenseSystem: SystemProfile, defenseSystem: SystemProfile) =>
  counterMatrix[offenseSystem.name]?.[defenseSystem.name] ?? 0.8

const getNameSeed = (name: string) =>
  name.split('').reduce((total, char) => total + char.charCodeAt(0), 0)

const buildOffensiveProfile = (player: Player): OffensiveProfile => {
  const base = offensiveProfiles[player.offenseProfileKey]
  const variance = ((getNameSeed(player.name) % 13) - 6) / 100
  const offenseModifier = 0.85 + player.offense / 200 + player.playmaking / 300

  return {
    usageRate: adjustRating(percentToRating(base.usageRate, 30), offenseModifier, variance),
    assistRate: adjustRating(percentToRating(base.assistRate, 35), 0.8 + player.playmaking / 160, variance),
    pickAndRollBallHandler: adjustRating(percentToRating(base.pickAndRollBallHandler, 35), 0.9 + player.playmaking / 220, variance),
    rollMan: adjustRating(percentToRating(base.rollMan, 30), 0.8 + player.rebounding / 240, variance),
    spotUp: adjustRating(percentToRating(base.spotUp, 35), 0.9 + player.offense / 240, variance),
    postUp: adjustRating(percentToRating(base.postUp, 20), 0.9 + player.offense / 260, variance),
    isolation: adjustRating(percentToRating(base.isolation, 20), 0.9 + player.offense / 240, variance),
    handoff: adjustRating(percentToRating(base.handoff, 15), 0.9 + player.playmaking / 220, variance),
    cut: adjustRating(percentToRating(base.cut, 30), 0.9 + player.stamina / 260, variance),
    offScreen: adjustRating(percentToRating(base.offScreen, 15), 0.9 + player.offense / 260, variance),
    putback: adjustRating(percentToRating(base.putback, 20), 0.8 + player.rebounding / 220, variance),
    transition: adjustRating(percentToRating(base.transition, 25), 0.9 + player.stamina / 220, variance),
  }
}

const buildDefensiveProfile = (player: Player): DefensiveProfile => {
  const base = defensiveProfiles[player.defenseProfileKey]
  const variance = ((getNameSeed(player.name) % 11) - 5) / 100
  const defenseModifier = 0.85 + player.defense / 200

  return {
    craftedDpm: adjustRating(metricToRating(base.craftedDpm, 6), defenseModifier, variance),
    deflections: adjustRating(metricToRating(base.deflections, 4), 0.9 + player.playmaking / 240, variance),
    defensiveReboundRate: adjustRating(metricToRating(base.defensiveReboundRate, 35), 0.85 + player.rebounding / 200, variance),
    stealRate: adjustRating(metricToRating(base.stealRate, 4), 0.9 + player.defense / 240, variance),
    blockRate: adjustRating(metricToRating(base.blockRate, 6), 0.85 + player.defense / 220, variance),
    versatility: adjustRating(metricToRating(base.versatility, 5), 0.9 + player.stamina / 250, variance),
    matchupDifficulty: adjustRating(metricToRating(base.matchupDifficulty, 5), 0.9 + player.defense / 250, variance),
    guarding: {
      dpg: adjustRating(percentToRating(base.guarding.dpg, 50), 1, variance),
      dsg: adjustRating(percentToRating(base.guarding.dsg, 50), 1, variance),
      dsf: adjustRating(percentToRating(base.guarding.dsf, 50), 1, variance),
      dpf: adjustRating(percentToRating(base.guarding.dpf, 50), 1, variance),
      dc: adjustRating(percentToRating(base.guarding.dc, 50), 1, variance),
    },
  }
}

const averageOffenseProfile = (lineup: Player[]): OffensiveProfile => {
  const totals = lineup.reduce(
    (acc, player) => {
      const profile = buildOffensiveProfile(player)
      return {
        usageRate: acc.usageRate + profile.usageRate,
        assistRate: acc.assistRate + profile.assistRate,
        pickAndRollBallHandler: acc.pickAndRollBallHandler + profile.pickAndRollBallHandler,
        rollMan: acc.rollMan + profile.rollMan,
        spotUp: acc.spotUp + profile.spotUp,
        postUp: acc.postUp + profile.postUp,
        isolation: acc.isolation + profile.isolation,
        handoff: acc.handoff + profile.handoff,
        cut: acc.cut + profile.cut,
        offScreen: acc.offScreen + profile.offScreen,
        putback: acc.putback + profile.putback,
        transition: acc.transition + profile.transition,
      }
    },
    {
      usageRate: 0,
      assistRate: 0,
      pickAndRollBallHandler: 0,
      rollMan: 0,
      spotUp: 0,
      postUp: 0,
      isolation: 0,
      handoff: 0,
      cut: 0,
      offScreen: 0,
      putback: 0,
      transition: 0,
    },
  )

  const count = lineup.length || 1
  return {
    usageRate: totals.usageRate / count,
    assistRate: totals.assistRate / count,
    pickAndRollBallHandler: totals.pickAndRollBallHandler / count,
    rollMan: totals.rollMan / count,
    spotUp: totals.spotUp / count,
    postUp: totals.postUp / count,
    isolation: totals.isolation / count,
    handoff: totals.handoff / count,
    cut: totals.cut / count,
    offScreen: totals.offScreen / count,
    putback: totals.putback / count,
    transition: totals.transition / count,
  }
}

const averageDefenseProfile = (lineup: Player[]): DefensiveProfile => {
  const totals = lineup.reduce(
    (acc, player) => {
      const profile = buildDefensiveProfile(player)
      return {
        craftedDpm: acc.craftedDpm + profile.craftedDpm,
        deflections: acc.deflections + profile.deflections,
        defensiveReboundRate: acc.defensiveReboundRate + profile.defensiveReboundRate,
        stealRate: acc.stealRate + profile.stealRate,
        blockRate: acc.blockRate + profile.blockRate,
        versatility: acc.versatility + profile.versatility,
        matchupDifficulty: acc.matchupDifficulty + profile.matchupDifficulty,
        guarding: {
          dpg: acc.guarding.dpg + profile.guarding.dpg,
          dsg: acc.guarding.dsg + profile.guarding.dsg,
          dsf: acc.guarding.dsf + profile.guarding.dsf,
          dpf: acc.guarding.dpf + profile.guarding.dpf,
          dc: acc.guarding.dc + profile.guarding.dc,
        },
      }
    },
    {
      craftedDpm: 0,
      deflections: 0,
      defensiveReboundRate: 0,
      stealRate: 0,
      blockRate: 0,
      versatility: 0,
      matchupDifficulty: 0,
      guarding: {
        dpg: 0,
        dsg: 0,
        dsf: 0,
        dpf: 0,
        dc: 0,
      },
    },
  )

  const count = lineup.length || 1
  return {
    craftedDpm: totals.craftedDpm / count,
    deflections: totals.deflections / count,
    defensiveReboundRate: totals.defensiveReboundRate / count,
    stealRate: totals.stealRate / count,
    blockRate: totals.blockRate / count,
    versatility: totals.versatility / count,
    matchupDifficulty: totals.matchupDifficulty / count,
    guarding: {
      dpg: totals.guarding.dpg / count,
      dsg: totals.guarding.dsg / count,
      dsf: totals.guarding.dsf / count,
      dpf: totals.guarding.dpf / count,
      dc: totals.guarding.dc / count,
    },
  }
}

const getOffenseStyleFit = (profile: OffensiveProfile, playStyle: OffenseStyle) =>
  (profile.pickAndRollBallHandler * playStyle.pickAndRollBallHandler +
    profile.rollMan * playStyle.rollMan +
    profile.spotUp * playStyle.spotUp +
    profile.postUp * playStyle.postUp +
    profile.isolation * playStyle.isolation +
    profile.handoff * playStyle.handoff +
    profile.cut * playStyle.cut +
    profile.offScreen * playStyle.offScreen +
    profile.putback * playStyle.putback +
    profile.transition * playStyle.transition) /
  99

const getDefenseStyleFit = (profile: DefensiveProfile, defenseStyle: DefenseStyle) =>
  (profile.blockRate * defenseStyle.rimProtection +
    profile.stealRate * defenseStyle.playDisruption +
    profile.deflections * defenseStyle.playDisruption +
    profile.versatility * defenseStyle.switchability +
    profile.defensiveReboundRate * defenseStyle.rebounding +
    profile.matchupDifficulty * defenseStyle.perimeterPressure) /
  99

const getTopOffenseTraits = (profile: OffensiveProfile) => {
  const entries = Object.entries(profile) as [keyof OffensiveProfile, number][]
  return entries
    .filter(([key]) => key !== 'usageRate' && key !== 'assistRate')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').trim()}: ${value.toFixed(0)}`)
}

const getDefenseHighlights = (profile: DefensiveProfile) => [
  `DPM ${profile.craftedDpm.toFixed(0)}`,
  `Defl ${profile.deflections.toFixed(0)}`,
  `DRB ${profile.defensiveReboundRate.toFixed(0)}`,
  `STL ${profile.stealRate.toFixed(0)}`,
  `BLK ${profile.blockRate.toFixed(0)}`,
]

const getOffenseClusterRating = (profile: OffensiveProfile) =>
  (profile.pickAndRollBallHandler +
    profile.rollMan +
    profile.spotUp +
    profile.postUp +
    profile.isolation +
    profile.handoff +
    profile.cut +
    profile.offScreen +
    profile.putback +
    profile.transition) /
  10

const getDefenseClusterRating = (profile: DefensiveProfile) =>
  (profile.craftedDpm +
    profile.deflections +
    profile.defensiveReboundRate +
    profile.stealRate +
    profile.blockRate +
    profile.versatility +
    profile.matchupDifficulty) /
  7

const simulateMatchup = (lineup: Player[], offenseSystem: SystemProfile, defenseSystem: SystemProfile) => {
  const baseOffense = lineup.reduce((total, player) => total + player.offense, 0) / lineup.length
  const baseDefense = lineup.reduce((total, player) => total + player.defense, 0) / lineup.length
  const basePlaymaking = lineup.reduce((total, player) => total + player.playmaking, 0) / lineup.length
  const baseRebounding = lineup.reduce((total, player) => total + player.rebounding, 0) / lineup.length
  const stamina = lineup.reduce((total, player) => total + player.stamina, 0) / lineup.length

  const systemFit = lineup.filter((player) => player.systemsFit.includes(offenseSystem.name)).length
  const roleFit = lineup.filter((player) => offenseSystem.roleNeeds.includes(player.role)).length
  const defenseFit = lineup.filter((player) => defenseSystem.roleNeeds.includes(player.role)).length

  const spacingBonus = lineup
    .flatMap((player) => player.favoriteAreas)
    .filter((area) => offenseSystem.spacingBonusAreas.includes(area)).length

  const offenseScore =
    baseOffense * offenseSystem.offenseWeight +
    basePlaymaking * offenseSystem.playmakingWeight +
    spacingBonus * 0.6 +
    systemFit * 1.5 +
    roleFit * 1.2

  const defenseScore =
    baseDefense * defenseSystem.defenseWeight +
    baseRebounding * defenseSystem.reboundingWeight +
    defenseFit * 1.1 +
    stamina * 0.08

  return {
    offenseScore,
    defenseScore,
    baseOffense,
    baseDefense,
    basePlaymaking,
    baseRebounding,
    spacingBonus,
    systemFit,
    roleFit,
    defenseFit,
  }
}

const App = () => {
  const [offenseSystem, setOffenseSystem] = useState(offensiveSystems[0])
  const [defenseSystem, setDefenseSystem] = useState(defensiveSystems[0])
  const [prepFocus, setPrepFocus] = useState(prepFocuses[0])
  const [log, setLog] = useState<string[]>([])
  const [result, setResult] = useState<string>('')
  const [opponentInfo, setOpponentInfo] = useState<string>('')

  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>(() => players.slice(0, 8))
  const [opponentRoster, setOpponentRoster] = useState<Player[]>(() => players.slice(8, 16))
  const [opponentOffense, setOpponentOffense] = useState(offensiveSystems[1])
  const [opponentDefense, setOpponentDefense] = useState(defensiveSystems[1])

  const lineup = useMemo(() => selectedPlayers, [selectedPlayers])

  const togglePlayer = (player: Player) => {
    setSelectedPlayers((prev) => {
      const exists = prev.some((item) => item.name === player.name)
      if (exists) {
        return prev.filter((item) => item.name !== player.name)
      }
      if (prev.length >= 10) {
        return prev
      }
      return [...prev, player]
    })
  }

  const buildRandomRoster = (excludeNames: string[], rosterSize = 8) => {
    const available = players.filter((player) => !excludeNames.includes(player.name))
    return shuffle(available).slice(0, rosterSize)
  }

  const handleRandomizeOpponent = () => {
    const roster = buildRandomRoster(selectedPlayers.map((player) => player.name))
    setOpponentRoster(roster)
    setOpponentOffense(getRandomItem(offensiveSystems))
    setOpponentDefense(getRandomItem(defensiveSystems))
    setOpponentInfo('Opponent scouting report updated.')
  }

  const handleSimulate = () => {
    if (lineup.length < 5) {
      setResult('Select at least 5 players to simulate a matchup.')
      return
    }

    const metrics = simulateMatchup(lineup, offenseSystem, defenseSystem)
    const opponentMetrics = simulateMatchup(opponentRoster, opponentOffense, opponentDefense)

    const offenseCounter = getCounterBonus(offenseSystem, opponentDefense) * prepFocus.counterBoost
    const defenseCounter = getCounterBonus(opponentOffense, defenseSystem) * prepFocus.counterBoost

    const offenseProfile = averageOffenseProfile(lineup)
    const defenseProfile = averageDefenseProfile(lineup)
    const opponentOffenseProfile = averageOffenseProfile(opponentRoster)
    const opponentDefenseProfile = averageDefenseProfile(opponentRoster)

    const offenseStyleFit = getOffenseStyleFit(offenseProfile, offenseSystem.playStyle)
    const defenseStyleFit = getDefenseStyleFit(defenseProfile, defenseSystem.defenseStyle)
    const opponentOffenseFit = getOffenseStyleFit(opponentOffenseProfile, opponentOffense.playStyle)
    const opponentDefenseFit = getDefenseStyleFit(opponentDefenseProfile, opponentDefense.defenseStyle)

    const pace = clamp(96 + (metrics.basePlaymaking - 75) * 0.4, 88, 106)
    const opponentPace = clamp(96 + (opponentMetrics.basePlaymaking - 75) * 0.35, 88, 106)
    const paceBlend = clamp((pace + opponentPace) / 2, 88, 106)

    const variance = (Math.random() - 0.5) * 12 * prepFocus.varianceMultiplier
    const opponentVariance = (Math.random() - 0.5) * 12

    const offenseTotal =
      metrics.offenseScore +
      offenseCounter +
      prepFocus.offenseBoost +
      variance +
      offenseStyleFit * 0.9
    const defenseTotal =
      metrics.defenseScore +
      defenseCounter +
      prepFocus.defenseBoost +
      (Math.random() - 0.5) * 6 +
      defenseStyleFit * 0.8

    const opponentOffenseTotal =
      opponentMetrics.offenseScore + getCounterBonus(opponentOffense, defenseSystem) + opponentVariance + opponentOffenseFit
    const opponentDefenseTotal =
      opponentMetrics.defenseScore +
      getCounterBonus(offenseSystem, opponentDefense) * 0.6 +
      (Math.random() - 0.5) * 4 +
      opponentDefenseFit * 0.8

    const netOffense = offenseTotal - opponentDefenseTotal * 0.55
    const netDefense = defenseTotal - opponentOffenseTotal * 0.45

    const projectedPoints = clamp(108 + netOffense + paceBlend * 0.5, 80, 140)
    const projectedOpponent = clamp(108 - netDefense + paceBlend * 0.45, 78, 138)

    const summary = `Final Score Projection: ${projectedPoints.toFixed(0)} - ${projectedOpponent.toFixed(0)}`
    const detail = `Prep: ${prepFocus.name} | Counter edge ${offenseCounter.toFixed(1)} | Pace ${paceBlend.toFixed(0)}`
    const offenseDetail = `Offense cluster fit ${offenseStyleFit.toFixed(1)} | Defense cluster fit ${
      defenseStyleFit.toFixed(1)
    }`
    const defenseDetail = `Your Defense Fit ${metrics.defenseFit}/${lineup.length} | Opp Offense Fit ${
      opponentMetrics.systemFit
    }/${opponentRoster.length}`
    const rosterDetail = `Roster ${lineup.length} players | Opponent ${opponentRoster.length} players (${opponentOffense.name} / ${
      opponentDefense.name
    })`

    setResult(summary)
    setOpponentInfo(`Opponent: ${opponentOffense.name} + ${opponentDefense.name}`)
    setLog((prev) => [summary, detail, offenseDetail, defenseDetail, rosterDetail, ...prev].slice(0, 8))
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Basketball Deck Builder - Term Categories</p>
        <h1>NBA MyTeam Simulation Builder</h1>
        <p className="subtitle">
          Build an 82-game simulation by rating players with NBA terms, assigning fixed player cards to roles, and
          choosing offensive/defensive systems that fit the lineup. Not every player thrives in every scheme—fit
          drives wins.
        </p>
      </header>

      <section className="simulator">
        <div className="simulator-panel">
          <h2>One-Game Simulation</h2>
          <p className="muted">
            Build a roster of at least 5 from a 30+ player pool, pick a prep focus, and simulate against a randomized
            opponent. Counter play and scouting matter, so rerun to test adjustments.
          </p>
          <div className="select-row">
            <label>
              Offensive System
              <select
                value={offenseSystem.name}
                onChange={(event) =>
                  setOffenseSystem(
                    offensiveSystems.find((system) => system.name === event.target.value) ?? offensiveSystems[0],
                  )
                }
              >
                {offensiveSystems.map((system) => (
                  <option key={system.name} value={system.name}>
                    {system.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Defensive System
              <select
                value={defenseSystem.name}
                onChange={(event) =>
                  setDefenseSystem(
                    defensiveSystems.find((system) => system.name === event.target.value) ?? defensiveSystems[0],
                  )
                }
              >
                {defensiveSystems.map((system) => (
                  <option key={system.name} value={system.name}>
                    {system.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Prep Focus
              <select
                value={prepFocus.name}
                onChange={(event) =>
                  setPrepFocus(prepFocuses.find((focus) => focus.name === event.target.value) ?? prepFocuses[0])
                }
              >
                {prepFocuses.map((focus) => (
                  <option key={focus.name} value={focus.name}>
                    {focus.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="button-row">
            <button className="primary" type="button" onClick={handleSimulate}>
              Simulate Game
            </button>
            <button className="secondary" type="button" onClick={handleRandomizeOpponent}>
              Randomize Opponent
            </button>
          </div>
          {result ? <div className="result">{result}</div> : null}
          {opponentInfo ? <div className="opponent-info">{opponentInfo}</div> : null}
          <div className="log">
            <h3>Latest simulation notes</h3>
            {log.length === 0 ? (
              <p className="muted">Run a simulation to generate a summary.</p>
            ) : (
              <ul>
                {log.map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="simulator-panel">
          <h2>Roster Builder</h2>
          <p className="muted">
            Select up to 10 players from the pool. Aim for at least 5 to generate a matchup and balance roles for
            counters.
          </p>
          <div className="roster-summary">
            <span>Selected: {lineup.length} players</span>
            <span className="muted">Pool size: {players.length} players</span>
          </div>
          <div className="roster-grid">
            {players.map((player) => {
              const isSelected = lineup.some((item) => item.name === player.name)
              const offenseProfile = buildOffensiveProfile(player)
              const defenseProfile = buildDefensiveProfile(player)
              const offenseRating = getOffenseClusterRating(offenseProfile)
              const defenseRating = getDefenseClusterRating(defenseProfile)
              return (
                <button
                  key={player.name}
                  type="button"
                  className={`roster-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => togglePlayer(player)}
                >
                  <div className="roster-card-header">
                    <h3>{player.name}</h3>
                    <span className="badge">{player.position}</span>
                  </div>
                  <p className="muted">{player.role}</p>
                  <div className="profile-tags">
                    <span className="profile-chip">Off: {player.offenseProfileKey}</span>
                    <span className="profile-chip">Def: {player.defenseProfileKey}</span>
                  </div>
                  <div className="roster-stats">
                    <span>Off {player.offense}</span>
                    <span>Def {player.defense}</span>
                    <span>Play {player.playmaking}</span>
                    <span>O-OVR {offenseRating.toFixed(0)}</span>
                    <span>D-OVR {defenseRating.toFixed(0)}</span>
                  </div>
                  <div className="profile-micro">
                    {getTopOffenseTraits(offenseProfile).map((trait) => (
                      <span key={trait}>{trait}</span>
                    ))}
                  </div>
                  <div className="profile-micro">
                    {getDefenseHighlights(defenseProfile).map((trait) => (
                      <span key={trait}>{trait}</span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="simulator-panel">
          <h2>Your Lineup Roles & Fit</h2>
          <p className="muted">Player cards are selectable. Adjust roles and lineups to maximize system synergy.</p>
          <div className="lineup">
            {lineup.map((player) => {
              const offenseProfile = buildOffensiveProfile(player)
              const defenseProfile = buildDefensiveProfile(player)
              const offenseRating = getOffenseClusterRating(offenseProfile)
              const defenseRating = getDefenseClusterRating(defenseProfile)
              return (
                <div key={player.name} className="player-card">
                  <div className="player-header">
                    <div>
                      <h3>{player.name}</h3>
                      <span className="badge">{player.position}</span>
                      <span className="badge badge-secondary">{player.role}</span>
                    </div>
                    <div className="rating">{Math.round((player.offense + player.defense) / 2)}</div>
                  </div>
                  <div className="stats">
                    <div>
                      <strong>Off</strong> {player.offense}
                    </div>
                    <div>
                      <strong>Def</strong> {player.defense}
                    </div>
                    <div>
                      <strong>Play</strong> {player.playmaking}
                    </div>
                    <div>
                      <strong>Reb</strong> {player.rebounding}
                    </div>
                    <div>
                      <strong>Sta</strong> {player.stamina}
                    </div>
                    <div>
                      <strong>O-OVR</strong> {offenseRating.toFixed(0)}
                    </div>
                    <div>
                      <strong>D-OVR</strong> {defenseRating.toFixed(0)}
                    </div>
                  </div>
                  <div className="profile-tags">
                    <span className="profile-chip">Offense Cluster: {player.offenseProfileKey}</span>
                    <span className="profile-chip">Defense Cluster: {player.defenseProfileKey}</span>
                  </div>
                  <div className="profile-grid">
                    <div>
                      <h4>Offensive profile</h4>
                      <ul>
                        {getTopOffenseTraits(offenseProfile).map((trait) => (
                          <li key={trait}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Defensive profile</h4>
                      <ul>
                        {getDefenseHighlights(defenseProfile).map((trait) => (
                          <li key={trait}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="meta">
                    <span>Fav areas: {player.favoriteAreas.join(', ')}</span>
                    <span>System fit: {player.systemsFit.join(', ')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="simulator-panel">
          <h2>Opponent Snapshot</h2>
          <p className="muted">Opponent systems are randomized, so scouting and prep change the outcome.</p>
          <div className="opponent-card">
            <h3>{opponentOffense.name}</h3>
            <p className="muted">Defense: {opponentDefense.name}</p>
            <div className="opponent-roster">
              {opponentRoster.map((player) => (
                <span key={player.name} className="pill">
                  {player.name}
                </span>
              ))}
            </div>
          </div>
          <div className="prep-notes">
            {prepFocuses.map((focus) => (
              <div key={focus.name} className={`prep-card ${prepFocus.name === focus.name ? 'active' : ''}`}>
                <h4>{focus.name}</h4>
                <p>{focus.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overview">
        <div className="overview-card">
          <h2>Clustering methodology</h2>
          <ul>
            <li>Offense clustering uses usage, assist, and play-type frequencies converted to a 1-99 scale.</li>
            <li>Defense clustering uses DPM, deflections, rebounding, steals, blocks, versatility, and matchup load on a 1-99 scale.</li>
            <li>Players can technically run any action, but their 1-99 cluster profile shapes the simulation outcome.</li>
            <li>Prep focus and counters let you tilt outcomes by leaning into strengths and covering weaknesses.</li>
          </ul>
        </div>
        <div className="overview-card">
          <h2>Simulation focus</h2>
          <ul>
            <li>Use the terminology to drive play selection, shot quality, and matchup outcomes.</li>
            <li>Track player favorite areas (corner, wing, high post) to influence spacing and shot charts.</li>
            <li>Blend offensive actions with defensive counters to mirror NBA complexity.</li>
            <li>Scale the same tags into season-long fatigue, morale, and consistency modifiers.</li>
          </ul>
        </div>
      </section>

      <section className="grid">
        {categories.map((category) => (
          <details key={category.title} className="card">
            <summary>
              <span>{category.title}</span>
              <span className="count">{category.sections.reduce((total, section) => total + section.terms.length, 0)} terms</span>
            </summary>
            <div className="card-body">
              {category.sections.map((section) => (
                <div key={section.title} className="section">
                  <h3>{section.title}</h3>
                  <div className="terms">
                    {section.terms.map((term) => (
                      <span key={term} className="pill">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        ))}
      </section>
    </div>
  )
}

export default App
