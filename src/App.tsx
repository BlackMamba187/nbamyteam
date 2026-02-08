import { useMemo, useState } from 'react'

type ShotType = 'rim' | 'mid' | 'three'
type CreationType = 'pnr' | 'transition' | 'iso' | 'post' | 'motion'

type OffenseStyle = '5-Out' | 'Pace & Space' | 'Balanced' | 'Inside-Out'
type DefenseStyle = 'Switch' | 'Drop' | 'Zone' | 'Pressure'

type Player = {
  name: string
  pos: 'PG' | 'SG' | 'SF' | 'PF' | 'C'
  offense: number
  defense: number
  playmaking: number
  rebounding: number
  usage: number
  rim: number
  mid: number
  three: number
  creation: Record<CreationType, number>
}

type TeamTemplate = {
  id: string
  name: string
  coachOff: number
  coachDef: number
  pace: number
  roster: Player[]
  offenseFit: Record<OffenseStyle, number>
  defenseFit: Record<DefenseStyle, number>
}

type PregameSide = {
  teamId: string
  offenseStyle: OffenseStyle
  defenseStyle: DefenseStyle
  shotMix: Record<ShotType, number>
  primaryScorer: string
  secondaryScorer: string
  creationFocus: CreationType
}

type PlayerLine = {
  name: string
  pos: Player['pos']
  min: number
  pts: number
  reb: number
  ast: number
  stl: number
  blk: number
  tov: number
  fgm: number
  fga: number
  tpm: number
  tpa: number
}

type TeamResult = {
  name: string
  score: number
  lines: PlayerLine[]
}

type GameResult = {
  away: TeamResult
  home: TeamResult
  log: string[]
}

type PlayerRoles = {
  offenseRole: string
  defenseRole: string
  offenseFit: number
  defenseFit: number
}

const offenseStyles: OffenseStyle[] = ['5-Out', 'Pace & Space', 'Balanced', 'Inside-Out']
const defenseStyles: DefenseStyle[] = ['Switch', 'Drop', 'Zone', 'Pressure']
const creationTypes: CreationType[] = ['pnr', 'transition', 'iso', 'post', 'motion']

