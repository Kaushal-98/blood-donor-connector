import { motion, AnimatePresence } from 'framer-motion'

function HandoffTransition({ show, imageSrc, label }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-full overflow-hidden">
            <motion.img
              src={imageSrc}
              alt={label}
              className="w-full h-full object-cover"
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
            <motion.div
              className="absolute bottom-16 left-0 right-0 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="font-display text-2xl font-bold text-white mb-2">{label}</p>
              <div className="flex justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pulse animate-heartbeat"></span>
                <span className="w-2 h-2 rounded-full bg-pulse animate-heartbeat" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-pulse animate-heartbeat" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default HandoffTransition