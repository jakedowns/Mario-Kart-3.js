import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { isDesktop, isFirefox } from './yourUtilityFunctions'; // You need to implement these

export default function SpectatorView({ children }) {
  const { gl, camera, scene } = useThree();
  const spectatorCameraRef = useRef();
  const originalRenderTarget = gl.getRenderTarget();

  useFrame(() => {
    if (gl.xr.isPresenting) {//} && isDesktop() && !isFirefox()) {
      const xrCam = gl.xr.getCamera(camera);
      const spectatorCam = spectatorCameraRef.current;
      spectatorCam.projectionMatrix.copy(camera.projectionMatrix);
      spectatorCam.position.copy(xrCam.position);
      spectatorCam.quaternion.copy(xrCam.quaternion);

      // Temporarily disable WebXR rendering.
      gl.xr.enabled = false;
      gl.setRenderTarget(null); // Render to the canvas
      gl.render(scene, spectatorCam);

      // Restore WebXR.
      gl.setRenderTarget(originalRenderTarget);
      gl.xr.enabled = true;
    }
  });

  return <perspectiveCamera ref={spectatorCameraRef} />;
}
