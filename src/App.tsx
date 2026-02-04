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

const offensiveSystems: SystemProfile[] = [
  {
    name: '5 Out Motion Offense',
    offenseWeight: 1.15,
    defenseWeight: 0.95,
    playmakingWeight: 1.2,
    reboundingWeight: 0.9,
    spacingBonusAreas: ['Corner', 'Wing', 'Slot'],
    roleNeeds: ['Playmaker', 'Movement Shooter', 'Stretch Big'],
  },
  {
    name: 'Horns Offense',
    offenseWeight: 1.05,
    defenseWeight: 1,
    playmakingWeight: 1.05,
    reboundingWeight: 1.05,
    spacingBonusAreas: ['High Post', 'Wing'],
    roleNeeds: ['Point Forward', 'Roll Big', 'Shot Creator'],
  },
  {
    name: 'Triangle Offense',
    offenseWeight: 1.1,
    defenseWeight: 0.98,
    playmakingWeight: 1.1,
    reboundingWeight: 1.05,
    spacingBonusAreas: ['Low Post', 'Corner'],
    roleNeeds: ['Post Scorer', 'Wing Shooter', 'Connector'],
  },
]

const defensiveSystems: SystemProfile[] = [
  {
    name: 'Pack Line Defense',
    offenseWeight: 0.96,
    defenseWeight: 1.2,
    playmakingWeight: 0.95,
    reboundingWeight: 1.1,
    spacingBonusAreas: ['Paint', 'Nail'],
    roleNeeds: ['Anchor Big', 'Point of Attack', 'Help Defender'],
  },
  {
    name: 'Switch Defense',
    offenseWeight: 1,
    defenseWeight: 1.12,
    playmakingWeight: 0.98,
    reboundingWeight: 1,
    spacingBonusAreas: ['Perimeter', 'Wing'],
    roleNeeds: ['Versatile Wing', 'Rim Protector', 'On-ball Stopper'],
  },
  {
    name: '2-3 Zone Defense',
    offenseWeight: 0.97,
    defenseWeight: 1.15,
    playmakingWeight: 0.96,
    reboundingWeight: 1.05,
    spacingBonusAreas: ['Paint', 'Corner'],
    roleNeeds: ['Long Wing', 'Shot Blocker', 'Rebounder'],
  },
]

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

const simulateMatchup = (
  lineup: Player[],
  offenseSystem: SystemProfile,
  defenseSystem: SystemProfile,
) => {
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
  const [log, setLog] = useState<string[]>([])
  const [result, setResult] = useState<string>('')

  const lineup = useMemo(() => players, [])

  const handleSimulate = () => {
    const metrics = simulateMatchup(lineup, offenseSystem, defenseSystem)
    const variance = (Math.random() - 0.5) * 12
    const offenseTotal = metrics.offenseScore + variance
    const defenseTotal = metrics.defenseScore + (Math.random() - 0.5) * 10
    const pace = clamp(96 + (metrics.basePlaymaking - 75) * 0.4, 90, 104)
    const projectedPoints = clamp(offenseTotal * 1.1 + pace * 0.6, 82, 132)
    const projectedOpponent = clamp(118 - defenseTotal * 0.6 + (104 - pace) * 0.4, 80, 128)

    const summary = `Final Score Projection: ${projectedPoints.toFixed(0)} - ${projectedOpponent.toFixed(0)}`
    const detail = `System Fit ${metrics.systemFit}/5 | Role Fit ${metrics.roleFit}/5 | Spacing Bonus ${metrics.spacingBonus}`
    const defenseDetail = `Defense Fit ${metrics.defenseFit}/5 | Rebounding ${metrics.baseRebounding.toFixed(1)}`

    setResult(summary)
    setLog((prev) => [summary, detail, defenseDetail, ...prev].slice(0, 8))
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
            Pick your systems and simulate a single matchup. The lineup is fixed, so use roles and system synergy
            to drive performance.
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
          </div>
          <button className="primary" type="button" onClick={handleSimulate}>
            Simulate Game
          </button>
          {result ? <div className="result">{result}</div> : null}
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
          <h2>Lineup Roles & Fit</h2>
          <p className="muted">Player cards are locked for now. Assign systems that match their roles and zones.</p>
          <div className="lineup">
            {lineup.map((player) => (
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
                </div>
                <div className="meta">
                  <span>Fav areas: {player.favoriteAreas.join(', ')}</span>
                  <span>System fit: {player.systemsFit.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overview">
        <div className="overview-card">
          <h2>How to use these categories</h2>
          <ul>
            <li>Rate each player by the skills and traits that match their real-world profile.</li>
            <li>Assign coaches and staff to offensive/defensive systems that shape your team identity.</li>
            <li>Match roles to systems: not every player thrives in every scheme, so fit matters.</li>
            <li>Player cards are fixed for now—adjust roles and lineups to maximize system synergy.</li>
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
