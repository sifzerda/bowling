// MazeComponent.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Plane, PerspectiveCamera, OrbitControls } from '@react-three/drei';

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

const MazeComponent = ({ width = 21, height = 21 }) => {
    const maze = generateMaze(width, height);

    // Define entrance and exit positions
    const entrance = [1, 0, 1];
    const exit = [width * 2 - 1, 0, height * 2 - 1];

    return (
        <div className="parent-container">
            <Canvas className="canvas" shadows>
                <PerspectiveCamera makeDefault position={[0, 10, 30]} />
                <OrbitControls />
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
                    args={[width * 2, height * 2, 1, 1]} // width, height, segmentsWidth, segmentsHeight
                    position={[width, 0, height]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    receiveShadow
                >
                    <meshStandardMaterial color="lightgray" />
                </Plane>

                {/* Render entrance and exit archways */}
                <Archway position={[1, 0, 1]} />
                <Archway position={[width * 2 - 1, 0, height * 2 - 1]} />
            </Canvas>
        </div>
    );
};

export default MazeComponent;