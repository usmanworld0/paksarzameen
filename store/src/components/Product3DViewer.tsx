"use client";

import Image from "next/image";
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Clone,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type Product3DViewerProps = {
  modelUrl: string;
  posterUrl?: string | null;
  alt: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
};

type ViewerErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error) => void;
};

type ViewerErrorBoundaryState = {
  hasError: boolean;
};

export function Product3DViewer({
  modelUrl,
  posterUrl,
  alt,
  onReady,
  onError,
}: Product3DViewerProps) {
  const [autoRotate, setAutoRotate] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="relative h-full w-full touch-none">
      <ViewerErrorBoundary
        onError={onError}
        fallback={<ViewerFallback posterUrl={posterUrl} alt={alt} error />}
      >
        <Canvas
          frameloop={autoRotate ? "always" : "demand"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 4], fov: 36, near: 0.1, far: 100 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={1.15} />
          <directionalLight position={[5, 6, 5]} intensity={2.4} />
          <directionalLight position={[-4, 3, -4]} intensity={1.15} />

          <Suspense fallback={<ViewerFallback posterUrl={posterUrl} alt={alt} />}>
            <Environment preset="studio" />
            <Bounds fit clip observe margin={1.1}>
              <ModelScene modelUrl={modelUrl} onReady={onReady} />
            </Bounds>
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            enableZoom
            enableRotate
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.85}
            zoomSpeed={0.9}
            autoRotate={autoRotate}
            autoRotateSpeed={0.9}
          />
        </Canvas>
      </ViewerErrorBoundary>

      <div className="pointer-events-none absolute right-4 top-4 z-10 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => setAutoRotate((value) => !value)}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/86 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700 backdrop-blur-md transition hover:border-neutral-900 hover:text-neutral-950"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {autoRotate ? "Stop rotate" : "Auto rotate"}
        </button>
        <button
          type="button"
          onClick={() => controlsRef.current?.reset()}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/86 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700 backdrop-blur-md transition hover:border-neutral-900 hover:text-neutral-950"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

function ModelScene({
  modelUrl,
  onReady,
}: {
  modelUrl: string;
  onReady?: () => void;
}) {
  const gltf = useGLTF(modelUrl);

  useEffect(() => {
    onReady?.();
  }, [gltf, onReady]);

  return <Clone object={gltf.scene} />;
}

function ViewerFallback({
  posterUrl,
  alt,
  error = false,
}: {
  posterUrl?: string | null;
  alt: string;
  error?: boolean;
}) {
  return (
    <Html center>
      <div className="w-[220px] rounded-[28px] border border-black/8 bg-white/92 p-4 text-center shadow-[0_20px_60px_rgba(17,17,17,0.12)] backdrop-blur-md">
        {posterUrl ? (
          <div className="relative mx-auto mb-3 aspect-[4/5] w-[120px] overflow-hidden rounded-[18px] border border-black/8 bg-[#f7f4ef]">
            <Image src={posterUrl} alt={alt} fill sizes="120px" className="object-cover" unoptimized />
          </div>
        ) : null}
        {error ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            3D view unavailable
          </p>
        ) : (
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-neutral-500" />
        )}
        <p className="mt-2 text-xs text-neutral-500">
          {error ? "Switch back to images or re-upload the model." : "Loading 3D model..."}
        </p>
      </div>
    </Html>
  );
}

class ViewerErrorBoundary extends Component<
  ViewerErrorBoundaryProps,
  ViewerErrorBoundaryState
> {
  state: ViewerErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  componentDidUpdate(prevProps: ViewerErrorBoundaryProps) {
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
