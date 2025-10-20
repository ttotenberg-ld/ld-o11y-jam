import React, { useState, useEffect, useRef } from 'react';
import './FancyWidget.css';

const FancyWidget = () => {
  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState([]);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [stats, setStats] = useState({
    energy: 75,
    power: 60,
    efficiency: 85
  });
  const widgetRef = useRef(null);

  // Generate particle effects
  const generateParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 0.5
    }));
    setParticles(newParticles);
  };

  // Handle mouse move for 3D effect
  const handleMouseMove = (e) => {
    if (!widgetRef.current || !isActive) return;
    
    const rect = widgetRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((centerY - y) / centerY) * 15;
    
    setRotateX(rotateX);
    setRotateY(rotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Animate stats
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setStats({
          energy: Math.floor(Math.random() * 30) + 70,
          power: Math.floor(Math.random() * 40) + 60,
          efficiency: Math.floor(Math.random() * 20) + 80
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const toggleActive = () => {
    setIsActive(!isActive);
    if (!isActive) {
      generateParticles();
    } else {
      setParticles([]);
    }
  };

  return (
    <div className="fancy-widget">
      <h2 className="widget-title">
        <span className="title-gradient">✨ Ultra Fancy Widget ✨</span>
      </h2>
      
      <div
        ref={widgetRef}
        className={`widget-container ${isActive ? 'active' : ''}`}
        style={{
          transform: isActive 
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated Background */}
        <div className="widget-bg">
          <div className="bg-gradient-1"></div>
          <div className="bg-gradient-2"></div>
          <div className="bg-gradient-3"></div>
        </div>

        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}

        {/* Central Display */}
        <div className="widget-center">
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
          <div className="pulse-ring delay-2"></div>
          
          <div className="center-orb">
            <div className="orb-glow"></div>
            <div className="orb-inner">
              <span className="status-text">
                {isActive ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-label">Energy</div>
            <div className="stat-bar-container">
              <div 
                className="stat-bar energy"
                style={{ width: `${stats.energy}%` }}
              >
                <span className="stat-value">{stats.energy}%</span>
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Power</div>
            <div className="stat-bar-container">
              <div 
                className="stat-bar power"
                style={{ width: `${stats.power}%` }}
              >
                <span className="stat-value">{stats.power}%</span>
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Efficiency</div>
            <div className="stat-bar-container">
              <div 
                className="stat-bar efficiency"
                style={{ width: `${stats.efficiency}%` }}
              >
                <span className="stat-value">{stats.efficiency}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="corner corner-tl"></div>
        <div className="corner corner-tr"></div>
        <div className="corner corner-bl"></div>
        <div className="corner corner-br"></div>
      </div>

      <button
        className={`fancy-button ${isActive ? 'active' : ''}`}
        onClick={toggleActive}
      >
        <span className="button-text">
          {isActive ? 'Deactivate' : 'Activate'}
        </span>
        <span className="button-glow"></span>
      </button>
    </div>
  );
};

export default FancyWidget;

