"use client";

import { Play, Pause, Volume2, ChevronFirst, ChevronLast, List } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";

function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function MusicPlayer({ autoPlay = true }) {
    const [showPlaylist, setShowPlaylist] = useState(false);

    const {
        audioRef,
        src,
        playlist,
        currentTrack,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        setCurrentTime,
        setDuration,
        setVolume,
        togglePlay,
        playNext,
        playPrev,
        playFromPlaylist
    } = useMusicPlayer(autoPlay);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
useEffect(() => {
        if (!audioRef.current) return;

        // Reset visual state
        setCurrentTime(0);
        setDuration(0);

        // Reset audio element
        audioRef.current.currentTime = 0;
    }, [currentTrack?.path]);
    // Sync volume langsung ke elemen audio
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    if (!currentTrack) return null;

    return (
        <div className="w-full h-full text-white flex flex-col justify-end items-center">
            {/* AUDIO ELEMENT */}
            <audio
                key={currentTrack.path} // Memaksa reload saat ganti track
                ref={audioRef}
                src={src ?? undefined}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={playNext}
            />

            {/* PLAYLIST PANEL */}
            {showPlaylist && (
                <div className="bg-white dark:bg-slate-900 overflow-y-auto border-b border-slate-200 dark:border-slate-700 w-full max-h-60 shadow-lg" onClick={(e) =>{
                  e.stopPropagation();}}>
                    <ul className="p-2">
                        {playlist.map((track, idx) => (
                            <li
                                key={track.path}
                                onClick={() => playFromPlaylist(idx)}
                                className={`cursor-pointer px-3 py-2 rounded-md transition mb-1 flex justify-between ${
                                    idx === currentIndex
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-black dark:text-white"
                                }`}
                            >
                                <span className="truncate text-sm">{track.name}</span>
                                {idx === currentIndex && isPlaying && (
                                    <div className="flex gap-0.5 items-end pb-1">
                                        <div className="w-1 bg-white animate-bounce h-2" style={{ animationDelay: '0.1s' }} />
                                        <div className="w-1 bg-white animate-bounce h-3" style={{ animationDelay: '0.2s' }} />
                                        <div className="w-1 bg-white animate-bounce h-2" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* CONTROLS CONTAINER */}
            <div className="bg-white dark:bg-slate-900 w-full p-5 border-t border-slate-200 dark:border-slate-800" onClick={(e) =>{
                  e.stopPropagation();}}>
                <div className="mb-2">
                    <p className="text-black dark:text-white font-medium truncate text-sm">
                        {currentTrack.name}
                    </p>
                </div>

                {/* PROGRESS BAR */}
                <div className="flex flex-col gap-1">
                    <input
                        type="range"
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        min={0}
                        max={100}
                        step={0.1}
                        value={progress}
                        onChange={(e) => {
                            const percent = Number(e.target.value);
                            if (audioRef.current && duration) {
                                const newTime = (percent / 100) * duration;
                                audioRef.current.currentTime = newTime;
                                setCurrentTime(newTime);
                            }
                        }}
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* BUTTONS & VOLUME */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <Button variant="rounded" onClick={playPrev} disabled={currentIndex === 0}>
                            <ChevronFirst size={18} className="" />
                        </Button>
                        <Button variant="rounded" onClick={togglePlay} className="bg-blue-600 hover:bg-blue-700 text-white p-3">
                            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor"/>}
                        </Button>
                        <Button variant="rounded" onClick={playNext} disabled={currentIndex === playlist.length - 1}>
                            <ChevronLast size={18} />
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                        <Volume2 size={16} className="text-slate-500" />
                        <input
                            type="range"
                            className="w-16 h-1 accent-blue-600"
                            min={0}
                            max={1}
                            step={0.05}
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                        />
                        <Button
                            variant="rounded"
                            onClick={() => setShowPlaylist(!showPlaylist)}
                            className={showPlaylist ? "text-blue-600" : "text-white"}
                        >
                            <List size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
