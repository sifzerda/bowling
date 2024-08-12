import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Plane, Sphere } from "@react-three/drei";
import { Vector3 } from "three";

const BowlingBall = ({ position }) => {
  const [velocity, setVelocity] = useState(new Vector3(0, 0, 0));
  const ballRef = useRef();

  // Update ball position based on velocity
  useFrame(() => {
    if (ballRef.current) {
      ballRef.current.position.add(velocity);
    }
  });

  // Handle key press to change velocity
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        setVelocity(new Vector3(0, 0, -0.1));
        break;
      case "ArrowDown":
        setVelocity(new Vector3(0, 0, 0.1));
        break;
      case "ArrowLeft":
        setVelocity(new Vector3(-0.1, 0, 0));
        break;
      case "ArrowRight":
        setVelocity(new Vector3(0.1, 0, 0));
        break;
      default:
        break;
    }
  };

  // Add event listener for keydown
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Sphere ref={ballRef} args={[0.5, 32, 32]} position={position}>
      <meshStandardMaterial color="blue" />
    </Sphere>
  );
};

BowlingBall.propTypes = {
  position: PropTypes.instanceOf(Vector3).isRequired,
};

const BowlingLane = () => {
  return (
    <Plane args={[5, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <meshStandardMaterial color="tan" />
    </Plane>
  );
};

const App = () => {
  return (
    <div className='parent-container'>
    <Canvas 
      camera={{ 
        position: [0, 5, 10], 
        fov: 50, 
        near: 0.1, 
        far: 1000 
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <BowlingLane />
      <BowlingBall position={new Vector3(0, 0, 0)} />
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