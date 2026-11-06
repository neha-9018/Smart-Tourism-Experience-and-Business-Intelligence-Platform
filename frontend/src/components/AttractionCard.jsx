import React from 'react';

export default function AttractionCard({ attraction }) {
  const { name, image, description } = attraction;
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h4 className="text-primary font-medium mb-1">{name}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

