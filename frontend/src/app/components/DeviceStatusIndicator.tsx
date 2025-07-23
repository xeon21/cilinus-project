import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DeviceStatusIndicatorProps {
  status: 'online' | 'warning' | 'offline' | 'ready';
  lastHeartbeat: string;
  isRealtime?: boolean;
}

// Helper function to format relative time
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}초 전`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  }
};

export const DeviceStatusIndicator: React.FC<DeviceStatusIndicatorProps> = ({
  status,
  lastHeartbeat,
  isRealtime = false
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // 상태 변경 시 애니메이션
  useEffect(() => {
    if (isRealtime) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastHeartbeat, isRealtime]);

  const statusColors = {
    online: '#10b981',   // green-500
    warning: '#f59e0b',  // yellow-500
    offline: '#ef4444',  // red-500
    ready: '#3b82f6'     // blue-500
  };

  const statusText = {
    online: '정상',
    warning: '경고',
    offline: '오프라인',
    ready: '준비'
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        <motion.div
          className="relative"
          animate={isUpdating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColors[status] }}
          />
          
          {/* 실시간 업데이트 시 pulse 효과 */}
          {isRealtime && (status === 'online' || status === 'ready') && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: statusColors[status] }}
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.5, 0, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      <span 
        className={`text-sm ${isUpdating ? 'font-semibold' : ''}`}
        style={isUpdating ? { color: statusColors[status] } : {}}
      >
        {statusText[status]}
      </span>
    </div>
  );
};