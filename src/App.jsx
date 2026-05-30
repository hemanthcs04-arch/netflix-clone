import { useState } from 'react';
import Index from './pages/Index';
import Splash from './components/Splash';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <Splash onFinish={() => setShowSplash(false)} />}
      <Index />
    </>
  );
}

export default App;
