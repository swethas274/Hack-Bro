import React from 'react';

interface ConfigPanelProps {
    tone: string;
    onToneChange: (tone: string) => void;
    wordLimit: string;
    onWordLimitChange: (limit: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ tone, onToneChange, wordLimit, onWordLimitChange }) => {
    
    const selectClasses = "bg-brand-input border border-brand-input text-brand-text-secondary text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-1.5";

    return (
        <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
                <label htmlFor="tone-select" className="block mb-1 text-xs font-medium text-brand-text-secondary">TONE</label>
                <select 
                    id="tone-select" 
                    value={tone} 
                    onChange={(e) => onToneChange(e.target.value)}
                    className={selectClasses}
                >
                    <option value="Beginner Friendly">Beginner Friendly</option>
                    <option value="Encouraging">Encouraging</option>
                    <option value="Professional">Professional</option>
                    <option value="Expert">Expert</option>
                </select>
            </div>
            <div>
                <label htmlFor="limit-select" className="block mb-1 text-xs font-medium text-brand-text-secondary">WORD LIMIT</label>
                <select 
                    id="limit-select" 
                    value={wordLimit}
                    onChange={(e) => onWordLimitChange(e.target.value)}
                    className={selectClasses}
                >
                    <option value="Short">Short (~50 words)</option>
                    <option value="Medium">Medium (~150 words)</option>
                    <option value="Long">Long (~300+ words)</option>
                </select>
            </div>
        </div>
    );
};

export default ConfigPanel;
