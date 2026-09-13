import { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowLeft, Play, Flower2, CloudRain, Smile, Palette, Sun, Wand2, Coffee, Gift, Star, 
  Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Minimize 
} from 'lucide-react';
import './App.css';

// Función para formatear segundos a MM:SS o HH:MM:SS
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Doodles tiernos esparcidos alrededor
const CuteDoodles = () => (
  <div className="doodles-container">
    <motion.div 
      className="doodle d-umbrella" 
      animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      <CloudRain size={26} color="#38bdf8" />
    </motion.div>

    <motion.div 
      className="doodle d-flower-1"
      animate={{ scale: [1, 1.18, 1], rotate: [0, 90, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    >
      <Flower2 size={24} color="#f472b6" />
    </motion.div>

    <motion.div 
      className="doodle d-palette"
      animate={{ y: [0, 6, 0] }}
      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
    >
      <Palette size={24} color="#c084fc" />
    </motion.div>

    <motion.div 
      className="doodle d-sun"
      animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    >
      <Sun size={26} color="#fbbf24" />
    </motion.div>

    <motion.div 
      className="doodle d-smile"
      animate={{ rotate: [-10, 10, -10] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      <Smile size={28} color="#f472b6" />
    </motion.div>

    <motion.div 
      className="doodle d-wand"
      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
    >
      <Wand2 size={24} color="#e879f9" />
    </motion.div>

    <motion.div 
      className="doodle d-coffee"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    >
      <Coffee size={24} color="#fb923c" />
    </motion.div>

    <motion.div 
      className="doodle d-gift"
      animate={{ scale: [1, 1.15, 1], rotate: [-5, 5, -5] }}
      transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
    >
      <Gift size={26} color="#4ade80" />
    </motion.div>

    <motion.div className="doodle d-sparkle-1" animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 0.9, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }}>
      <Sparkles size={24} color="#fbbf24" />
    </motion.div>
    
    <motion.div className="doodle d-sparkle-2" animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}>
      <Star size={20} color="#f472b6" fill="#fbcfe8" />
    </motion.div>

    <motion.div className="doodle d-sparkle-3" animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 0.9, 0.4] }} transition={{ repeat: Infinity, duration: 2.8, delay: 1 }}>
      <Sparkles size={26} color="#38bdf8" />
    </motion.div>
  </div>
);

