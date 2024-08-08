import React, { useState } from 'react';

const LazyLoadedComponent: React.FC = () => {
  const [filter, setFilter] = useState('');
  const items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Special Item',
    'Another Item',
  ];

  const filteredItems = items.filter(item => 
    item.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-blue-600">Lazy Loaded Component</h2>
      <p className="text-gray-500">This component includes a simple filter to showcase interactive content.</p>
      <input
        type="text"
        placeholder="Filter items..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <ul className="list-disc list-inside space-y-2">
        {filteredItems.map((item, index) => (
          <li key={index} className="p-2 bg-gray-100 rounded-lg shadow-sm">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default LazyLoadedComponent;
