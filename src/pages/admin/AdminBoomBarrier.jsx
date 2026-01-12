import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, ShieldCheck, Loader2, Clock } from 'lucide-react';

export default function AdminBoomBarrier() {
    const navigate = useNavigate();

    // Barrier states: 'closed', 'opening', 'open', 'closing'
    const [barriers, setBarriers] = useState([
        { id: 1, name: 'Main Entrance Barrier', location: 'North Gate', status: 'closed', progress: 0 },
        { id: 2, name: 'Exit Gate Barrier', location: 'South Gate', status: 'closed', progress: 0 },
        { id: 3, name: 'VIP Lane Barrier', location: 'West Wing', status: 'closed', progress: 0 },
    ]);

    // Auto-close timers for each barrier
    const [timers, setTimers] = useState({});

    useEffect(() => {
        // Cleanup all timers on unmount
        return () => {
            Object.values(timers).forEach(timer => {
                if (timer.interval) clearInterval(timer.interval);
                if (timer.timeout) clearTimeout(timer.timeout);
            });
        };
    }, [timers]);

    const openBarrier = (barrierId) => {
        // Start opening animation
        setBarriers(prev => prev.map(b =>
            b.id === barrierId ? { ...b, status: 'opening', progress: 0 } : b
        ));

        // Animate progress from 0 to 100 over 2.5 seconds
        const startTime = Date.now();
        const duration = 2500;

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);

            setBarriers(prev => prev.map(b =>
                b.id === barrierId ? { ...b, progress: newProgress } : b
            ));

            if (newProgress >= 100) {
                clearInterval(progressInterval);

                // Set to open state
                setBarriers(prev => prev.map(b =>
                    b.id === barrierId ? { ...b, status: 'open', progress: 100 } : b
                ));

                // Start 5-second countdown
                let countdown = 5;
                setTimers(prev => ({
                    ...prev,
                    [barrierId]: { ...prev[barrierId], countdown }
                }));

                const countdownInterval = setInterval(() => {
                    countdown--;
                    setTimers(prev => ({
                        ...prev,
                        [barrierId]: { ...prev[barrierId], countdown }
                    }));

                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        closeBarrier(barrierId);
                    }
                }, 1000);

                setTimers(prev => ({
                    ...prev,
                    [barrierId]: { interval: countdownInterval }
                }));
            }
        }, 16); // ~60fps

        setTimers(prev => ({
            ...prev,
            [barrierId]: { interval: progressInterval }
        }));
    };

    const closeBarrier = (barrierId) => {
        // Start closing animation
        setBarriers(prev => prev.map(b =>
            b.id === barrierId ? { ...b, status: 'closing', progress: 100 } : b
        ));

        // Animate progress from 100 to 0 over 2.5 seconds
        const startTime = Date.now();
        const duration = 2500;

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.max(100 - (elapsed / duration) * 100, 0);

            setBarriers(prev => prev.map(b =>
                b.id === barrierId ? { ...b, progress: newProgress } : b
            ));

            if (newProgress <= 0) {
                clearInterval(progressInterval);
                setBarriers(prev => prev.map(b =>
                    b.id === barrierId ? { ...b, status: 'closed', progress: 0 } : b
                ));
            }
        }, 16); // ~60fps
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'green';
            case 'closed': return 'red';
            case 'opening':
            case 'closing': return 'blue';
            default: return 'gray';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'open': return 'Open';
            case 'closed': return 'Closed';
            case 'opening': return 'Opening';
            case 'closing': return 'Closing';
            default: return 'Unknown';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-xl z-40 border-b border-gray-100/50 px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Boom Barrier Control</h1>
                        <p className="text-sm text-gray-500">Remotely operate and monitor parking boom barriers</p>
                    </div>
                </div>
            </div>

            {/* Barrier Cards - Compact Layout */}
            <div className="p-6 space-y-4">
                {barriers.map((barrier, index) => {
                    const color = getStatusColor(barrier.status);
                    const isDisabled = barrier.status !== 'closed';
                    const timer = timers[barrier.id];

                    return (
                        <motion.div
                            key={barrier.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-2xl shadow-soft border-t-4 overflow-hidden
                ${color === 'green' ? 'border-t-green-500' : ''}
                ${color === 'red' ? 'border-t-red-500' : ''}
                ${color === 'blue' ? 'border-t-blue-500' : ''}
              `}
                        >
                            {/* Compact Header & Status Row */}
                            <div className="p-4 flex items-center justify-between">
                                {/* Left: Barrier Info */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">{barrier.name}</h3>
                                    <p className="text-xs text-gray-500">{barrier.location}</p>
                                </div>

                                {/* Center: Status Icon (Smaller) */}
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md mx-4
                  ${color === 'green' ? 'bg-green-500' : ''}
                  ${color === 'red' ? 'bg-red-500' : ''}
                  ${color === 'blue' ? 'bg-blue-500' : ''}
                `}>
                                    {barrier.status === 'open' && <ShieldCheck size={32} className="text-white" />}
                                    {barrier.status === 'closed' && <ShieldAlert size={32} className="text-white" />}
                                    {(barrier.status === 'opening' || barrier.status === 'closing') && (
                                        <Loader2 size={32} className="text-white animate-spin" />
                                    )}
                                </div>

                                {/* Right: Status Text & Timer */}
                                <div className="flex-1 text-right">
                                    <p className={`text-lg font-bold
                    ${color === 'green' ? 'text-green-600' : ''}
                    ${color === 'red' ? 'text-red-600' : ''}
                    ${color === 'blue' ? 'text-blue-600' : ''}
                  `}>
                                        {getStatusText(barrier.status)}
                                    </p>
                                    {barrier.status === 'open' && timer?.countdown !== undefined && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center justify-end gap-1 text-xs text-gray-600 mt-1"
                                        >
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Clock size={12} className="text-gray-500" />
                                            </motion.div>
                                            <span>{timer.countdown}s</span>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar & Button Row */}
                            <div className="px-4 pb-4">
                                {/* Progress Bar */}
                                <div className="bg-gray-100 rounded-full h-2 overflow-hidden mb-3">
                                    <motion.div
                                        className={`h-full rounded-full
                      ${barrier.progress === 0 ? 'bg-red-500' : ''}
                      ${barrier.progress === 100 ? 'bg-green-500' : ''}
                      ${barrier.progress > 0 && barrier.progress < 100 ? 'bg-blue-500' : ''}
                    `}
                                        initial={{ width: `${barrier.progress}%` }}
                                        animate={{ width: `${barrier.progress}%` }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                </div>

                                {/* Action Button */}
                                <motion.button
                                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                    onClick={() => !isDisabled && openBarrier(barrier.id)}
                                    disabled={isDisabled}
                                    className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all text-sm
                    ${isDisabled
                                            ? 'bg-gray-300 cursor-not-allowed opacity-60'
                                            : 'bg-green-500 hover:bg-green-600 active:scale-95'
                                        }
                  `}
                                >
                                    <ShieldCheck size={18} />
                                    {isDisabled ? 'Operating' : 'Open Barrier'}
                                </motion.button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
