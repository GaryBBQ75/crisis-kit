import { useState } from 'react';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Checklist from './screens/Checklist';
import Reflexes from './screens/Reflexes';
import Family from './screens/Family';
import FirstAid from './screens/FirstAid';

export type Screen = 'home' | 'profile' | 'checklist' | 'reflexes' | 'family' | 'firstaid' | 'map';

const titles: Record<Screen, string> = {
  home: 'Crisis Kit',
  profile: 'Mon foyer',
  checklist: 'Checklist et provisions',
  reflexes: 'Fiches réflexes',
  family: 'Plan familial',
  firstaid: 'Premiers secours',
  map: 'Carte hors ligne',
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const go = (s: Screen) => setScreen(s);

  return (
    <div className="app">
      <header>
        {screen !== 'home' && (
          <button className="back" onClick={() => go('home')} aria-label="Retour à l'accueil">
            ←
          </button>
        )}
        <h1>{titles[screen]}</h1>
      </header>
      <main>
        {screen === 'home' && <Home go={go} />}
        {screen === 'profile' && <Profile />}
        {screen === 'checklist' && <Checklist />}
        {screen === 'reflexes' && <Reflexes />}
        {screen === 'family' && <Family />}
        {screen === 'firstaid' && <FirstAid />}
        {screen === 'map' && (
          <p className="muted">
            La carte hors ligne arrive en V1 : téléchargement d'une zone (rayon de 50, 100 ou 200 km) et points
            importants.
          </p>
        )}
      </main>
    </div>
  );
}
