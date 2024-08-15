import { useLoader } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useSphere } from '@react-three/cannon';

// Custom Bowling Ball Component
const CustomBowlingBall = ({ position }) => {
  const obj = useLoader(OBJLoader, '../../public/models/Bowling_Ball_OBJ.obj'); // Adjust the path if needed

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position.toArray(),
    args: [0.5], // Adjust this if necessary
  }));

  // You might need to adjust the scale and position of the loaded OBJ model
  return (
    <mesh ref={ref} castShadow>
      <primitive object={obj} scale={[1, 1, 1]} />
    </mesh>
  );
};