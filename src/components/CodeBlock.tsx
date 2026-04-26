import React from 'react';
import { motion, Variants } from 'framer-motion';

// Este componente pequeño maneja la animación de cada línea individual
const TypingLine = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
            duration: 0.5,
            delay: delay,
            ease: "easeOut"
        }}
    >
        {children}
    </motion.div>
);

const CodeBlock = () => {
    return (
        <div className="flex flex-col whitespace-pre text-[15px] font-mono leading-[2rem]">
            <TypingLine delay={0.5}>
                <span className="text-gray-500">// Welcome to my workspace</span>
            </TypingLine>

            <TypingLine delay={0.8}>
                <span className="text-[#c678dd]">import</span>{' '}
                <span className="text-[#e5c07b]">&#123; Developer &#125;</span>{' '}
                <span className="text-[#c678dd]">from</span>{' '}
                <span className="text-[#98c379]">'./universe'</span>
                <span className="text-gray-400">;</span>
            </TypingLine>

            <div className="h-4"></div>

            <TypingLine delay={1.1}>
                <span className="text-[#c678dd]">const</span>{' '}
                <span className="text-[#e5c07b]">Portfolio</span>{' '}
                <span className="text-[#56b6c2]">=</span>{' '}
                <span className="text-[#56b6c2]">() =&gt;</span>{' '}
                <span className="text-gray-300">&#123;</span>
            </TypingLine>

            <TypingLine delay={1.4}>
                <span className="text-[#c678dd] ml-4">return</span> <span className="text-gray-300">(</span>
            </TypingLine>

            <TypingLine delay={1.7}>
                <span className="text-gray-400 ml-8">&lt;</span><span className="text-[#e5c07b]">Developer</span>
            </TypingLine>

            <TypingLine delay={2.0}>
                <span className="text-[#e06c75] ml-12">name</span><span className="text-[#56b6c2]">=</span><span className="text-[#98c379]">"Facundo Thibaut"</span>
            </TypingLine>

            <TypingLine delay={2.3}>
                <span className="text-[#e06c75] ml-12">role</span><span className="text-[#56b6c2]">=</span><span className="text-[#98c379]">"Full Stack Engineer"</span>
            </TypingLine>

            <TypingLine delay={2.6}>
                <span className="text-[#e06c75] ml-12">passion</span><span className="text-[#56b6c2]">=</span><span className="text-[#98c379]">"Engineering Beyond Boundaries"</span>
            </TypingLine>

            <TypingLine delay={2.9}>
                <span className="text-gray-400 ml-8">/&gt;</span>
            </TypingLine>

            <TypingLine delay={3.2}>
                <span className="text-gray-300 ml-4">);</span>
            </TypingLine>

            <TypingLine delay={3.5}>
                <span className="text-gray-300">&#125;;</span>
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" as any }}
                    className="inline-block w-2 h-5 bg-orange-500 ml-1 translate-y-1"
                />
            </TypingLine>
        </div>
    );
};

export default CodeBlock;