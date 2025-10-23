import React, { useState } from 'react';
import '../styles/components/search-input.css';

function SearchInput({ value, onChange, onSubmit, placeholder = "Search for recipes..." }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={`wave-group ${isFocused || value ? 'focused' : ''}`}>
      <input 
        type="text" 
        className="wave-input" 
        value={value}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required
      />
      <span className="wave-bar"></span>
      <label className="wave-label">
        {placeholder.split('').map((char, index) => (
          <span 
            key={index} 
            className="wave-label-char" 
            style={{ 
              '--char-index': index,
              animationDelay: `${index * 0.05}s`
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </label>
    </div>
  );
}

export default SearchInput;
