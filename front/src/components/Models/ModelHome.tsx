// src/components/ModelHome.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import css from './ModelHome.module.css';

interface ModelHomeProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModelHome: React.FC<ModelHomeProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={css.modalOverlay}>
            <div className={css.modalContent}>
                <button className={css.closeButton} onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement // Ensure there's an element with id 'modal-root' in index.html
    );
};

export default ModelHome;
