import React, { useState } from 'react';
import './MultiSelectInput.scss';
import { skillsOptions } from 'skillOptions';

const MultiSelectInput = ({ skills, setSkills }) => {
  const [selects, setSelects] = useState(skills);

  const handleChange = (index, value) => {
    const updated = [...selects];
    updated[index] = value;
    setSelects(updated);
    setSkills(updated);
  };

  const addSelect = () => {
    setSelects([...selects, '']);
  };

  const removeSelect = (index) => {
    const updated = selects.filter((_, i) => i !== index);
    setSelects(updated);
    setSkills(updated);
  };

  const getFilteredOptions = (currentIndex) => {
    const selectedExceptCurrent = selects.filter((_, i) => i !== currentIndex);
    return [
      { value: '', label: 'Select an option' },
      ...skillsOptions
        .filter((skill) => !selectedExceptCurrent.includes(skill.name))
        .map((skill) => ({
          value: skill.name,
          label: skill.name,
        }))
    ];
  };

  return (
    <div className="multi-select">
      {selects.map((value, index) => (
        <div key={index} className="select-row">
          <select
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
          >
            {getFilteredOptions(index).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => removeSelect(index)}
            className="remove-btn"
          >
            ✖
          </button>

          {index === selects.length - 1 && (
            <button type="button" className="add-btn" onClick={addSelect}>
              +
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MultiSelectInput;
