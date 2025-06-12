import { useEffect, useState } from 'react';

export default function CursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState('#4F46E5'); // Default indigo color
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if the device is desktop (min-width: 1024px)
    const checkIfDesktop = () => {
      setIsDesktop(window.matchMedia('(min-width: 1024px)').matches);
    };

    // Initial check
    checkIfDesktop();

    // Add resize listener
    window.addEventListener('resize', checkIfDesktop);

    const handleMouseMove = (e) => {
      if (!isDesktop) return; // Only track mouse on desktop
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (!isDesktop) return; // Only handle hover on desktop
      // Check if we're hovering over a book card
      const bookCard = e.target.closest('[data-book-card]');
      if (bookCard) {
        setIsHovering(true);
        // Get a random color from a predefined palette
        const colors = [
          '#4F46E5', // Indigo
          '#7C3AED', // Purple
          '#EC4899', // Pink
          '#F59E0B', // Amber
          '#10B981', // Emerald
          '#3B82F6', // Blue
        ];
        setColor(colors[Math.floor(Math.random() * colors.length)]);
      } else {
        setIsHovering(false);
        setColor('#4F46E5'); // Reset to default color
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('resize', checkIfDesktop);
    };
  }, [isDesktop]); // Add isDesktop to dependency array

  // Don't render anything on mobile/tablet
  if (!isDesktop) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 mix-blend-difference hidden lg:block"
      style={{
        transform: `translate(${position.x - 16}px, ${position.y - 16}px)`,
        transition: isHovering ? 'all 0.2s ease-out' : 'all 0.1s ease-out',
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: color,
          opacity: 0.8,
          transform: `scale(${isHovering ? 1.4 : 1})`,
          boxShadow: `0 0 30px ${color}40`,
          transition: 'all 0.3s ease-out',
          animation: 'pulse 2s infinite',
        }}
      />

      {/* Add keyframes for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(${isHovering ? 1.4 : 1});
              opacity: 0.8;
            }
            50% {
              transform: scale(${isHovering ? 1.6 : 1.2});
              opacity: 0.6;
            }
            100% {
              transform: scale(${isHovering ? 1.4 : 1});
              opacity: 0.8;
            }
          }
        `}
      </style>
    </div>
  );
} 