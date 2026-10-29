import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MissionDone, RoundDone } from './components/Celebration';
import { Confetti } from './components/Confetti';
import { HomeScreen } from './components/HomeScreen';
import { MissionIntro } from './components/MissionIntro';
import { SettingsScreen } from './components/SettingsScreen';
import { StatsScreen } from './components/StatsScreen';
import { WordGame } from './components/WordGame';
import { useGameState } from './hooks/useGameState';
import { useSettings } from './hooks/useSettings';
import { useSound } from './hooks/useSound';
import { useStats } from './hooks/useStats';

export default function App() {
  const settings = useSettings();
  const statsApi = useStats();

  const statsHooks = useMemo(
    () => ({
      onGameStart: statsApi.recordGameStart,
      onWrong: statsApi.recordWrong,
      onWordComplete: statsApi.recordWordComplete,
      onMissionComplete: statsApi.recordMissionComplete,
      onRoundComplete: statsApi.recordRoundComplete,
    }),
    [
      statsApi.recordGameStart,
      statsApi.recordWrong,
      statsApi.recordWordComplete,
      statsApi.recordMissionComplete,
      statsApi.recordRoundComplete,
    ],
  );

  const game = useGameState(settings.activeWords, statsHooks);
  const { play } = useSound(game.soundEnabled);
  const [wordComplete, setWordComplete] = useState(false);
  const advancing = useRef(false);

  useEffect(() => {
    setWordComplete(false);
    advancing.current = false;
  }, [game.currentWord?.id]);

  const handleSelect = useCallback(
    (id: string) => {
      if (wordComplete || advancing.current) return;
      const result = game.selectLetter(id);
      if (result === 'correct') play('correct');
      else if (result === 'wrong') play('wrong');
      else if (result === 'word-done') {
        play('complete');
        setWordComplete(true);
      } else if (result === 'noop') play('tap');
    },
    [game, play, wordComplete],
  );

  const advanceAfterWord = game.advanceAfterWord;

  const handleNextWord = useCallback(() => {
    if (advancing.current) return;
    advancing.current = true;
    setWordComplete(false);
    advanceAfterWord();
  }, [advanceAfterWord]);

  useEffect(() => {
    if (game.screen === 'mission-intro') play('mission');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mission change
  }, [game.screen, game.currentMission?.id]);

  return (
    <div className="app">
      <Confetti active={game.showConfetti} />

      {game.screen === 'home' && (
        <HomeScreen
          onStart={(level) => {
            play('mission');
            game.startGame(level);
          }}
          soundEnabled={game.soundEnabled}
          onToggleSound={game.toggleSound}
          onSettings={() => {
            play('tap');
            game.openSettings();
          }}
          onStats={() => {
            play('tap');
            game.openStats();
          }}
          canPlay={game.canPlay}
          starsTotal={statsApi.stats.starsTotal}
        />
      )}

      {game.screen === 'settings' && (
        <SettingsScreen
          words={settings.allEditableWords}
          isEnabled={settings.isEnabled}
          onToggle={settings.setWordEnabled}
          onEmoji={settings.setWordEmoji}
          onWordText={settings.setWordText}
          onAdd={settings.addCustomWord}
          onRemoveCustom={settings.removeCustomWord}
          onReset={settings.resetWords}
          onBack={game.goHome}
        />
      )}

      {game.screen === 'stats' && (
        <StatsScreen
          stats={statsApi.stats}
          words={settings.allEditableWords}
          onReset={statsApi.resetStats}
          onBack={game.goHome}
        />
      )}

      {game.screen === 'mission-intro' && game.currentMission && (
        <MissionIntro
          mission={game.currentMission}
          missionNumber={game.missionIndex + 1}
          totalMissions={game.totalMissions}
          onContinue={() => {
            play('tap');
            game.beginPlaying();
          }}
        />
      )}

      {game.screen === 'playing' && game.currentMission && game.currentWord && (
        <WordGame
          mission={game.currentMission}
          word={game.currentWord}
          wordIndex={game.wordIndex}
          totalWords={game.words.length}
          filled={game.filled}
          letterChoices={game.letterChoices}
          lexieMood={game.lexieMood}
          shake={game.shake}
          stars={game.stars}
          onSelectLetter={handleSelect}
          wordComplete={wordComplete}
          onNextWord={handleNextWord}
          onHome={game.goHome}
        />
      )}

      {game.screen === 'mission-done' && game.currentMission && (
        <MissionDone
          mission={game.currentMission}
          stars={game.stars}
          isLast={game.missionIndex + 1 >= game.totalMissions}
          onContinue={() => {
            play('mission');
            game.nextMission();
          }}
        />
      )}

      {game.screen === 'round-done' && (
        <RoundDone
          stars={game.stars}
          onHome={game.goHome}
          onReplay={() => {
            play('mission');
            game.startGame(game.level);
          }}
        />
      )}
    </div>
  );
}
