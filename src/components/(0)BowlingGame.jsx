import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import { Physics, useBox, useSphere, usePlane, Debug } from '@react-three/cannon';
import { Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useFrame } from '@react-three/fiber';

// Lights Component
const Lights = () => {
  const ambientCtl = useControls('Ambient Light', {
    visible: false,
    intensity: { value: 1.0, min: 0, max: 1.0, step: 0.1 },
  });

  const directionalCtl = useControls('Directional Light', {
    visible: true,
    position: { x: 3.3, y: 1.0, z: 4.4 },
    castShadow: true,
  });

  const pointCtl = useControls('Point Light', {
    visible: false,
    position: { x: 2, y: 0, z: 0 },
    castShadow: true,
  });

  const spotCtl = useControls('Spot Light', {
    visible: false,
    position: { x: 3, y: 2.5, z: 1 },
    castShadow: true,
  });

  return (
    <>
      <ambientLight visible={ambientCtl.visible} intensity={ambientCtl.intensity} />
      <directionalLight
        visible={directionalCtl.visible}
        position={[directionalCtl.position.x, directionalCtl.position.y, directionalCtl.position.z]}
        castShadow={directionalCtl.castShadow}
      />
      <pointLight visible={pointCtl.visible} position={[pointCtl.position.x, pointCtl.position.y, pointCtl.position.z]} castShadow={pointCtl.castShadow} />
      <spotLight visible={spotCtl.visible} position={[spotCtl.position.x, spotCtl.position.y, spotCtl.position.z]} castShadow={spotCtl.castShadow} />
    </>
  );
};

// BowlingBall Component with OBJ Model
const BowlingBall = ({ position }) => {
  const { forwardForce, lateralForce } = useControls('Ball Physics', {
    forwardForce: { value: 5, min: 1, max: 20, step: 0.5 },
    lateralForce: { value: 5, min: 1, max: 20, step: 0.5 },
  });

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position.toArray(),
    args: [0.5], // Adjust based on your model's scale
  }));

  const [obj, setObj] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load('/public/models/Ball.obj', (loadedObj) => {
      setObj(loadedObj);
      setLoading(false);
    });
  }, []);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        api.applyForce([0, 0, -forwardForce], [0, 0, 0]);
        break;
      case 'ArrowDown':
        api.applyForce([0, 0, forwardForce], [0, 0, 0]);
        break;
      case 'ArrowLeft':
        api.applyForce([-lateralForce, 0, 0], [0, 0, 0]);
        break;
      case 'ArrowRight':
        api.applyForce([lateralForce, 0, 0], [0, 0, 0]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [forwardForce, lateralForce]);

  return (
    <mesh ref={ref} castShadow>
      {loading ? (
        <meshBasicMaterial color="gray" />
      ) : (
        <primitive object={obj} />
      )}
    </mesh>
  );
};

// BowlingPin Component with Custom OBJ Model
const BowlingPin = ({ position }) => {
  const [ref, api] = useBox(() => ({
    mass: 0.5,
    position: position.toArray(),
    args: [0.2, 1, 0.2],
  }));

  const [obj, setObj] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load('/public/models/Pin.obj', (loadedObj) => {
      setObj(loadedObj);
      setLoading(false);
    });
  }, []);

  return (
    <mesh ref={ref} castShadow>
      {loading ? (
        <meshBasicMaterial color="gray" />
      ) : (
        <primitive object={obj} />
      )}
    </mesh>
  );
};

// BowlingLane Component
const BowlingLane = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[5, 20]} />
      <meshStandardMaterial color="tan" />
    </mesh>
  );
};

// Main App Component
const App = () => {
  const { cameraPosition, cameraFov, debugMode } = useControls('Settings', {
    cameraPosition: { value: [0, 5, 10], step: 0.1 },
    cameraFov: { value: 50, min: 30, max: 100, step: 1 },
    debugMode: { value: false }
  });

  const pinPositions = [
    new Vector3(0, 0, -8),
    new Vector3(-0.3, 0, -7.8),
    new Vector3(0.3, 0, -7.8),
    new Vector3(-0.6, 0, -7.6),
    new Vector3(0, 0, -7.6),
    new Vector3(0.6, 0, -7.6),
    new Vector3(-0.9, 0, -7.4),
    new Vector3(-0.3, 0, -7.4),
    new Vector3(0.3, 0, -7.4),
    new Vector3(0.9, 0, -7.4),
  ];

  return (
    <div className="parent-container">
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: cameraFov, near: 0.1, far: 1000 }}
      >
        <Lights />
        <Physics gravity={[0, -9.81, 0]} allowSleep={false}>
          {debugMode && <Debug />}
          <BowlingLane />
          <BowlingBall position={new Vector3(0.5, 0.5, 15)} />
          {pinPositions.map((pos, index) => (
            <BowlingPin key={index} position={pos} />
          ))}
        </Physics>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default App;