const teams: TeamTemplate[] = [
  {
    id: 'monarchs',
    name: 'Metro Monarchs',
    coachOff: 84,
    coachDef: 80,
    pace: 100,
    offenseFit: { '5-Out': 88, 'Pace & Space': 86, Balanced: 82, 'Inside-Out': 76 },
    defenseFit: { Switch: 84, Drop: 78, Zone: 74, Pressure: 81 },
    roster: [
      { name: 'Jalen Cross', pos: 'PG', offense: 87, defense: 75, playmaking: 91, rebounding: 50, usage: 28, rim: 79, mid: 74, three: 83, creation: { pnr: 92, transition: 84, iso: 81, post: 38, motion: 78 } },
      { name: 'Tyrese Bloom', pos: 'SG', offense: 84, defense: 78, playmaking: 72, rebounding: 56, usage: 24, rim: 77, mid: 79, three: 85, creation: { pnr: 66, transition: 81, iso: 77, post: 42, motion: 84 } },
      { name: 'Malik Voss', pos: 'SF', offense: 80, defense: 82, playmaking: 70, rebounding: 65, usage: 19, rim: 76, mid: 78, three: 79, creation: { pnr: 58, transition: 76, iso: 72, post: 61, motion: 75 } },
      { name: 'Andre Pike', pos: 'PF', offense: 78, defense: 84, playmaking: 62, rebounding: 80, usage: 16, rim: 81, mid: 71, three: 72, creation: { pnr: 54, transition: 69, iso: 58, post: 73, motion: 62 } },
      { name: 'Dorian Slate', pos: 'C', offense: 76, defense: 88, playmaking: 58, rebounding: 89, usage: 13, rim: 84, mid: 64, three: 40, creation: { pnr: 62, transition: 57, iso: 44, post: 80, motion: 49 } },
    ],
  },
  {
    id: 'waves',
    name: 'Harbor City Waves',
    coachOff: 81,
    coachDef: 85,
    pace: 98,
    offenseFit: { '5-Out': 78, 'Pace & Space': 81, Balanced: 84, 'Inside-Out': 85 },
    defenseFit: { Switch: 79, Drop: 88, Zone: 82, Pressure: 77 },
    roster: [
      { name: 'Noah Lane', pos: 'PG', offense: 82, defense: 79, playmaking: 87, rebounding: 48, usage: 27, rim: 74, mid: 79, three: 81, creation: { pnr: 90, transition: 79, iso: 78, post: 35, motion: 74 } },
      { name: 'Kobe Hale', pos: 'SG', offense: 87, defense: 74, playmaking: 68, rebounding: 53, usage: 26, rim: 82, mid: 81, three: 86, creation: { pnr: 70, transition: 85, iso: 85, post: 45, motion: 77 } },
      { name: 'Jace Rowan', pos: 'SF', offense: 79, defense: 83, playmaking: 69, rebounding: 66, usage: 18, rim: 77, mid: 75, three: 78, creation: { pnr: 58, transition: 75, iso: 73, post: 62, motion: 72 } },
      { name: 'Micah Stone', pos: 'PF', offense: 77, defense: 85, playmaking: 60, rebounding: 84, usage: 15, rim: 80, mid: 70, three: 68, creation: { pnr: 49, transition: 67, iso: 57, post: 75, motion: 58 } },
      { name: 'Eli Ward', pos: 'C', offense: 74, defense: 87, playmaking: 55, rebounding: 90, usage: 14, rim: 83, mid: 62, three: 38, creation: { pnr: 60, transition: 55, iso: 42, post: 82, motion: 46 } },
    ],
  },
  {
    id: 'peaks',
    name: 'Summit Peaks',
    coachOff: 86,
    coachDef: 77,
    pace: 103,
    offenseFit: { '5-Out': 85, 'Pace & Space': 90, Balanced: 80, 'Inside-Out': 73 },
    defenseFit: { Switch: 81, Drop: 71, Zone: 74, Pressure: 85 },
    roster: [
      { name: 'Aiden Frost', pos: 'PG', offense: 88, defense: 72, playmaking: 90, rebounding: 47, usage: 29, rim: 81, mid: 78, three: 84, creation: { pnr: 93, transition: 88, iso: 84, post: 32, motion: 78 } },
      { name: 'Blaine Knox', pos: 'SG', offense: 85, defense: 73, playmaking: 70, rebounding: 52, usage: 25, rim: 79, mid: 80, three: 87, creation: { pnr: 64, transition: 83, iso: 82, post: 41, motion: 82 } },
      { name: 'Cyrus Vale', pos: 'SF', offense: 81, defense: 79, playmaking: 72, rebounding: 64, usage: 18, rim: 78, mid: 76, three: 80, creation: { pnr: 60, transition: 78, iso: 74, post: 58, motion: 76 } },
      { name: 'Dane Oak', pos: 'PF', offense: 76, defense: 80, playmaking: 59, rebounding: 82, usage: 15, rim: 79, mid: 69, three: 67, creation: { pnr: 51, transition: 70, iso: 55, post: 74, motion: 55 } },
      { name: 'Evan Ridge', pos: 'C', offense: 73, defense: 83, playmaking: 54, rebounding: 88, usage: 13, rim: 82, mid: 60, three: 36, creation: { pnr: 58, transition: 54, iso: 39, post: 81, motion: 44 } },
    ],
  },
]

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const avg = (n: number[]) => n.reduce((a, b) => a + b, 0) / n.length

