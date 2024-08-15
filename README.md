# bowling

 + Borrows game world template from Matter.js 'xxx' demo


To use custom 3D models:
-  for obj files: @react-three/drei's useLoader hook


## Bowling in Three-Fiber

+ The three-fiber canvas takes its dimensions from its parent container. If you don't set them the canvas will expand in size indefinitely. Size set by 'div.parent-container'


tech used:
- matter.js = 
- poly decomp = 
- prop-types = 
- react hotkeys hook
- three.js: fiber, drei, cannon = 
- zustand = 
- cannon.js: physics engine/collision = 
- leva = creates an input control panel to change lights and ball movement




Pixel Value

clip-path: polygon( 0px 0px, 0px 0px, 0px 0px, 50px 0px, 294px 49px, 287px 99px, 239px 70px, 185px 82px, 115px 60px, 25px 103px, 39px 161px, 17px 197px, 17px 241px, 29px 299px, 135px 353px, 164px 400px, 189px 447px, 423px 485px, 438px 428px, 384px 347px, 224px 339px, 188px 292px, 98px 226px, 164px 182px, 190px 224px, 303px 280px, 428px 286px, 419px 228px, 259px 213px, 255px 192px, 274px 183px, 336px 200px, 428px 156px, 392px 119px, 455px 117px, 472px 65px, 392px 43px, 500px 0px, 494px 500px, 0px 500px);

Percentage Value
clip-path: polygon( 0.00% 0.00%, 0.00% 0.00%, 0.00% 0.00%, 10.00% 0.00%, 58.80% 9.80%, 57.40% 19.80%, 47.80% 14.00%, 37.00% 16.40%, 23.00% 12.00%, 5.00% 20.60%, 7.80% 32.20%, 3.40% 39.40%, 3.40% 48.20%, 5.80% 59.80%, 27.00% 70.60%, 32.80% 80.00%, 37.80% 89.40%, 84.60% 97.00%, 87.60% 85.60%, 76.80% 69.40%, 44.80% 67.80%, 37.60% 58.40%, 19.60% 45.20%, 32.80% 36.40%, 38.00% 44.80%, 60.60% 56.00%, 85.60% 57.20%, 83.80% 45.60%, 51.80% 42.60%, 51.00% 38.40%, 54.80% 36.60%, 67.20% 40.00%, 85.60% 31.20%, 78.40% 23.80%, 91.00% 23.40%, 94.40% 13.00%, 78.40% 8.60%, 100% 0.00%, 98.80% 100%, 0.00% 100% );

Dynamic Responsive Value ( Only this code working for lock position )
clip-path: polygon(0px 0px, 0px 0px, 0px 0px, 50px 0px, 294px 49px, calc( 100% - 213px) 99px, calc( 100% - 261px) calc( 100% - 430px), calc( 100% - 315px) calc( 100% - 418px), 115px calc( 100% - 440px), 25px calc( 100% - 397px), 39px 161px, 17px 197px, 17px 241px, 29px 299px, 135px 353px, 164px 400px, 189px 447px, 423px 485px, 438px 428px, 384px 347px, 224px 339px, 188px 292px, 98px 226px, 164px 182px, 190px 224px, 303px 280px, 428px 286px, 419px 228px, 259px 213px, 255px 192px, 274px 183px, 336px 200px, 428px 156px, 392px 119px, 455px 117px, 472px 65px, 392px 43px, 500px 0px, 494px 500px, 0px 500px);