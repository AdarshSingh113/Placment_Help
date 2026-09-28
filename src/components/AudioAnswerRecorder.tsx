import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, Pause, RotateCcw, Trash2, Volume2, AlertCircle } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioAnswerRecorderProps {
  audioUrl?: string;
  durationSeconds?: number;
  onSaveAudio: (audioDataUrl: string, durationSeconds: number) => void;
  onDeleteAudio?: () => void;
  isDark?: boolean;
}

export const AudioAnswerRecorder: React.FC<AudioAnswerRecorderProps> = ({
  audioUrl,
  durationSeconds = 0,
  onSaveAudio,
  onDeleteAudio,
  isDark = true,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(durationSeconds);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Sync duration if passed from props
  useEffect(() => {
    if (durationSeconds > 0) {
      setAudioDuration(durationSeconds);
    }
  }, [durationSeconds]);

  // Clean up timer and streams on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Audio recording is not supported in this browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine preferred mime type
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        ''
      ];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (!m || MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const options = selectedMime ? { mimeType: selectedMime } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Stop all audio tracks to release microphone hardware indicator
        stream.getTracks().forEach((track) => track.stop());

        const mime = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mime });
        
        // Convert to base64 Data URL for persistent storage in question object & Firestore
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64DataUrl = reader.result as string;
          const finalDuration = recordSeconds > 0 ? recordSeconds : 1;
          setAudioDuration(finalDuration);
          onSaveAudio(base64DataUrl, finalDuration);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start(250); // collect data chunks every 250ms
      setIsRecording(true);
      setRecordSeconds(0);

      // Start recording clock
      timerIntervalRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Failed to access microphone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone access was denied. Please allow microphone permission in your browser.');
      } else {
        setErrorMessage('Could not initialize microphone. Please check your audio input device.');
      }
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      // Discard tracks without saving
      const stream = mediaRecorderRef.current.stream;
      if (stream) stream.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio playback error:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      setPlaybackTime(audioPlayerRef.current.currentTime);
      if (audioPlayerRef.current.duration && !isNaN(audioPlayerRef.current.duration) && audioDuration === 0) {
        setAudioDuration(Math.round(audioPlayerRef.current.duration));
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = newTime;
      setPlaybackTime(newTime);
    }
  };

  const handleSeekRatio = (ratio: number) => {
    if (audioPlayerRef.current && audioDuration > 0) {
      const newTime = Math.max(0, Math.min(audioDuration, ratio * audioDuration));
      audioPlayerRef.current.currentTime = newTime;
      setPlaybackTime(newTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioPlayerRef.current && audioPlayerRef.current.duration && !isNaN(audioPlayerRef.current.duration)) {
      const d = Math.round(audioPlayerRef.current.duration);
      if (d > 0 && isFinite(d)) {
        setAudioDuration(d);
      }
    }
  };

  return (
    <div className={`rounded-2xl transition-all ${
      isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-neutral-50 border border-black/[0.08]'
    } p-3 sm:p-4 space-y-3`}>
      {/* Hidden Audio Element for playback */}
      {audioUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
          onError={(e) => {
            console.error('Audio playback error:', e);
            setIsPlaying(false);
          }}
          preload="auto"
          playsInline
        />
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Case 1: Currently Recording */}
      {isRecording ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                Recording Voice Answer
              </span>
            </div>
            <span className={`font-mono text-xs font-bold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
              {formatSeconds(recordSeconds)}
            </span>
          </div>

          {/* Live Waveform Visualizer while recording */}
          <div className="py-1">
            <AudioVisualizer isActive={true} barCount={26} theme={isDark ? 'dark' : 'light'} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={cancelRecording}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                isDark ? 'bg-white/10 text-neutral-300 hover:bg-white/15' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              } transition-colors cursor-pointer`}
            >
              Cancel
            </button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30 transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Done & Save Audio</span>
            </motion.button>
          </div>
        </div>
      ) : audioUrl ? (
        /* Case 2: Audio Recorded & Ready to Play */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-[#2997ff] animate-pulse' : isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                  {isPlaying ? 'Playing Voice Response' : 'Voice Response Stored'}
                </span>
                {/* Mini animated equalizer bars */}
                {isPlaying && (
                  <span className="flex items-end gap-0.5 h-3 px-1 py-0.5 rounded-md bg-blue-500/20">
                    <span className="w-0.5 bg-blue-400 rounded-full animate-mini-eq-1" />
                    <span className="w-0.5 bg-blue-500 rounded-full animate-mini-eq-2" />
                    <span className="w-0.5 bg-blue-400 rounded-full animate-mini-eq-3" />
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isPlaying 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : isDark 
                  ? 'bg-emerald-500/15 text-emerald-300' 
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                {formatSeconds(playbackTime > 0 ? playbackTime : audioDuration)} / {formatSeconds(audioDuration)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={startRecording}
                className={`p-1.5 rounded-lg text-xs ${
                  isDark ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-neutral-500 hover:text-black hover:bg-black/5'
                } transition-colors cursor-pointer`}
                title="Re-record Audio Answer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              {onDeleteAudio && (
                <button
                  type="button"
                  onClick={onDeleteAudio}
                  className={`p-1.5 rounded-lg text-xs ${
                    isDark ? 'text-neutral-400 hover:text-rose-400 hover:bg-white/10' : 'text-neutral-500 hover:text-rose-600 hover:bg-black/5'
                  } transition-colors cursor-pointer`}
                  title="Delete Audio Recording"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Playing Audio Waveform Animation with Seeking */}
          <div className="pt-0.5">
            <AudioVisualizer 
              isActive={isPlaying} 
              progress={audioDuration > 0 ? playbackTime / audioDuration : 0} 
              barCount={28} 
              theme={isDark ? 'dark' : 'light'}
              interactive={true}
              onSeek={handleSeekRatio}
            />
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center gap-3 pt-0.5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={togglePlayback}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm cursor-pointer transition-all ${
                isPlaying
                  ? 'bg-gradient-to-tr from-[#0071e3] to-[#2997ff] text-white shadow-blue-500/25 ring-2 ring-blue-400/40'
                  : isDark
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-[#1d1d1f] text-white hover:bg-black'
              }`}
              title={isPlaying ? 'Pause Audio' : 'Play Audio'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </motion.button>

            <div className="flex-1 space-y-1">
              <input
                type="range"
                min={0}
                max={audioDuration || 1}
                step={0.05}
                value={playbackTime}
                onChange={handleSeek}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-neutral-300 dark:bg-neutral-700 accent-blue-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>{formatSeconds(playbackTime)}</span>
                <span>{formatSeconds(audioDuration)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Case 3: No Audio Recorded Yet -> Offer Option to Record */
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Mic className="w-4 h-4 text-blue-400" />
            <span>Record your spoken answer to practice delivery & structure</span>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 text-white'
                : 'bg-black/5 hover:bg-black/10 text-[#1d1d1f]'
            } transition-colors cursor-pointer`}
          >
            <Mic className="w-3.5 h-3.5 text-rose-500" />
            <span>Record Voice Answer</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
