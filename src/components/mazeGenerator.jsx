import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Plane, PerspectiveCamera, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

// Maze generation function
function generateMaze(width, height) {
    const maze = Array.from({ length: height }, () => Array(width).fill(1));

    function carve(x, y) {
        maze[y][x] = 0;
        const directions = [
            [2, 0], [-2, 0], [0, 2], [0, -2]
        ].sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < width && ny < height && maze[ny][nx] === 1) {
                maze[ny - dy / 2][nx - dx / 2] = 0;
                carve(nx, ny);
            }
        }
    }

    carve(1, 1);
    return maze;
}

// Helper function to create an archway
const Archway = ({ position }) => (
    <>
        {/* Left Pillar */}
        <Box
            args={[0.5, 10, 0.5]} // Width, height, depth
            position={[position[0] - 0.9, 5, position[2]]}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial color="darkgray" />
        </Box>
        {/* Right Pillar */}
        <Box
            args={[0.5, 10, 0.5]} // Width, height, depth
            position={[position[0] + 0.75, 5, position[2]]}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial color="darkgray" />
        </Box>
        {/* Top of the archway */}
        <Box
            args={[2.6, 1, 0.5]} // Width, height, depth
            position={[position[0], 9.5, position[2]]} // Adjusted position to sit on top of the pillars
            castShadow
            receiveShadow
        >
            <meshStandardMaterial color="darkgray" />
        </Box>
    </>
);

const Player = ({ playerRef }) => {
    const controlsRef = useRef();
    const [jumping, setJumping] = useState(false);
    const [velocityY, setVelocityY] = useState(0);
    const [isGrounded, setIsGrounded] = useState(true);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (controlsRef.current) {
                controlsRef.current.keys[event.key] = true;
                if (event.key === ' ' && isGrounded) {
                    setJumping(true);
                }
            }
        };

        const handleKeyUp = (event) => {
            if (controlsRef.current) {
                controlsRef.current.keys[event.key] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isGrounded]);

    useFrame(({ clock }) => {
        const speed = 0.1;
        const gravity = -0.01;
        const moveDistance = speed;

        if (playerRef.current && controlsRef.current) {
            const pos = playerRef.current.position;
            const direction = new THREE.Vector3();
            playerRef.current.getWorldDirection(direction);

            if (controlsRef.current.keys['w']) {
                pos.add(direction.multiplyScalar(moveDistance));
            }
            if (controlsRef.current.keys['s']) {
                pos.sub(direction.multiplyScalar(moveDistance));
            }
            if (controlsRef.current.keys['a']) {
                direction.cross(new THREE.Vector3(0, 1, 0));
                pos.add(direction.multiplyScalar(moveDistance));
            }
            if (controlsRef.current.keys['d']) {
                direction.cross(new THREE.Vector3(0, -1, 0));
                pos.add(direction.multiplyScalar(moveDistance));
            }

            // Handle jumping
            if (jumping && isGrounded) {
                setVelocityY(0.2); // Initial jump velocity
                setJumping(false);
                setIsGrounded(false);
            }

            // Apply gravity
            if (!isGrounded) {
                setVelocityY((prevVelocity) => prevVelocity + gravity);
            }

            // Update player position with gravity
            pos.y += velocityY;

            // Simple collision check with the ground
            if (pos.y <= 0) {
                pos.y = 0;
                setIsGrounded(true);
                setVelocityY(0);
            }
        }
    });

    return <PointerLockControls ref={controlsRef} />;
};

const MazeComponent = ({ width = 21, height = 21 }) => {
    const maze = generateMaze(width, height);
    const playerRef = useRef(null);

    return (
        <div className="parent-container">
            <Canvas className="canvas" shadows>
                {/* Positioning the camera higher and farther from the maze */}
                <PerspectiveCamera makeDefault position={[0, 10, 15]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} />

                {/* Render the maze */}
                {maze.map((row, y) =>
                    row.map((cell, x) =>
                        cell === 1 ? (
                            <Box
                                key={`${x}-${y}`}
                                args={[1, 10, 1]}
                                position={[x * 2, 5, y * 2]}
                                castShadow
                                receiveShadow
                            >
                                <meshStandardMaterial color="gray" />
                            </Box>
                        ) : null
                    )
                )}

                {/* Render the floor */}
                <Plane
                    args={[width * 2, height * 2, 1, 1]} // Adjusted width and height
                    position={[width, 0, height]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    receiveShadow
                >
                    <meshStandardMaterial color="lightgray" />
                </Plane>

                {/* Render entrance and exit archways */}
                <Archway position={[1, 0, 1]} />
                <Archway position={[width * 2 - 1, 0, height * 2 - 1]} />

                {/* Render the player */}
                <Player playerRef={playerRef} />
            </Canvas>
        </div>
    );
};

export default MazeComponent;