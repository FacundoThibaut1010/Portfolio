import { useEffect, useRef } from 'react';

const SkillsUniverse = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rotation = useRef({ x: 0.3, y: 0 });
    const isDragging = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0.001, y: 0.002 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // --- CARGA DE IMÁGENES CON VALIDACIÓN ---
        const createImage = (src: string) => {
            const img = new Image();
            img.src = src;
            return img;
        };

        const logos: { [key: string]: HTMLImageElement } = {
            'CSS': createImage('/projets/css-icon5555.logowik.com-Photoroom.png'),
            'React': createImage('/projets/react-logo-png_seeklogo-507247-Photoroom.png'),
            'HTML': createImage('/projets/html5_23403-Photoroom.png'),
            'JavaScript': createImage('/projets/kisspng-javascript-clip-art-openclipart-logo-number-1713949408965-Photoroom.png'),
            'Node.js': createImage('/projets/87-879058_formation-node-js-node-js-logo-vector-Photoroom.png'),
            'MySQL': createImage('/projets/mysql-6-logo-png-transparent-Photoroom.png'),
            'Java': createImage('/projets/png-clipart-computer-icons-java-咖啡海报图片素材-miscellaneous-text-thumbnail-Photoroom.png'),
            'Angular': createImage('/projets/java-logo-angular-angularjs-software-testing-template-computer-icons-computer-font-ppt-png-clipart-thumbnail-Photoroom.png'),
            'Git': createImage('/projets/218-2181371_logo-git-git-icon-Photoroom.png'),
            'TypeScript': createImage('/projets/png-transparent-angularjs-typescript-javascript-vue-js-others-blue-angle-text-thumbnail-Photoroom.png'),
            'Python': createImage('/projets/hd-python-logo-symbol-transparent-png-735811696257415dbkifcuokn-Photoroom.png')
        };

        const skills = [
            { name: 'HTML', color: '#E34F26' },
            { name: 'CSS', color: '#1572B6' },
            { name: 'JavaScript', color: '#F7DF1E' },
            { name: 'MySQL', color: '#4479A1' },
            { name: 'Java', color: '#007396' },
            { name: 'React', color: '#61DAFB' },
            { name: 'Angular', color: '#DD0031' },
            { name: 'Node.js', color: '#339933' },
            { name: 'Git', color: '#F05032' },
            { name: 'TypeScript', color: '#3178C6' },
            { name: 'Python', color: '#3776AB' },
        ];

        let points = skills.map((skill, index) => {
            const phi = Math.acos(-1 + (2 * index) / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;
            return {
                ox: Math.cos(theta) * Math.sin(phi),
                oy: Math.sin(theta) * Math.sin(phi),
                oz: Math.cos(phi),
                name: skill.name,
                color: skill.color,
                x2d: 0, y2d: 0, z3d: 0
            };
        });

        // Handlers
        const handleMouseDown = (e: MouseEvent) => { isDragging.current = true; lastMousePos.current = { x: e.clientX, y: e.clientY }; };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            velocity.current.y = (e.clientX - lastMousePos.current.x) * 0.0007;
            velocity.current.x = (e.clientY - lastMousePos.current.y) * 0.0007;
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseUp = () => isDragging.current = false;

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        const render = () => {
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width; canvas.height = height;
            }

            ctx.clearRect(0, 0, width, height);

            const visualRadius = Math.min(width, height) * 0.42;
            const pointsRadius = visualRadius * 0.75;
            const centerX = width / 2;
            const centerY = (height / 2) - 40;

            rotation.current.x += velocity.current.x;
            rotation.current.y += velocity.current.y;

            if (!isDragging.current) {
                velocity.current.x *= 0.96;
                velocity.current.y *= 0.96;
                if (Math.abs(velocity.current.x) < 0.001) velocity.current.x = 0.001;
                if (Math.abs(velocity.current.y) < 0.002) velocity.current.y = 0.002;
            }

            // Fondo de esfera
            const sphereGrad = ctx.createRadialGradient(centerX, centerY, visualRadius * 0.1, centerX, centerY, visualRadius);

            ctx.beginPath();
            ctx.arc(centerX, centerY, visualRadius, 0, Math.PI * 2);
            ctx.fillStyle = sphereGrad;
            ctx.fill();

            // Proyección
            points.forEach(p => {
                let x = p.ox, y = p.oy, z = p.oz;
                let ty = y * Math.cos(rotation.current.x) - z * Math.sin(rotation.current.x);
                let tz = z * Math.cos(rotation.current.x) + y * Math.sin(rotation.current.x);
                y = ty; z = tz;
                let tx = x * Math.cos(rotation.current.y) + z * Math.sin(rotation.current.y);
                z = z * Math.cos(rotation.current.y) - x * Math.sin(rotation.current.y);
                x = tx;
                const psp = 400 / (400 + z * pointsRadius);
                p.x2d = centerX + x * pointsRadius * psp;
                p.y2d = centerY + y * pointsRadius * psp;
                p.z3d = z;
            });

            const sortedPoints = [...points].sort((a, b) => a.z3d - b.z3d);

            // Dibujar Líneas
            ctx.beginPath();
            ctx.lineWidth = 1.2;
            sortedPoints.forEach((p1, i) => {
                sortedPoints.slice(i + 1).forEach(p2 => {
                    const dist = Math.sqrt(Math.pow(p1.ox - p2.ox, 2) + Math.pow(p1.oy - p2.oy, 2) + Math.pow(p1.oz - p2.oz, 2));
                    if (dist < 1.5) {
                        const alpha = (p1.z3d + p2.z3d + 2) / 4;
                        ctx.globalAlpha = Math.max(0, alpha * 0.16);
                        ctx.strokeStyle = '#ff6a00ff';
                        ctx.moveTo(p1.x2d, p1.y2d);
                        ctx.lineTo(p2.x2d, p2.y2d);
                    }
                });
            });
            ctx.stroke();

            // Dibujar Nodos
            sortedPoints.forEach(p => {
                const alpha = (p.z3d + 1) / 2;
                const isBack = p.z3d < -0.1;
                const imgSize = 50 * alpha;
                const img = logos[p.name];

                ctx.globalAlpha = Math.max(0.1, alpha);

                // DIBUJO SEGURO: Si la imagen existe y cargó, se dibuja. Si no, punto.
                if (img && img.complete && img.naturalWidth !== 0) {
                    ctx.drawImage(img, p.x2d - imgSize / 2, p.y2d - 35, imgSize, imgSize);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x2d, p.y2d, 4 * (0.6 + alpha * 0.8), 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                }

                // Texto
                const fontSize = Math.floor(10 + (alpha * 10));
                ctx.font = `bold ${fontSize}px monospace`;
                ctx.textAlign = 'center';
                ctx.fillStyle = isBack ? '#4b5563' : p.color;
                ctx.fillText(p.name, p.x2d, p.y2d + 25);
            });

            requestAnimationFrame(render);
        };

        render();
        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

export default SkillsUniverse;