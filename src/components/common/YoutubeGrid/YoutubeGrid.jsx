import React from 'react';
import './YoutubeGrid.scss';

/**
 * Componente que renderiza un iframe de YouTube en loop y silenciado,
 * con una cubierta de CSS para ocultar los controles.
 */
const YoutubeEmbed = ({ videoId, isLarge = false }) => {
  // Parámetros: autoplay=1, mute=1, loop=1, playlist=(ID) y Ocultar Controles
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&autohide=1&modestbranding=1&rel=0`;
  
  return (
    <div className={`yt-video-wrapper ${isLarge ? 'yt-video-large' : 'yt-video-small'}`}>
      
      {/* Este 'cover' es el truco para ocultar los controles */}
      <div className="yt-iframe-cover">
        <iframe
          src={embedUrl}
          title={`YouTube video player ${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

    </div>
  );
};

/**
 * Grilla de 3 videos de YouTube con layout 1 grande y 2 pequeños al lado.
 */
const YoutubeGrid = () => {
  // IDs de los videos que puedes cambiar
  const videoIds = [
    'FDRR4pt_UjM', // Grande
    '5tOzlrDhYps', // Pequeño 1
    'C51Y0W8IJr8'  // Pequeño 2
  ];

  return (
    <div className="yt-grid-container">
      {/* Video Grande (Ocupa la Columna 1) */}
      <YoutubeEmbed videoId={videoIds[0]} isLarge={true} />
      
      {/* Columna para los Videos Chicos (Ocupa la Columna 2) */}
      <div className="yt-small-videos-column">
        <YoutubeEmbed videoId={videoIds[1]} />
        <YoutubeEmbed videoId={videoIds[2]} />
      </div>
    </div>
  );
};

export default YoutubeGrid;