export default function App() {
  const [envelopeState, setEnvelopeState] = useState('closed'); 
  const [isPlaying, setIsPlaying] = useState(false);

  const [videoState, setVideoState] = useState('playing');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const controlsTimeoutRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const videoUrl = "https://ia600100.us.archive.org/6/items/tierra.-de.-osos.-2003.1080-p-dual-lat/Tierra.De.Osos.2003.1080P-Dual-Lat.mp4";

  // Callback ref para vincular los eventos inmediatamente cuando se renderiza el tag <video>
  const setVideoRef = useCallback((node) => {
    if (videoRef.current) {
      videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }

    if (node) {
      videoRef.current = node;
      node.addEventListener('timeupdate', handleTimeUpdate);
      node.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    
    setCurrentTime(curr);
    if (dur) {
      setDuration(dur);
      const currentProgress = (curr / dur) * 100;
      setProgress(isNaN(currentProgress) ? 0 : currentProgress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleVideoTap = (e) => {
    if (e.target.closest('.custom-controls')) {
      return;
    }

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      if (showControls) {
        setShowControls(false);

        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      } else {
        showControlsTemporarily();
      }
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * (video.duration || 0);
    video.currentTime = newTime;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await playerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error en pantalla completa:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleDoubleClick = (e) => {
    if (e.target.closest('.custom-controls')) return;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    toggleFullscreen();
  };

  const handleOpenSequence = () => {
    if (envelopeState !== 'closed') return;

    setEnvelopeState('opening');

    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#a7f3d0', '#fef08a', '#e9d5ff', '#38bdf8'],
      scalar: 1.1
    });

    setTimeout(() => {
      setEnvelopeState('extracted');
    }, 1200);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setVideoState('playing');
    } else {
      videoRef.current.pause();
      setVideoState('paused');
    }
    showControlsTemporarily();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  const handleBackToLetter = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleStartVideo = () => {
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    showControlsTemporarily();
  };

  return (
    <main className="app-viewport">
      <div className="mesh-background">
        <div className="mesh-ball ball-lavender"></div>
        <div className="mesh-ball ball-mint"></div>
        <div className="mesh-ball ball-peach"></div>
      </div>

      <CuteDoodles />

      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <div className="stage-container" key="gift-stage">

            {envelopeState !== 'extracted' ? (

              <div
                className="envelope-scene"
                onClick={handleOpenSequence}
              >
                <div className="envelope-3d">

                  <div className="env-back"></div>

                  <motion.div
                    className="env-paper-preview"
                    animate={
                      envelopeState === 'opening'
                        ? {
                            y: -170,
                            scale: 1.15,
                            opacity: 0
                          }
                        : {
                            y: 0,
                            scale: 1,
                            opacity: 1
                          }
                    }
                    transition={{
                      duration: 2,
                      delay: 0.35,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <div className="paper-header-doodle">🌸</div>
                    <div className="paper-line short"></div>
                    <div className="paper-line"></div>
                  </motion.div>

                  <div className="env-cover"></div>

                  <motion.div 
                    className="env-flap-top" 
                    initial={{ rotateX: 0 }} 
                    animate={envelopeState === 'opening' ? { rotateX: 180 } : { rotateX: 0 }} 
                    transition={{ 
                      duration: 1.2, 
                      delay: 0.05, 
                      ease: [0.22, 1, 0.36, 1] 
                    }} 
                    style={{ zIndex: envelopeState === 'opening' ? 1 : 4 }} 
                  ></motion.div>

                  <AnimatePresence>
                    {envelopeState === 'closed' && (
                      <motion.div
                        className="wax-seal-button"
                        exit={{
                          scale: 0,
                          opacity: 0,
                          rotate: 45
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="seal-emboss">💖</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                <motion.div
                  className="action-hint"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2
                  }}
                >
                  <Sparkles
                    size={16}
                    className="sparkle-icon"
                  />
                  <span>
                    Presiona para abrir tu sorpresa ✨
                  </span>
                </motion.div>

              </div>

            ) : (

              <motion.article
                className="letter-container"
                initial={{
                  opacity: 0,
                  y: -45,
                  scale: 0.92
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >

                <div className="washi-tape"></div>

                <header className="letter-header">
             
                </header>

                <section className="letter-content">
                  <h1>Viole ✨</h1>

                  <p>
                    Sé lo mucho que querías ver esta película y
                    que no la habías encontrado. Te la preparé
                    aquí para que la disfrutes hoy en tu día.
                
                  </p>
                </section>

                <div className="cinema-ticket">
  {/* Encabezado estilo Pase VIP */}
 <div className="ticket-header-tag">
  <span>🎬 Tu película favorita, disponible siempre ✨</span>
</div>

  {/* Contenido Principal con Póster e Info */}
  <div className="ticket-main-content">
    <img
      src="/Images/tierra de osos.webp"
      alt="Tierra de Osos"
      className="ticket-poster-img"
    />

    <div className="ticket-details">
      <h3 className="ticket-title">Tierra de Osos</h3>
      <span className="ticket-genre">Disney • Infantil / Aventura</span>
      
      <div className="ticket-pills">
        <span className="ticket-pill">⏱️ 1h 25m</span>
        <span className="ticket-pill">🍿 HD Lat</span>
      </div>
    </div>
  </div>

  {/* Botón de Acción integrado */}
  <button className="ticket-play-btn" onClick={handleStartVideo}>
    <Play size={18} fill="currentColor" />
    <span>Reproducir Película</span>
  </button>
</div>

<span className="letter-closing">
                    Que tengas un bonito cumpleaños ✨
                  </span>

              </motion.article>

            )}

          </div>

        ) : (

          /* =========================
             REPRODUCTOR
          ========================= */

          <motion.div
            key="player-stage"
            className="player-wrapper"
            ref={playerRef}
            initial={{
              opacity: 0,
              scale: 0.96
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.96
            }}
          >

            <button
              className="nav-back-button"
              onClick={handleBackToLetter}
            >
              <ArrowLeft size={18} />
              <span>
                Volver a la carta
              </span>
            </button>

            <div
              className="video-viewport"
              onClick={handleVideoTap}
              onDoubleClick={handleDoubleClick}
            >

              <video
                ref={setVideoRef}
                autoPlay
                playsInline
                src={videoUrl}
                onPlay={() => setVideoState('playing')}
                onPause={() => setVideoState('paused')}
              >
                Tu navegador no soporta reproducción H.264 MP4.
              </video>

              {/* =========================
                  CONTROLES
              ========================= */}

              <motion.div
                className="custom-controls"
                initial={false}
                animate={{
                  opacity: showControls ? 1 : 0,
                  y: showControls ? 0 : 20
                }}
                transition={{
                  duration: 0.25
                }}
                style={{
                  pointerEvents: showControls
                    ? 'auto'
                    : 'none'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >

                {/* BARRA DE PROGRESO */}

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleProgressChange}
                  className="progress-slider"
                  style={{
                    '--progress': `${progress}%`
                  }}
                />

                <div className="controls-row">

                  {/* CONTROLES IZQUIERDOS */}

                  <div className="control-group left">

                    <button
                      onClick={togglePlay}
                      className="control-btn"
                    >
                      {videoState === 'playing' ? (
                        <Pause
                          size={22}
                          fill="currentColor"
                        />
                      ) : (
                        <Play
                          size={22}
                          fill="currentColor"
                        />
                      )}
                    </button>

                    <button
                      onClick={() => skipTime(-10)}
                      className="control-btn"
                    >
                      <RotateCcw size={22} />
                    </button>

                    <button
                      onClick={() => skipTime(10)}
                      className="control-btn"
                    >
                      <RotateCw size={22} />
                    </button>

                    {/* INDICADOR DE TIEMPO */}
                    <span className="time-display" style={{ color: '#fff', fontSize: '0.85rem', marginLeft: '8px', fontWeight: '500' }}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                  </div>

                  {/* CONTROLES DERECHOS */}

                  <div className="control-group right">

                    <div className="volume-control">

                      <button
                        onClick={toggleMute}
                        className="control-btn"
                      >
                        {isMuted ? (
                          <VolumeX
                            size={22}
                            color="#ef4444"
                          />
                        ) : (
                          <Volume2 size={22} />
                        )}
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                      />

                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="control-btn"
                    >
                      {isFullscreen ? (
                        <Minimize size={22} />
                      ) : (
                        <Maximize size={22} />
                      )}
                    </button>

                  </div>

                </div>

              </motion.div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </main>
  );
}