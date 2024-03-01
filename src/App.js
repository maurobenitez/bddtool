import Diagrama from './components/Diagrama';
import BarraLateral from './components/BarraLateral';
import styles from './App.module.css';
import { useState } from 'react';

const App = () => {
  const [mode, setMode] = useState("normal");

  const cbfunction = (estado) => {
    setMode(estado);
  }

  return (
    <div className={styles.container}>
      <BarraLateral cb={cbfunction} modo={mode} />
      <Diagrama cb={cbfunction} modo={mode} />
    </div>
  );
};

export default App;
