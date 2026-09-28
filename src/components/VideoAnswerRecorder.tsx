import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  Download, 
  AlertCircle, 
  Maximize2,
  FlipHorizontal,
  Sparkles,
  Camera
} from 'lucide-react';
import { saveVideoBlob, getVideoBlob, deleteVideoBlob } from '../utils/mediaStorage';

interface VideoAnswerRecorderProps {
  questionId: string;
  hasVideoAnswer?: boolean;
  videoAnswerDuration?: number;
  videoRecordedAt?: string;
  onSaveVideo: (durationSeconds: number) => void;
  onDeleteVideo: () => void;
  isDark?: boolean;
}

export const VideoAnswerRecorder: React.FC<VideoAnswerRecorderProps> = ({
  questionId,
  hasVideoAnswer,
  videoAnswerDuration = 0,
  videoRecordedAt,
  onSaveVideo,
  onDeleteVideo,
  isDark = true,
}) => {
  // Mode states: 'idle' | 'previewing' | 'counting' | 'recording' | 'recorded'
  const [mode, setMode] = useState<'idle' | 'previewing' | 'counting' | 'recording' | 'recorded'>('idle');
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState(true);

  // Playback state
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(videoAnswerDuration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const currentBlobRef = useRef<Blob | null>(null);

  // Load existing video from IndexedDB on mount or questionId change
  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    const loadVideo = async () => {
      if (hasVideoAnswer) {
        const result = await getVideoBlob(questionId);
        if (active && result && result.blob) {
          createdUrl = URL.createObjectURL(result.blob);
          currentBlobRef.current = result.blob;
          setVideoUrl(createdUrl);
          setDuration(result.duration || videoAnswerDuration);
          setMode('recorded');
        } else if (active) {
          setMode('idle');
          setVideoUrl(null);
        }
      } else {
        setMode('idle');
        setVideoUrl(null);
      }
    };

    loadVideo();

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [questionId, hasVideoAnswer, videoAnswerDuration]);

  // Clean up streams & timers on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Initialize camera & mic preview
  const startCameraPreview = async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Camera recording is not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user',
        },
        audio: true,
      });

      mediaStreamRef.current = stream;
      setMode('previewing');

      // Bind stream to video element
      setTimeout(() => {
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play().catch(console.error);
        }
      }, 50);
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera or microphone permission was denied. Please allow device access in your browser settings.');
      } else {
        setErrorMessage('Unable to connect to camera or microphone. Please check your devices.');
      }
      setMode('idle');
    }
  };

  // 2. Begin Countdown & Start Recording
  const triggerCountdownAndRecord = () => {
    setMode('counting');
    setCountdown(3);

    const countInterval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countInterval);
          startRecordingActual();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecordingActual = () => {
    if (!mediaStreamRef.current) return;

    videoChunksRef.current = [];

    // Choose supported MIME type
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
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
    const mediaRecorder = new MediaRecorder(mediaStreamRef.current, options);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        videoChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      stopMediaStream();
      const mime = mediaRecorder.mimeType || 'video/webm';
      const blob = new Blob(videoChunksRef.current, { type: mime });
      currentBlobRef.current = blob;

      const finalDuration = recordSeconds > 0 ? recordSeconds : 1;
      setDuration(finalDuration);

      // Save to IndexedDB
      await saveVideoBlob(questionId, blob, finalDuration);

      // Create local URL for immediate playback
      const newUrl = URL.createObjectURL(blob);
      setVideoUrl(newUrl);
      setMode('recorded');

      // Update question state
      onSaveVideo(finalDuration);
    };

    mediaRecorder.start(500); // 500ms data chunks
    setMode('recording');
    setRecordSeconds(0);

    timerIntervalRef.current = window.setInterval(() => {
      setRecordSeconds((prev) => prev + 1);
    }, 1000);
  };

  // 3. Stop Recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // Cancel during preview or recording
  const cancelSession = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    stopMediaStream();
    if (hasVideoAnswer && videoUrl) {
      setMode('recorded');
    } else {
      setMode('idle');
    }
  };

  // 4. Delete Video
  const handleDeleteVideo = async () => {
    await deleteVideoBlob(questionId);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    currentBlobRef.current = null;
    setConfirmDelete(false);
    setMode('idle');
    onDeleteVideo();
  };

  // 5. Download Video file
  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `interview_answer_${questionId}_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 6. Play / Pause toggle
  const togglePlay = () => {
    if (!videoPlayerRef.current) return;
    if (isPlaying) {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      videoPlayerRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  return (
    <div className={`rounded-2xl transition-all ${
      isDark ? 'bg-white/[0.04] border border-white/[0.08]' : 'bg-neutral-50 border border-black/[0.08]'
    } p-3.5 sm:p-4 space-y-3`}>
      {/* Error state */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STATE 1: IDLE - Prompt to record video */}
      {mode === 'idle' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-400" />
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                Webcam Mock Video Answer
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Record yourself speaking to evaluate eye contact, tone, body language & structure.
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={startCameraPreview}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-900/30 transition-all cursor-pointer shrink-0"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Turn On Camera & Record</span>
          </motion.button>
        </div>
      )}

      {/* STATE 2: CAMERA PREVIEW / COUNTDOWN / RECORDING */}
      {(mode === 'previewing' || mode === 'counting' || mode === 'recording') && (
        <div className="space-y-3">
          {/* Live Viewport Screen */}
          <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 aspect-video flex items-center justify-center shadow-inner">
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
            />

            {/* Mirror Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMirrored(!isMirrored)}
              className="absolute top-3 left-3 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white/80 hover:text-white border border-white/10 text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Mirror Camera Horizontal"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">{isMirrored ? 'Mirrored' : 'Natural'}</span>
            </button>

            {/* Recording Status Header Badge */}
            {mode === 'recording' && (
              <div className="absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-600/90 text-white border border-rose-400/40 text-xs font-mono font-bold tracking-wider shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>REC {formatSeconds(recordSeconds)}</span>
              </div>
            )}

            {/* Countdown Overlay (3.. 2.. 1.. GO!) */}
            <AnimatePresence>
              {mode === 'counting' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center pointer-events-none"
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl animate-pulse">
                    {countdown}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={cancelSession}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                isDark ? 'bg-white/10 text-neutral-300 hover:bg-white/15' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              } transition-colors cursor-pointer`}
            >
              Cancel
            </button>

            {mode === 'previewing' && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerCountdownAndRecord}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30 transition-all cursor-pointer"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span>Start Video Recording</span>
              </motion.button>
            )}

            {mode === 'recording' && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30 transition-all cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop & Save Video</span>
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* STATE 3: RECORDED VIDEO PLAYBACK & MANAGEMENT */}
      {mode === 'recorded' && videoUrl && (
        <div className="space-y-3">
          {/* Header with Title and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-400" />
              <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                Recorded Video Answer
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isDark ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' : 'bg-purple-50 text-purple-700'
              }`}>
                {formatSeconds(duration)}
              </span>
              {videoRecordedAt && (
                <span className="text-[10px] text-neutral-500 hidden sm:inline">
                  • {new Date(videoRecordedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Action buttons: Re-record, Download, Delete */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={startCameraPreview}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  isDark ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-neutral-600 hover:text-black hover:bg-black/5'
                } transition-colors cursor-pointer`}
                title="Record a New Take"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden md:inline">Re-record</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  isDark ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-neutral-600 hover:text-black hover:bg-black/5'
                } transition-colors cursor-pointer`}
                title="Download video file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden md:inline">Save</span>
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1 pl-1">
                  <span className="text-[10px] text-rose-400 font-semibold">Delete?</span>
                  <button
                    type="button"
                    onClick={handleDeleteVideo}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-0.5 rounded-md text-[10px] bg-neutral-700 text-neutral-300 hover:bg-neutral-600 cursor-pointer"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 text-neutral-400 hover:text-rose-400 ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                  } transition-colors cursor-pointer`}
                  title="Delete Video Recording"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden md:inline">Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Embedded Video Player with controls */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-neutral-800 aspect-video shadow-md group/player">
            <video
              ref={videoPlayerRef}
              src={videoUrl}
              controls
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
