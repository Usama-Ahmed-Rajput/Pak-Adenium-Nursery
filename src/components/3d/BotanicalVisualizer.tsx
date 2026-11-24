"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function BotanicalVisualizer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.8, 4.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Group for the entire botanical sculpture
    const specimenGroup = new THREE.Group();
    scene.add(specimenGroup);

    // 1. Swollen Sculptural Caudex (Base of the Desert Rose)
    const caudexGeometry = new THREE.SphereGeometry(1, 32, 32);
    // Sculpt caudex vertices organically to mimic natural swollen water-storing caudex
    const posAttr = caudexGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      // Flatter bottom, bulbous middle, tapering neck
      let scale = 1.0;
      if (y < -0.3) {
        scale = 1.25 + Math.sin(x * 4) * 0.1;
      } else if (y > 0.4) {
        scale = 0.65;
      } else {
        scale = 1.15 + Math.cos(z * 3) * 0.08;
      }
      posAttr.setX(i, x * scale);
      posAttr.setZ(i, z * scale);
    }
    caudexGeometry.computeVertexNormals();

    const caudexMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a483a, // Earthy bark brown with green undertones
      roughness: 0.85,
      metalness: 0.05,
    });
    const caudexMesh = new THREE.Mesh(caudexGeometry, caudexMaterial);
    caudexMesh.scale.set(0.9, 1.1, 0.9);
    caudexMesh.position.y = -0.4;
    caudexMesh.castShadow = true;
    specimenGroup.add(caudexMesh);

    // 2. Sculptural Branches
    const branchMaterial = new THREE.MeshStandardMaterial({
      color: 0x483a2e,
      roughness: 0.8,
    });

    const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.2, 16), branchMaterial);
    branch1.position.set(-0.35, 0.5, 0.1);
    branch1.rotation.set(0.1, 0, 0.35);
    specimenGroup.add(branch1);

    const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 1.4, 16), branchMaterial);
    branch2.position.set(0.3, 0.6, -0.05);
    branch2.rotation.set(-0.15, 0, -0.3);
    specimenGroup.add(branch2);

    const branch3 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 1.0, 16), branchMaterial);
    branch3.position.set(0.05, 0.7, 0.25);
    branch3.rotation.set(0.3, 0, 0.05);
    specimenGroup.add(branch3);

    // 3. Desert Rose Multi-Petal Blooms
    const petalMaterial = new THREE.MeshStandardMaterial({
      color: 0xd64d60, // Desert rose vibrant magenta crimson
      roughness: 0.45,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const innerPetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x7c1424, // Deep dark velvet ruby center
      roughness: 0.4,
    });

    function createBloom(scale = 1.0) {
      const bloomGroup = new THREE.Group();
      // Outer petals
      for (let i = 0; i < 5; i++) {
        const petalGeo = new THREE.SphereGeometry(0.22 * scale, 16, 8);
        petalGeo.scale(1.2, 0.15, 1.8);
        const petal = new THREE.Mesh(petalGeo, petalMaterial);
        petal.rotation.y = (i * Math.PI * 2) / 5;
        petal.position.x = Math.sin((i * Math.PI * 2) / 5) * 0.2 * scale;
        petal.position.z = Math.cos((i * Math.PI * 2) / 5) * 0.2 * scale;
        petal.rotation.x = 0.3;
        bloomGroup.add(petal);
      }
      // Inner rosette layer
      for (let j = 0; j < 5; j++) {
        const innerPetalGeo = new THREE.SphereGeometry(0.15 * scale, 16, 8);
        innerPetalGeo.scale(1.1, 0.2, 1.3);
        const innerPetal = new THREE.Mesh(innerPetalGeo, innerPetalMaterial);
        innerPetal.rotation.y = (j * Math.PI * 2) / 5 + 0.35;
        innerPetal.position.x = Math.sin((j * Math.PI * 2) / 5 + 0.35) * 0.12 * scale;
        innerPetal.position.z = Math.cos((j * Math.PI * 2) / 5 + 0.35) * 0.12 * scale;
        innerPetal.rotation.x = 0.45;
        bloomGroup.add(innerPetal);
      }
      return bloomGroup;
    }

    const bloom1 = createBloom(1.1);
    bloom1.position.set(-0.6, 1.15, 0.2);
    bloom1.rotation.set(-0.2, 0.4, 0.3);
    specimenGroup.add(bloom1);

    const bloom2 = createBloom(1.25);
    bloom2.position.set(0.65, 1.25, -0.1);
    bloom2.rotation.set(0.3, -0.5, -0.2);
    specimenGroup.add(bloom2);

    const bloom3 = createBloom(0.9);
    bloom3.position.set(0.1, 1.25, 0.4);
    bloom3.rotation.set(0.5, 0.1, 0.1);
    specimenGroup.add(bloom3);

    // 4. Subtle Foliage Cluster
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x274932,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    for (let l = 0; l < 8; l++) {
      const leafGeo = new THREE.SphereGeometry(0.18, 12, 6);
      leafGeo.scale(0.8, 0.08, 1.6);
      const leaf = new THREE.Mesh(leafGeo, leafMaterial);
      const angle = (l * Math.PI * 2) / 8;
      leaf.position.set(Math.cos(angle) * 0.35, 0.95 + Math.sin(l) * 0.1, Math.sin(angle) * 0.35);
      leaf.rotation.set(0.6, angle, 0.2);
      specimenGroup.add(leaf);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ea, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    sunLight.position.set(4, 6, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const bounceLight = new THREE.DirectionalLight(0xa4b29d, 0.8);
    bounceLight.position.set(-4, -2, -3);
    scene.add(bounceLight);

    // Mouse Interaction
    let mouseX = 0;
    let targetX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetX = normX * 0.6;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth damped rotation towards mouse position + slow idle breathing
      mouseX += (targetX - mouseX) * 0.05;
      specimenGroup.rotation.y += delta * 0.25;
      specimenGroup.rotation.x = mouseX * 0.2;
      specimenGroup.position.y = Math.sin(clock.getElapsedTime() * 1.2) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      caudexGeometry.dispose();
      caudexMaterial.dispose();
      branchMaterial.dispose();
      petalMaterial.dispose();
      innerPetalMaterial.dispose();
      leafMaterial.dispose();
    };
  }, []);

  if (!isClient || !hasWebGL) {
    // Graceful botanical image fallback
    return (
      <div className="relative w-full h-full flex items-center justify-center p-6">
        <div className="relative w-72 h-80 rounded-2xl overflow-hidden border border-botanical-300/30 shadow-card bg-ivory-sand/40">
          <img
            src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=800&auto=format&fit=crop"
            alt="Mature Desert Rose Bonsai"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-botanical-900/70 via-transparent to-transparent flex items-end p-4">
            <span className="text-xs uppercase tracking-widest text-ivory/90 font-medium">
              Desert Rose Bonsai
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[380px] md:h-[480px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-900/10 backdrop-blur-sm border border-botanical-900/15 text-[11px] uppercase tracking-wider text-botanical-900/80 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
          Interactive 3D Plant Model
        </span>
      </div>
    </div>
  );
}

