import { useEffect, useRef, useState } from 'react';
import './3d.css';
import replayArrow from './assets/replay-arrow.svg';
import modelUrl from './assets/orpheon-custom.bin?url';
import loadCompressedModel from './loadCompressedModel';

const ENTRANCE_DURATION_SECONDS = 4.8;
const ROTATION_SPEED = 0.5;

export default function HomePerfume3D() {
    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const replayRef = useRef(null);
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let disposed = false;
        let started = false;
        let visible = false;
        let cleanupScene = () => {};
        let syncPlayback = () => {};
        const modelRequest = new AbortController();
        const stage = stageRef.current;

        async function init() {
            if (started) return;
            started = true;
            setStatus('loading');
            try {
                // Download alongside the renderer modules, before this section is reached.
                const [THREE, { GLTFLoader }, { RoomEnvironment }, { MeshoptDecoder }, modelData] = await Promise.all([
                    import('three'),
                    import('three/addons/loaders/GLTFLoader.js'),
                    import('three/addons/environments/RoomEnvironment.js'),
                    import('three/addons/libs/meshopt_decoder.module.js'),
                    loadCompressedModel(modelUrl, {
                        signal: modelRequest.signal,
                        onProgress: value => { if (!disposed) setProgress(value); },
                    }),
                ]);
                if (disposed) return;
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
                renderer.setClearColor(0x000000, 0);
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                renderer.toneMappingExposure = 1.08;
                renderer.domElement.setAttribute('aria-label', '회전하며 내려와 착지하는 향수');
                renderer.domElement.setAttribute('role', 'img');
                stage.appendChild(renderer.domElement);
                const pmrem = new THREE.PMREMGenerator(renderer);
                const room = new RoomEnvironment();
                const environment = pmrem.fromScene(room, 0.04);
                scene.environment = environment.texture;
                scene.environmentIntensity = 0.65;
                room.dispose();
                pmrem.dispose();
                // Warm window light with a restrained rim and neutral label fill.
                scene.add(new THREE.HemisphereLight(0xfffaf2, 0xb8aa95, 1.25));
                const key = new THREE.DirectionalLight(0xffefd9, 2.1);
                key.position.set(-3, 5, 4);
                const fill = new THREE.DirectionalLight(0xfffdf8, 0.8);
                fill.position.set(3, 2, 5);
                const rim = new THREE.DirectionalLight(0xffe6c4, 1.4);
                rim.position.set(2, 3, -4);
                scene.add(key, fill, rim);
                const pivot = new THREE.Group();
                scene.add(pivot);
                let model;
                let elapsed = 0;
                let lastTime = 0;
                const shadow = sectionRef.current.querySelector('.home-perfume-3d__shadow');

                function disposeModel(root) {
                    const textures = new Set();
                    root.traverse(node => {
                        node.geometry?.dispose();
                        const materials = node.material ? (Array.isArray(node.material) ? node.material : [node.material]) : [];
                        materials.forEach(material => {
                            Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); });
                            material.dispose();
                        });
                    });
                    textures.forEach(texture => { texture.source?.data?.close?.(); texture.dispose(); });
                }

                const resize = () => {
                    const width = stage.clientWidth;
                    const height = stage.clientHeight;
                    renderer.setSize(width, height, false);
                    camera.aspect = width / height;
                    // Frame the perfume inside the Figma image slot with less empty space.
                    camera.position.set(0, 1.25, camera.aspect < 0.8 ? 6.3 : 5.2);
                    camera.lookAt(0, 1.25, 0);
                    camera.updateProjectionMatrix();
                };
                const resizeObserver = new ResizeObserver(resize);
                resizeObserver.observe(stage);
                resize();

                cleanupScene = () => {
                    syncPlayback = () => {};
                    renderer.setAnimationLoop(null);
                    resizeObserver.disconnect();
                    if (model) disposeModel(model);
                    environment.dispose();
                    renderer.dispose();
                    renderer.domElement.remove();
                    replayRef.current = null;
                };

                if (disposed) return;
                const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(modelData, '');
                if (disposed) { disposeModel(gltf.scene); return; }
                model = gltf.scene;
                const bounds = new THREE.Box3().setFromObject(model);
                const size = bounds.getSize(new THREE.Vector3());
                const center = bounds.getCenter(new THREE.Vector3());
                const scale = 2.92 / Math.max(size.x, size.y, size.z);
                // Body thickness is baked into the GLB; keep the cap's original proportions.
                const depthRatio = 1;
                model.scale.set(scale, scale, scale * depthRatio);
                model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale * depthRatio);
                pivot.add(model);
                // Prepare shaders and upload textures before the section is seen,
                // without advancing the entrance animation.
                pivot.position.y = 3.18;
                pivot.scale.setScalar(0.16);
                await renderer.compileAsync(scene, camera);
                if (disposed) return;
                renderer.render(scene, camera);
                setStatus('ready');
                replayRef.current = () => { elapsed = 0; lastTime = 0; };
                const render = time => {
                    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
                    lastTime = time;
                    if (!visible || document.hidden) return;
                    elapsed += delta;
                    const t = Math.min(elapsed / ENTRANCE_DURATION_SECONDS, 1);
                    const ease = 1 - Math.pow(1 - t, 3);
                    const settling = t > 0.8 ? Math.sin((t - 0.8) / 0.2 * Math.PI) * 0.075 : 0;
                    pivot.position.y = (1 - ease) * 3.4 + settling - 0.22;
                    pivot.scale.setScalar(0.16 + ease * 0.84);
                    pivot.rotation.y = ease * Math.PI * 4 + elapsed * ROTATION_SPEED;
                    pivot.rotation.z = Math.sin(t * Math.PI * 2) * (1 - t) * 0.11;
                    shadow.style.opacity = String(0.05 + ease * 0.17);
                    shadow.style.transform = `translateX(-50%) scale(${0.45 + ease * 0.55})`;
                    renderer.render(scene, camera);
                };
                syncPlayback = () => {
                    // Preserve elapsed entrance time across visibility pauses.
                    lastTime = 0;
                    renderer.setAnimationLoop(visible && !document.hidden ? render : null);
                };
                syncPlayback();
            } catch (error) {
                cleanupScene();
                if (!disposed) { console.error('Perfume 3D:', error); setStatus('error'); }
            }
        }

        const preload = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { void init(); preload.disconnect(); }
        }, { rootMargin: '600px' });
        const visibility = new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            syncPlayback();
        }, { threshold: 0 });
        const onVisibilityChange = () => syncPlayback();
        document.addEventListener('visibilitychange', onVisibilityChange);
        preload.observe(sectionRef.current);
        visibility.observe(stage);
        // The existing proximity observer warms this scene before it appears.
        // A time-based warmup competes with the hero's first movie download.
        return () => {
            disposed = true;
            modelRequest.abort();
            preload.disconnect();
            visibility.disconnect();
            document.removeEventListener('visibilitychange', onVisibilityChange);
            cleanupScene();
        };
    }, []);

    return (
        <section className="home-perfume-3d" id="perfume-3d" ref={sectionRef} aria-labelledby="perfume-3d-title">
            <header className="home-perfume-3d__heading">
                <p>A FINAL NOTE</p>
                <h2 id="perfume-3d-title">And the scent lingers on</h2>
                <span>그리고, 향은 오래도록 남습니다</span>
            </header>
            <div className="home-perfume-3d__scene">
                <div className="home-perfume-3d__halo" aria-hidden="true" />
                <div className="home-perfume-3d__shadow" aria-hidden="true" />
                <div className="home-perfume-3d__stage" ref={stageRef} />
                {status !== 'ready' && <p className="home-perfume-3d__status" role="status">
                    {status === 'error' ? '3D 향수를 불러오지 못했습니다. 페이지를 새로고침해 주세요.' : status === 'loading' ? `향수를 준비하고 있습니다 ${progress}%` : '향기를 만나는 순간'}
                </p>}
            </div>
            <button className="home-perfume-3d__replay" disabled={status !== 'ready'} onClick={() => replayRef.current?.()}>
                <span>View Again</span>
                <img loading="lazy" decoding="async" fetchPriority="low" src={replayArrow} alt="" aria-hidden="true" />
            </button>
        </section>
    );
}
