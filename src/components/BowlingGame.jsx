import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, useBox, useSphere, usePlane } from "@react-three/cannon";
import { Vector3 } from "three";

const BowlingBall = ({ position }) => {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position.toArray(),
    args: [0.5],
  }));

  // Handle key press to apply force
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        api.applyForce([0, 0, -5], [0, 0, 0]);
        break;
      case "ArrowDown":
        api.applyForce([0, 0, 5], [0, 0, 0]);
        break;
      case "ArrowLeft":
        api.applyForce([-5, 0, 0], [0, 0, 0]);
        break;
      case "ArrowRight":
        api.applyForce([5, 0, 0], [0, 0, 0]);
        break;
      default:
        break;
    }
  };

  // Add event listener for keydown
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

BowlingBall.propTypes = {
  position: PropTypes.instanceOf(Vector3).isRequired,
};

const BowlingPin = ({ position }) => {
  const [ref] = useBox(() => ({
    mass: 0.5,
    position: position.toArray(),
    args: [0.2, 1, 0.2],
  }));

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[0.2, 1, 0.2]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

BowlingPin.propTypes = {
  position: PropTypes.instanceOf(Vector3).isRequired,
};

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

const App = () => {
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
        camera={{
          position: [0, 5, 10],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Physics
          gravity={[0, -9.81, 0]} // Ensure gravity is set to simulate realistic physics
          allowSleep={false} // Keep physics objects active to avoid unnecessary sleeping
        >
          <BowlingLane />
          <BowlingBall position={new Vector3(0, 0.5, 0)} /> {/* Position above the lane to avoid initial collision */}
          {pinPositions.map((pos, index) => (
            <BowlingPin key={index} position={pos} />
          ))}
        </Physics>
        <OrbitControls
          enableZoom={false}
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