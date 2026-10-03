import { ProgressProvider } from '../context/ProgressContext';
import { AudioProvider } from '../context/AudioContext';
import AppRouter from './router';

export default function App() {
  return (
    <ProgressProvider>
      <AudioProvider>
        <AppRouter />
      </AudioProvider>
    </ProgressProvider>
  );
}
