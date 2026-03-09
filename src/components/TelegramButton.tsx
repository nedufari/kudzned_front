import { motion } from 'framer-motion';

const TelegramButton = () => {
  return (
    <motion.a
      href="https://t.me/kudzned"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -8, 0],
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        },
        scale: { duration: 0.5 },
        opacity: { duration: 0.5 }
      }}
      whileHover={{ scale: 1.15, boxShadow: '0 12px 48px rgba(0, 136, 204, 0.6)' }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        width: '64px',
        height: '64px',
        backgroundColor: '#0088cc',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(0, 136, 204, 0.4)',
        zIndex: 9999,
        color: 'white',
        textDecoration: 'none',
        border: '2px solid rgba(255,255,255,0.1)'
      }}
      title="Join our Telegram"
    >
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 136, 204, 0.4) 0%, transparent 70%)',
          zIndex: -1
        }}
      />
      <svg 
        viewBox="0 0 24 24" 
        width="32" 
        height="32" 
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.74 7.58-3.27 3.61-1.51 4.35-1.77 4.84-1.78.11 0 .35.03.5.15.13.1.17.23.18.33.01.08.02.24.01.31z" />
      </svg>
    </motion.a>
  );
};

export default TelegramButton;
