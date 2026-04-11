import { lazy, Suspense } from 'react';
import { useRoute } from './hooks/useRoute';

const SpaceExperience = lazy(() => import('./experiences/space/SpaceExperience'));
const ExperienceSelector = lazy(() => import('./components/ExperienceSelector'));

const DEV_DEFAULT_EXPERIENCE = '/space';

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.7rem',
        letterSpacing: '0.3em',
        color: 'rgba(232,244,248,0.3)',
        textTransform: 'uppercase',
      }}>
        Loading...
      </p>
    </div>
  );
}

export default function App() {
  const { route, navigate } = useRoute();

  const effectiveRoute = route === '/' && DEV_DEFAULT_EXPERIENCE
    ? DEV_DEFAULT_EXPERIENCE
    : route;

  return (
    <Suspense fallback={<LoadingScreen />}>
      {effectiveRoute === '/space' && <SpaceExperience navigate={navigate} />}
      {effectiveRoute === '/' && <ExperienceSelector navigate={navigate} />}
    </Suspense>
  );
}
