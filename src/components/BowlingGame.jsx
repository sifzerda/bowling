import { useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import { Physics, useBox, useSphere, Debug } from '@react-three/cannon';
import { Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

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

// BowlingBall Component
const BowlingBall = ({ position }) => {
  const { forwardForce, lateralForce } = useControls('Ball Physics', {
    forwardForce: { value: 5, min: 1, max: 20, step: 0.5 },
    lateralForce: { value: 5, min: 1, max: 20, step: 0.5 },
  });

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position.toArray(),
    args: [0.5],
  }));

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
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

// BowlingPin Component
const BowlingPin = ({ position }) => {
  const [ref] = useBox(() => ({
    mass: 0.5,
    position: position.toArray(),
    args: [0.2, 1, 0.2],
  }));

  return (
    <mesh ref={ref} castShadow>
      <cylinderGeometry args={[0.2, 0.3, 1, 16]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

// BowlingLane Component
const BowlingLane = () => {
  const [ref] = useBox(() => ({
    position: [0, 0.8, 0],    // change 0.8 to 0.75 or 0.76 to hide the plane
    args: [20, 0.1, 20],      // change 20 to make plane wider
    isStatic: true,          // Makes the lane immovable
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={[20, 0.1, 20]} />  // Update geometry dimensions to match the new width
      <meshStandardMaterial color="grey" />
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

  const obj = useLoader(OBJLoader, '../../public/models/Bowling_Alley_OBJ.obj');
  const ref = useRef();

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
          {/* Render the custom OBJ model directly */}
          <primitive 
            object={obj} 
            ref={ref}
            position={[0, -0.5, 0]}  
            scale={[1, 1, 1]}
            receiveShadow
          />
          <BowlingBall position={new Vector3(0, 1, 0)} />
          {pinPositions.map((pos, index) => (
            <BowlingPin key={index} position={pos} />
          ))}
        </Physics>
        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default App;