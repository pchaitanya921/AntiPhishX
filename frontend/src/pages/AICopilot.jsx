import React from 'react';
import ChatInterface from '../components/ai/ChatInterface';
import { motion } from 'framer-motion';

/**
 * AICopilotPage Component
 * Full-page AI assistant experience
 */
const AICopilotPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col min-h-0"
        >
            <ChatInterface initialMode="cyber" />
        </motion.div>
    );
};

export default AICopilotPage;