const pickWeighted = <T,>(items: T[], w: (x: T) => number): T => {
  const total = items.reduce((sum, item) => sum + Math.max(0.01, w(item)), 0)
  let roll = Math.random() * total
  for (const item of items) {
    roll -= Math.max(0.01, w(item))
    if (roll <= 0) return item
  }
  return items[items.length - 1]
}

const normalizeMix = (mix: Record<ShotType, number>) => {
  const total = mix.rim + mix.mid + mix.three
  if (total <= 0) return { rim: 34, mid: 30, three: 36 }
  return { rim: (mix.rim / total) * 100, mid: (mix.mid / total) * 100, three: (mix.three / total) * 100 }
}

function getPlayerRoles(player: Player, side: PregameSide): PlayerRoles {
  const creatorSkill = player.creation[side.creationFocus]
  const shotBest = Math.max(player.rim, player.mid, player.three)

  let offenseRole = 'Connector'
  if (player.name === side.primaryScorer) offenseRole = 'Primary Option'
  else if (player.name === side.secondaryScorer) offenseRole = 'Secondary Option'
  else if (creatorSkill >= 82 || player.playmaking >= 85) offenseRole = 'Creator'
  else if (player.three >= 82 && side.offenseStyle === '5-Out') offenseRole = 'Spacer'
  else if (player.rim >= 82 && side.offenseStyle === 'Inside-Out') offenseRole = 'Interior Finisher'
  else if (player.rebounding >= 84) offenseRole = 'Glass Cleaner'

  let defenseRole = 'Team Helper'
  if (player.defense >= 86 && player.pos === 'C') defenseRole = 'Rim Protector'
  else if (player.defense >= 82 && ['SF', 'PF'].includes(player.pos)) defenseRole = 'Wing Stopper'
  else if (player.defense >= 80 && ['PG', 'SG'].includes(player.pos)) defenseRole = 'Point-of-Attack'
  else if (player.rebounding >= 84) defenseRole = 'Defensive Rebounder'

  const offenseFit = clamp((player.offense + player.playmaking + shotBest + creatorSkill) / 4, 50, 99)
  const defenseFit = clamp((player.defense + player.rebounding + (player.pos === 'C' ? 4 : 0)) / 2, 50, 99)

  return { offenseRole, defenseRole, offenseFit, defenseFit }
}

const shotTypeFromMix = (mix: Record<ShotType, number>, oppDefenseStyle: DefenseStyle): ShotType => {
  const adjusted = { ...mix }
  if (oppDefenseStyle === 'Drop') {
    adjusted.three += 6
    adjusted.rim -= 4
  }
  if (oppDefenseStyle === 'Zone') {
    adjusted.three += 4
    adjusted.mid += 4
    adjusted.rim -= 6
  }
  const n = normalizeMix({ rim: clamp(adjusted.rim, 10, 70), mid: clamp(adjusted.mid, 10, 55), three: clamp(adjusted.three, 15, 65) })
  const roll = Math.random() * 100
  if (roll < n.rim) return 'rim'
  if (roll < n.rim + n.mid) return 'mid'
  return 'three'
}

function defaultSide(teamId: string): PregameSide {
  const team = teams.find((t) => t.id === teamId) ?? teams[0]
  return {
    teamId,
    offenseStyle: 'Balanced',
    defenseStyle: 'Switch',
    shotMix: { rim: 35, mid: 25, three: 40 },
    primaryScorer: team.roster[0].name,
    secondaryScorer: team.roster[1].name,
    creationFocus: 'pnr',
  }
}

