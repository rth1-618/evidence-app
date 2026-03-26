import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockEvidence } from '../../utils/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import '../../utils/leafletConfig';
import 'leaflet/dist/leaflet.css';

export default function EvidenceMap() {
  const center: [number, number] = [51.5074, -0.1278];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Evidence Map</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Geographic visualization of evidence locations</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px]">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {mockEvidence.map((evidence) => (
            <Marker
              key={evidence.id}
              position={[evidence.locationFound.lat, evidence.locationFound.lng]}
            >
              <Popup>
                <div className="p-2">
                  <div className="font-semibold">{evidence.id}</div>
                  <div className="text-sm text-gray-600">{evidence.title}</div>
                  <div className="mt-2">
                    <StatusBadge status={evidence.status} size="sm" />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {evidence.locationFound.address}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            <span className="text-sm text-gray-600">In Lab</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Disposed</span>
          </div>
        </div>
      </div>
    </div>
  );
}