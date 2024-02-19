import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useEffect } from 'react';
import Linea from './components/Linea';
import Componente from './components/Componente';

const App = () => {

  const [componentes, setComponentes] = useState([
    { x: 100, y: 100, width: 100, height: 50, type: "Entidad", text: "entidad" },
    { x: 200, y: 100, size: 50, type: "Relacion", text: "relacion" },
    { x: 300, y: 100, width: 100, height: 50, type: "Entidad", text: "entidad" }
  ]);

  const [enlaces, setEnlaces] = useState([
    { idPrimero: 0, idSegundo: 1 },
    { idPrimero: 1, idSegundo: 2 }

  ])

  useEffect(() => {
    console.log("texto de prueba")
  }, []);

  const handleDragMove2 = (e, key) => {
    const newComponents = [...componentes];
    newComponents[key] = {
      ...newComponents[key],
      x: e.target.x(),
      y: e.target.y()
    };
    setComponentes(newComponents);
  };

  const handleDoubleClick = (e, id) => {
    var componentesCopy = [...componentes];
    componentesCopy[id] = {
      ...componentesCopy[id],
      text: "otra cosa"
    }
    setComponentes(componentesCopy);
    console.log(componentes);
  }
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>

        {componentes.map((componente, index) => (
          <Componente
            key={index}
            type={componente.type}
            x={componente.x}
            y={componente.y}
            width={componente.width}
            height={componente.height}
            size={componente.size}
            text={componente.text}
            onDragMove={(e) => handleDragMove2(e, index)}
            onDragEnd={(e) => handleDragMove2(e, index)}
            onDblClick={(e) => handleDoubleClick(e, index)}
          />
        ))}

        {enlaces.map((enlace, index) => (
          <Linea
            key={index}
            figuraA={componentes[enlace.idPrimero]}
            figuraB={componentes[enlace.idSegundo]}
          />
        ))}

      </Layer>
    </Stage>
  );
};

export default App;