function simulateGame(awaySide: PregameSide, homeSide: PregameSide): GameResult {
  const away = teams.find((t) => t.id === awaySide.teamId) ?? teams[0]
  const home = teams.find((t) => t.id === homeSide.teamId) ?? teams[1]

  const awayRoles = Object.fromEntries(away.roster.map((p) => [p.name, getPlayerRoles(p, awaySide)])) as Record<string, PlayerRoles>
  const homeRoles = Object.fromEntries(home.roster.map((p) => [p.name, getPlayerRoles(p, homeSide)])) as Record<string, PlayerRoles>

  const initLines = (team: TeamTemplate): Record<string, PlayerLine> =>
    Object.fromEntries(team.roster.map((p) => [p.name, { name: p.name, pos: p.pos, min: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, tov: 0, fgm: 0, fga: 0, tpm: 0, tpa: 0 }]))

  const awayLines = initLines(away)
  const homeLines = initLines(home)

  const awayOffBase = avg(away.roster.map((p) => p.offense)) + away.coachOff * 0.3
  const homeOffBase = avg(home.roster.map((p) => p.offense)) + home.coachOff * 0.3
  const awayDefBase = avg(away.roster.map((p) => p.defense)) + away.coachDef * 0.3
  const homeDefBase = avg(home.roster.map((p) => p.defense)) + home.coachDef * 0.3

  const awayRoleOff = avg(away.roster.map((p) => awayRoles[p.name].offenseFit))
  const homeRoleOff = avg(home.roster.map((p) => homeRoles[p.name].offenseFit))
  const awayRoleDef = avg(away.roster.map((p) => awayRoles[p.name].defenseFit))
  const homeRoleDef = avg(home.roster.map((p) => homeRoles[p.name].defenseFit))

  const awaySynergy = (away.offenseFit[awaySide.offenseStyle] + away.defenseFit[awaySide.defenseStyle]) / 2
  const homeSynergy = (home.offenseFit[homeSide.offenseStyle] + home.defenseFit[homeSide.defenseStyle]) / 2

  const gamePace = Math.round((away.pace + home.pace) / 2 + (Math.random() * 8 - 4))
  const totalPossessions = gamePace * 2

  let awayScore = 0
  let homeScore = 0
  let offense = 'away' as 'away' | 'home'
  const log: string[] = []

  const context = (side: 'away' | 'home') => {
    if (side === 'away') {
      return {
        offenseTeam: away,
        defenseTeam: home,
        offSide: awaySide,
        offRoles: awayRoles,
        defRoles: homeRoles,
        offLines: awayLines,
        defLines: homeLines,
        offBase: awayOffBase + awayRoleOff * 0.1,
        defBase: homeDefBase + homeRoleDef * 0.1,
        synergyOff: awaySynergy,
        synergyDef: homeSynergy,
      }
    }
    return {
      offenseTeam: home,
      defenseTeam: away,
      offSide: homeSide,
      offRoles: homeRoles,
      defRoles: awayRoles,
      offLines: homeLines,
      defLines: awayLines,
      offBase: homeOffBase + homeRoleOff * 0.1,
      defBase: awayDefBase + awayRoleDef * 0.1,
      synergyOff: homeSynergy,
      synergyDef: awaySynergy,
    }
  }

  for (let i = 0; i < totalPossessions; i += 1) {
    const c = context(offense)
    const shotType = shotTypeFromMix(c.offSide.shotMix, offense === 'away' ? homeSide.defenseStyle : awaySide.defenseStyle)

    const shooter = pickWeighted(c.offenseTeam.roster, (p) => {
      const shotSkill = shotType === 'rim' ? p.rim : shotType === 'mid' ? p.mid : p.three
      const role = c.offRoles[p.name]
      const roleShare = role.offenseRole === 'Primary Option' ? 1.5 : role.offenseRole === 'Secondary Option' ? 1.25 : role.offenseRole === 'Creator' ? 1.12 : 1
      return (8 + p.usage) * roleShare * (shotSkill / 100) * (0.75 + p.creation[c.offSide.creationFocus] / 100) * (role.offenseFit / 90)
    })

    const defender = pickWeighted(c.defenseTeam.roster, (p) => {
      const role = c.defRoles[p.name]
      const roleImpact = role.defenseRole === 'Rim Protector' && shotType === 'rim' ? 1.25 : role.defenseRole === 'Point-of-Attack' && c.offSide.creationFocus !== 'post' ? 1.15 : 1
      return p.defense * roleImpact * (role.defenseFit / 90)
    })

    c.offLines[shooter.name].min += 0.45
    c.defLines[defender.name].min += 0.45

    const roleMismatchPenalty = clamp((70 - c.offRoles[shooter.name].offenseFit) / 500, 0, 0.08)
    const turnoverRate = clamp(
      0.105 + (c.defBase + c.synergyDef - (shooter.playmaking + c.offBase + c.synergyOff)) / 430 + roleMismatchPenalty + (Math.random() * 0.03 - 0.015),
      0.08,
      0.2,
    )

    if (Math.random() < turnoverRate) {
      c.offLines[shooter.name].tov += 1
      if (Math.random() < 0.65) c.defLines[defender.name].stl += 1
      offense = offense === 'away' ? 'home' : 'away'
      continue
    }

    const shotSkill = shotType === 'rim' ? shooter.rim : shotType === 'mid' ? shooter.mid : shooter.three
    const styleBoost =
      (c.offSide.offenseStyle === '5-Out' && shotType === 'three' ? 2.5 : 0)
      + (c.offSide.offenseStyle === 'Inside-Out' && shotType === 'rim' ? 2.5 : 0)
      + (c.offSide.offenseStyle === 'Pace & Space' && c.offSide.creationFocus === 'transition' ? 2 : 0)
    const defenseCounter =
      ((offense === 'away' ? homeSide.defenseStyle : awaySide.defenseStyle) === 'Drop' && shotType === 'rim' ? 2.2 : 0)
      + ((offense === 'away' ? homeSide.defenseStyle : awaySide.defenseStyle) === 'Zone' && shotType === 'rim' ? 1.6 : 0)
      + ((offense === 'away' ? homeSide.defenseStyle : awaySide.defenseStyle) === 'Switch' && c.offSide.creationFocus === 'pnr' ? 1.3 : 0)

    const makeRate = clamp(
      0.43
      + (shotSkill + shooter.offense + c.offBase + c.synergyOff - (defender.defense + c.defBase + c.synergyDef)) / 365
      + styleBoost / 100
      - defenseCounter / 100
      - roleMismatchPenalty
      + (Math.random() * 0.1 - 0.05),
      shotType === 'three' ? 0.24 : 0.34,
      shotType === 'three' ? 0.54 : 0.73,
    )

    c.offLines[shooter.name].fga += 1
    if (shotType === 'three') c.offLines[shooter.name].tpa += 1

    if (Math.random() < makeRate) {
      const pts = shotType === 'three' ? 3 : 2
      c.offLines[shooter.name].pts += pts
      c.offLines[shooter.name].fgm += 1
      if (shotType === 'three') c.offLines[shooter.name].tpm += 1

      const assistRate = clamp(0.48 + (c.offSide.creationFocus === 'motion' ? 0.09 : 0) + c.offBase / 1000, 0.32, 0.76)
      if (Math.random() < assistRate) {
        const passer = pickWeighted(c.offenseTeam.roster.filter((p) => p.name !== shooter.name), (p) => p.playmaking * (c.offRoles[p.name].offenseRole === 'Creator' ? 1.2 : 1))
        c.offLines[passer.name].ast += 1
      }

      if (offense === 'away') awayScore += pts
      else homeScore += pts
    } else {
      const blockRate = clamp(0.05 + (defender.defense - shooter.offense) / 320 + (shotType === 'rim' ? 0.02 : 0), 0.02, 0.15)
      if (Math.random() < blockRate) c.defLines[defender.name].blk += 1

      const orebRate = clamp(0.24 + (avg(c.offenseTeam.roster.map((p) => p.rebounding)) - avg(c.defenseTeam.roster.map((p) => p.rebounding))) / 260, 0.17, 0.35)
      if (Math.random() < orebRate) {
        const oreb = pickWeighted(c.offenseTeam.roster, (p) => p.rebounding)
        c.offLines[oreb.name].reb += 1
        if (Math.random() < 0.35) continue
      } else {
        const dreb = pickWeighted(c.defenseTeam.roster, (p) => p.rebounding)
        c.defLines[dreb.name].reb += 1
      }
    }

    offense = offense === 'away' ? 'home' : 'away'
  }

  const finalize = (team: TeamTemplate, lines: Record<string, PlayerLine>) =>
    team.roster.map((p) => ({ ...lines[p.name], min: Number((lines[p.name].min * 2.4).toFixed(1)) }))

  log.push(`${away.name} | Off style ${awaySide.offenseStyle}, Def style ${awaySide.defenseStyle}, Creation ${awaySide.creationFocus}`)
  log.push(`${home.name} | Off style ${homeSide.offenseStyle}, Def style ${homeSide.defenseStyle}, Creation ${homeSide.creationFocus}`)
  log.push(`Role fit (OFF/DEF): ${away.name} ${Math.round(awayRoleOff)}/${Math.round(awayRoleDef)} vs ${home.name} ${Math.round(homeRoleOff)}/${Math.round(homeRoleDef)}`)
  log.push(`Pace (possessions per team): ${gamePace}`)

  return {
    away: { name: away.name, score: awayScore, lines: finalize(away, awayLines) },
    home: { name: home.name, score: homeScore, lines: finalize(home, homeLines) },
    log,
  }
}

