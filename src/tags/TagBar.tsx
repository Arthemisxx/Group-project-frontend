import React, { useEffect, useState } from 'react';
import { fetchAllTags } from './TagService';
import './TagBar.css';

interface TagBarProps {
    onTagSelect: (tag: string | null) => void;
}

export const TagBar = ({ onTagSelect }: TagBarProps) => {
    const [tags, setTags] = useState<string[]>([]);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    useEffect(() => {
        fetchAllTags().then(setTags);
    }, []);

    const handleTagClick = (tag: string) => {
        const newTag = activeTag === tag ? null : tag;
        setActiveTag(newTag);
        onTagSelect(newTag);
    };

    return (
        <div className="tag-bar">
            {tags.map(tag => (
                <button
                    key={tag}
                    className={`tag-pill ${activeTag === tag ? 'active' : ''}`}
                    onClick={() => handleTagClick(tag)}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
};