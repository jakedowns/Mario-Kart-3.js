import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Lightformer,
  Bvh,
} from "@react-three/drei";
import SpectatorView from "./SpectatorView";
import { Ground } from "./Ground";
import { PlayerController } from "./PlayerController";
import { Paris } from "./models/tracks/Tour_paris_promenade";
import {
  EffectComposer,
  N8AO,
  Bloom,
  TiltShift2,
  HueSaturation,
  SMAA,
  ChromaticAberration,
  Vignette,
  LUT,
} from "@react-three/postprocessing";
import { Banana } from "./models/items/Banana_peel_mario_kart";
import { ItemBox } from "./models/misc/Gift";
import { useStore } from "./store";
import { Shell } from "./models/items/Mario_shell_red";
import { Coin } from "./models/misc/Super_mario_bros_coin";
import {
  RPC,
  getState,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { PlayerDummies } from "./PlayerDummies";
import { useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { LUTPass, LUTCubeLoader } from 'three-stdlib'

export const Experience = () => {
  const onCollide = (event) => {
    console.log(event);
  };
  const { bananas, shells, players, id, actions } = useStore();
  const [networkBananas, setNetworkBananas] = useMultiplayerState(
    "bananas",
    []
  );

  const [networkShells, setNetworkShells] = useMultiplayerState("shells", []);

  const testing = getState("bananas");

  // useEffect(() => {
  //   setNetworkBananas(bananas);
  // }, [bananas]);

  // useEffect(() => {
  //   setNetworkShells(shells);
  // }, [shells]);

  const {texture}= useLoader(LUTCubeLoader, "./cubicle-99.CUBE");

  return (
    <>
      {players.map((player) => (
        <PlayerController
          key={player.id}
          player={player}
          userPlayer={player.id === myPlayer()?.id}
          setNetworkBananas={setNetworkBananas}
          setNetworkShells={setNetworkShells}
          networkBananas={networkBananas}
          networkShells={networkShells}
        />
      ))}

      {players.map((player) => (
        <PlayerDummies
          key={player.id}
          player={player}
          userPlayer={player.id === myPlayer()?.id}
        />
      ))}

      <Paris position={[0, 0, 0]} />
      {/* <Banana onCollide={onCollide} position={[-10, 1.8, -119]} /> */}
      {/* <Shell position={[-20, 2, -119]} /> */}
      <ItemBox position={[-20, 2.5, -119]} />
      <Coin position={[-30, 2, -119]} />

      <Ground position={[0, 0, 0]} />
      <Environment resolution={256} preset="lobby" />

      {networkBananas.map((banana) => (
        <Banana
          key={banana.id}
          position={banana.position}
          setNetworkBananas={setNetworkBananas}
          networkBananas={networkBananas}
          id={banana.id}
          // rotation={banana.rotation}
        />
      ))}
      {networkShells.map((shell) => (
        <Shell
          key={shell.id}
          id={shell.id}
          position={shell.position}
          rotation={shell.rotation}
          setNetworkShells={setNetworkShells}
          networkShells={networkShells}
          
        />
      ))}

      {/* <directionalLight
        position={[10, 50, -30]}
        intensity={1}
        shadow-bias={-0.0001}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}
        castShadow
      /> */}

      <EffectComposer
        multisampling={0}
        disableNormalPass
        disableSSAO
        disableDepthPass
      >
        <SMAA />
        <N8AO distanceFalloff={1} aoRadius={1} intensity={3} />
        <Bloom
          luminanceThreshold={0}
          mipmapBlur
          luminanceSmoothing={0.01}
          intensity={0.5}
        />
        <TiltShift2 />
        {/* <ChromaticAberration offset={[0.0006, 0.0006]} /> */}
        <HueSaturation saturation={0.05} />
        {/* <Vignette eskil={false} offset={0.1} darkness={0.4} /> */}
      </EffectComposer>
    </>
  );
};