function TeamTable({ title, lines }: { title: string; lines: PlayerLine[] }) {
  return (
    <section className="table-card">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr><th>Player</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>TOV</th><th>FG</th><th>3PT</th></tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.name}>
              <td>{line.name} ({line.pos})</td><td>{line.min}</td><td>{line.pts}</td><td>{line.reb}</td><td>{line.ast}</td><td>{line.stl}</td><td>{line.blk}</td><td>{line.tov}</td><td>{line.fgm}/{line.fga}</td><td>{line.tpm}/{line.tpa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function TeamSkills({ team, side }: { team: TeamTemplate; side: PregameSide }) {
  return (
    <div className="skills-wrap">
      <h3>Player roles + visible skills</h3>
      <table>
        <thead>
          <tr><th>Player</th><th>Off role</th><th>Def role</th><th>OFF</th><th>DEF</th><th>PM</th><th>REB</th><th>RIM</th><th>MID</th><th>3PT</th></tr>
        </thead>
        <tbody>
          {team.roster.map((p) => {
            const roles = getPlayerRoles(p, side)
            return (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>{roles.offenseRole} ({Math.round(roles.offenseFit)})</td>
                <td>{roles.defenseRole} ({Math.round(roles.defenseFit)})</td>
                <td>{p.offense}</td><td>{p.defense}</td><td>{p.playmaking}</td><td>{p.rebounding}</td><td>{p.rim}</td><td>{p.mid}</td><td>{p.three}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SideSetup({ label, side, onChange, excludeTeamId }: { label: string; side: PregameSide; onChange: (next: PregameSide) => void; excludeTeamId?: string }) {
  const team = teams.find((t) => t.id === side.teamId) ?? teams[0]
  const mix = normalizeMix(side.shotMix)

  const updateTeam = (teamId: string) => {
    const fresh = defaultSide(teamId)
    onChange({ ...fresh, offenseStyle: side.offenseStyle, defenseStyle: side.defenseStyle, shotMix: side.shotMix, creationFocus: side.creationFocus })
  }

  return (
    <section className="setup-card">
      <h2>{label}</h2>
      <label>Team
        <select value={side.teamId} onChange={(e) => updateTeam(e.target.value)}>
          {teams.filter((t) => t.id !== excludeTeamId).map((teamOption) => <option key={teamOption.id} value={teamOption.id}>{teamOption.name}</option>)}
        </select>
      </label>

      <div className="grid-two">
        <label>Offense Style
          <select value={side.offenseStyle} onChange={(e) => onChange({ ...side, offenseStyle: e.target.value as OffenseStyle })}>
            {offenseStyles.map((style) => <option key={style} value={style}>{style}</option>)}
          </select>
        </label>
        <label>Defense Style
          <select value={side.defenseStyle} onChange={(e) => onChange({ ...side, defenseStyle: e.target.value as DefenseStyle })}>
            {defenseStyles.map((style) => <option key={style} value={style}>{style}</option>)}
          </select>
        </label>
      </div>

      <label>How you get shots (creation focus)
        <select value={side.creationFocus} onChange={(e) => onChange({ ...side, creationFocus: e.target.value as CreationType })}>
          {creationTypes.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </select>
      </label>

      <div className="grid-two">
        <label>Primary scorer
          <select value={side.primaryScorer} onChange={(e) => onChange({ ...side, primaryScorer: e.target.value })}>
            {team.roster.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
        </label>
        <label>Secondary scorer
          <select value={side.secondaryScorer} onChange={(e) => onChange({ ...side, secondaryScorer: e.target.value })}>
            {team.roster.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
        </label>
      </div>

      <div className="mix-grid">
        <label>Rim shots ({Math.round(mix.rim)}%)<input type="range" min={10} max={70} value={side.shotMix.rim} onChange={(e) => onChange({ ...side, shotMix: { ...side.shotMix, rim: Number(e.target.value) } })} /></label>
        <label>Midrange ({Math.round(mix.mid)}%)<input type="range" min={10} max={55} value={side.shotMix.mid} onChange={(e) => onChange({ ...side, shotMix: { ...side.shotMix, mid: Number(e.target.value) } })} /></label>
        <label>Three-point ({Math.round(mix.three)}%)<input type="range" min={15} max={65} value={side.shotMix.three} onChange={(e) => onChange({ ...side, shotMix: { ...side.shotMix, three: Number(e.target.value) } })} /></label>
      </div>

      <p className="note">Team fit synergy for selected styles: <strong>{Math.round((team.offenseFit[side.offenseStyle] + team.defenseFit[side.defenseStyle]) / 2)}</strong></p>
      <TeamSkills team={team} side={side} />
    </section>
  )
}

export default function App() {
  const [awaySide, setAwaySide] = useState<PregameSide>(defaultSide('waves'))
  const [homeSide, setHomeSide] = useState<PregameSide>(defaultSide('monarchs'))
  const [result, setResult] = useState<GameResult | null>(null)
  const canSim = useMemo(() => awaySide.teamId !== homeSide.teamId, [awaySide.teamId, homeSide.teamId])

  return (
    <main className="page">
      <header>
        <p className="eyebrow">Pregame Setup + Game Sim</p>
        <h1>5v5 NBA Game Simulator</h1>
        <p>Every player now has offensive and defensive roles, and all player skills are visible in pregame so better fit + better skills lead to better results.</p>
      </header>

      <section className="setup-grid">
        <SideSetup label="Away Team" side={awaySide} onChange={setAwaySide} excludeTeamId={homeSide.teamId} />
        <SideSetup label="Home Team" side={homeSide} onChange={setHomeSide} excludeTeamId={awaySide.teamId} />
      </section>

      <div className="actions">
        <button disabled={!canSim} onClick={() => setResult(simulateGame(awaySide, homeSide))}>Simulate Game</button>
      </div>

      {result ? (
        <>
          <section className="scoreline">
            <h2>{result.away.name} {result.away.score} - {result.home.score} {result.home.name}</h2>
            <ul>{result.log.map((line) => <li key={line}>{line}</li>)}</ul>
          </section>
          <section className="tables">
            <TeamTable title={result.away.name} lines={result.away.lines} />
            <TeamTable title={result.home.name} lines={result.home.lines} />
          </section>
        </>
      ) : null}
    </main>
  )
}
