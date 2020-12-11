import * as THREE from './three/build/three.module.js';

const loader = new THREE.TextureLoader();
const eightcolors = [
	new THREE.MeshBasicMaterial({ color: 'black' }),
	new THREE.MeshBasicMaterial({ map: loader.load('./resources/red.png') }),
	new THREE.MeshBasicMaterial({ map: loader.load('./resources/green.png') }),
	new THREE.MeshBasicMaterial({ map: loader.load('./resources/yellow.png') }),
	new THREE.MeshBasicMaterial({ map: loader.load('./resources/blue.png') }),
	new THREE.MeshBasicMaterial({ map: loader.load('./resources/magenta.png') }),
	new THREE.MeshBasicMaterial({ map: loader.load('./resources/cyan.png') }),
	new THREE.MeshBasicMaterial({ map: loader.load('./resources/white.png') })
];
function createCube(colorindexes,step) {
    const g = new THREE.BoxBufferGeometry(step,step,step);
	// 立方體的顏色順序為x+,x-,y+,y-,z+,z-
	const m = new THREE.Mesh(g, [
		eightcolors[colorindexes[0]],
		eightcolors[colorindexes[1]],
		eightcolors[colorindexes[2]],
		eightcolors[colorindexes[3]],
		eightcolors[colorindexes[4]],
		eightcolors[colorindexes[5]]
	]);
	return m;
}
function generateMagicCube(size) {
    const magicCube = new THREE.Object3D();
    const step = 2/(size-1);
	for (let z = 0; z < size; z++) {
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				//console.log(x,y,z);
				const cube = createCube([
					x == size-1 ? 1 : 0,
					x == 0 ? 2 : 0,
					y == size-1 ? 3 : 0,
					y == 0 ? 4 : 0,
					z == size-1 ? 5 : 0,
					z == 0 ? 6 : 0
				],step);
				cube.position.set(-1+x*step, -1+y*step, -1+z*step);
				cube.name = `${x + 1}${y + 1}${z + 1}`;
                cube.loc = new THREE.Vector3(-1+x*step, -1+y*step, -1+z*step);
				magicCube.add(cube);
			}
		}
	}
	return magicCube;
}

const sleep = (milliseconds) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
/////z0+x0+z0-x0- 四步一組，可將六個中心方體分兩組輪換，其他方體不動。
/////用此招一次，中間加步驟改變中心體的方向，再逆用此招一次，可用來調整中心體的方向。
///// z0+ x0+ z0- x0- 得 (0,1,0)->(0,0,1)->(-1,0,0)->(0,1,0) 與 (1,0,0)->(0,-1,0)->(0,0,-1)->(1,0,0)
///// z0- x0+ z0+ x0- 得 (0,1,0)->(0,0,1)->(1,0,0)->(0,1,0) 與 (-1,0,0)->(0,-1,0)->(0,0,-1)->(-1,0,0)
///// z1+ x1+ z1- x0+ z1+ x1- z1- x0- 得 (0,1,1)->(0,-1,1)->(1,-1,0)->(0,-1,1) like L
///// z1+ x1- z1- x0- z1+ x1+ z1- x0+ 得 (0,1,1)->(0,1,-1)->(1,1,0)->(0,1,1) like arrow point x+
///// z1+ x1+ z1- x-1+ z1+ x1- z1- x-1- 得 (-1,1,1)->(-1,-1,1)->(1,1,1)->(-1,1,1)  like gamma  z==1
///// z1+ x1- z1- x-1- z1+ x1+ z1- x-1+s 得 (-1,1,1)->(-1,1,-1)->(1,1,-1)->(-1,1,1)  like gamma y==1 
///// https://math.berkeley.edu/~hutching/rubik.pdf
async function rotateMagicCube(render, magicCube, axis, level, isAnticlockwise) {
	let angle = Math.PI / 2;
	if (!isAnticlockwise) {
		angle = -angle;
	}
	const quaternion = new THREE.Quaternion();
	switch (axis) {
		case 0:
			quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
			break;
		case 1:
			quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
			break;
		case 2:
			quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
			break;
	}
	let objs = [];
	magicCube.children.forEach((c) => {
		switch (axis) {
			case 0:
				if (Math.abs(c.position.x - level) < 0.01) {
					objs.push(c);
					//c.applyQuaternion(quaternion);
					//c.position.applyQuaternion(quaternion);
					//c.loc.applyQuaternion(quaternion);
				}
				break;
			case 1:
				if (Math.abs(c.position.y - level) < 0.01) {
					objs.push(c);
					//c.applyQuaternion(quaternion);
					//c.position.applyQuaternion(quaternion);
					//c.loc.applyQuaternion(quaternion);
				}
				break;
			case 2:
				if (Math.abs(c.position.z - level) < 0.01) {
					objs.push(c);
					//c.applyQuaternion(quaternion);
					//c.position.applyQuaternion(quaternion);
					//c.loc.applyQuaternion(quaternion);
				}
				break;
		}
	});
	for (let i = 1; i <= 10; i++) {
		let a = angle / 10;
		switch (axis) {
			case 0:
				quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), a);
				break;
			case 1:
				quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), a);
				break;
			case 2:
				quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a);
				break;
		}
		objs.forEach((c) => {
			c.applyQuaternion(quaternion);
			//c.quaternion.multiply(quaternion); // 為什麼不行？
			c.position.applyQuaternion(quaternion);
			c.loc.applyQuaternion(quaternion);
		});
		await sleep(10);
		//requestAnimationFrame(render);  // 重要：不應該雙層requestAnimationFrame，他會自己呼叫自己
	}
}

export { createCube, generateMagicCube, rotateMagicCube };
