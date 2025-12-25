'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { VisitCounter } from '@/components/VisitCounter';
import { Video, StopCircle, UserMinus, ShieldCheck, Download, Mic, MicOff } from 'lucide-react';
import Link from 'next/link';

export default function ScreenRecorderPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [audioEnabled, setAudioEnabled] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [stream]);

    const startRecording = async () => {
        setError(null);
        try {
            // Options for getDisplayMedia to try to get audio if requested
            // Note: System audio capture depends on OS/Browser support when sharing screen.
            const displayMediaOptions: DisplayMediaStreamOptions = {
                video: true,
                audio: audioEnabled
            };

            const mediaStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

            // If user cancels the browser picker, mediaStream might be null or throw error immediately, 
            // but usually getDisplayMedia throws if cancelled.

            setStream(mediaStream);

            // Preview
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.muted = true; // Mute preview to avoid feedback loop if audio is captured
                videoRef.current.play();
            }

            // Setup MediaRecorder
            // Prefer codecs if supported
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                ? 'video/webm;codecs=vp9'
                : 'video/webm';

            const recorder = new MediaRecorder(mediaStream, { mimeType });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                stopTimer();
                downloadRecording();
                // Check if we need to clean up stream (if user pressed stop button in UI vs browser UI)
                // Browser UI stop triggers track 'ended' event usually.
            };

            // Detect if user stops sharing via browser UI controls
            mediaStream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };

            recorder.start(1000); // Collect 1s chunks
            setIsRecording(true);
            startTimer();

        } catch (err: any) {
            console.error("Error starting screen record:", err);
            // Don't show error if user just cancelled selection
            if (err.name !== 'NotAllowedError') {
                setError('No se pudo iniciar la grabación. Asegúrate de que tu navegador soporte esta función.');
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }

        setIsRecording(false);
        stopTimer();
    };

    const downloadRecording = () => {
        if (chunksRef.current.length === 0) return;

        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `grabacion-pantalla-${timestamp}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        chunksRef.current = []; // Reset chunks after download to avoid duplicates if something weird happens
    };

    const startTimer = () => {
        setTimer(0);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    const formatTime = (seconds: number) => {
        const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
        const ss = (seconds % 60).toString().padStart(2, '0');
        return `${mm}:${ss}`;
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Header title="Grabador de Pantalla" showBack>
                <div className="mr-4">
                    {/* Placeholder for extra header actions possibly */}
                </div>
            </Header>
            <div className="flex justify-center pb-2 bg-background border-b border-border/50">
                <VisitCounter pageKey="screen_recorder" />
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-8">

                {/* Intro Section */}
                {!isRecording && !stream && (
                    <div className="text-center space-y-4 animate-fade-in py-8">
                        <div className="w-20 h-20 bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 transition-transform hover:rotate-6">
                            <Video size={40} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Graba tu Pantalla</h1>
                        <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                            Captura video de tu escritorio, ventanas o pestañas directamente desde el navegador.
                            Sin marcas de agua, sin límite de tiempo y sin instalar nada.
                        </p>

                        <div className="flex flex-col items-center gap-4 mt-8">
                            <div className="flex items-center gap-2 mb-2 p-2 bg-muted/50 rounded-lg">
                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium px-2">
                                    <input
                                        type="checkbox"
                                        checked={audioEnabled}
                                        onChange={e => setAudioEnabled(e.target.checked)}
                                        className="accent-primary w-4 h-4"
                                    />
                                    {audioEnabled ? <Mic size={16} className="text-green-500" /> : <MicOff size={16} className="text-muted-foreground" />}
                                    <span>Incluir Audio del Sistema (si es compatible)</span>
                                </label>
                            </div>

                            <button
                                onClick={startRecording}
                                className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg"
                            >
                                <span className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse group-hover:hidden"></span>
                                <Video size={24} />
                                Iniciar Grabación
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-xl mt-4 max-w-md mx-auto text-sm font-medium">
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {/* Recording State */}
                {(isRecording || stream) && (
                    <div className="flex flex-col items-center w-full animate-fade-in-up">

                        {/* Status Bar */}
                        <div className="flex items-center gap-6 mb-6 px-6 py-3 bg-card border border-border rounded-full shadow-sm">
                            <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>REC</span>
                            </div>
                            <div className="text-2xl font-mono font-bold w-24 text-center">
                                {formatTime(timer)}
                            </div>
                            <button
                                onClick={stopRecording}
                                className="px-4 py-1.5 bg-destructive text-destructive-foreground text-sm font-bold rounded-full hover:bg-destructive/90 transition-colors flex items-center gap-2"
                            >
                                <StopCircle size={16} /> Detener
                            </button>
                        </div>

                        {/* Video Preview */}
                        <div className="w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-video relative group">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-contain"
                                autoPlay
                                playsInline
                                muted // Always muted in preview
                            />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Vista Previa (Muteado)
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-6 text-center max-w-md">
                            Estamos grabando tu pantalla. Cuando finalices, el archivo se descargará automáticamente en formato <strong>.webm</strong>.
                        </p>
                    </div>
                )}

                {/* Privacy Banner */}
                <div className="mt-auto pt-8 border-t border-border/40 w-full">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex items-start gap-3">
                        <ShieldCheck className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">Privacidad Garantizada</h4>
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                El proceso de grabación ocurre 100% en la memoria de tu navegador.
                                El video generado nunca se sube a nuestros servidores ni a la nube.
                                Es totalmente privado y seguro.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
