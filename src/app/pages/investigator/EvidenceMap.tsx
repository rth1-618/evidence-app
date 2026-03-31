import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockEvidence } from '../../utils/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import '../../utils/leafletConfig';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { stat } from 'node:fs';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function FlyToEvidence({ evidence }: { evidence: any }) {
  const map = useMap();

  useEffect(() => {
    if (evidence && evidence.locationFound) {
      map.flyTo(
        [evidence.locationFound.lat, evidence.locationFound.lng],
        16
      );
    }
  }, [evidence]);

  return null;
}

export default function EvidenceMap() {
  const { user, isLoading: authLoading } = useAuth();
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [openCaseId, setOpenCaseId] = useState(null);
  const center = [51.5074, -0.1278];
  // list case
  const { data: caseList = [], isLoading, refetch } = useQuery({
        queryKey: ['cases', user?.id],
        queryFn: async () => {
          const res = await api.get('/cases', { params: { investigatorId: user!.id } });
          console.log('res:', res);
          return res.data.data;
        },
        enabled: !!user?.id
      });
  // list evidence
  const { data: evidenceList = [], isLoading: evidenceLoading } = useQuery({
        queryKey: ['evidence', user?.id],
        queryFn: async () => {
          const res = await api.get('/evidence', { params: { investigatorId: user!.id } });
          console.log('evidence res:', res);
          return res.data.data;
        },
        enabled: !!user?.id
      });
    return(
      <div className="flex gap-4">
        {/* 左邊案件列表 */}
        <div className="w-1/3 space-y-2 bg-white border rounded-lg overflow-y-auto">
          {caseList.map((c: any) => (
            <div key={c.caseId} className="border rounded-lg">
              {/* Case Header */}
              <div
                className="p-4 bg-gray-100 cursor-pointer hover:bg-gray-200"
                onClick={() =>
                  setOpenCaseId(openCaseId === c.caseId ? null : c.caseId)
                }
              >
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-gray-500">{c.caseId}</div>
              </div>

              {/* Case Detail */}
              {openCaseId === c.caseId && (
                <div className="p-4 bg-white border-t">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Case ID:</span> {c.caseId}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {c.types}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {c.status}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span> {c.description}
                    </div>
                    <div>
                      <div className="mt-3">
                          <div className="font-medium text-gray-800 mb-2">Evidence</div>

                          <div className="space-y-2">
                            {evidenceList
                              .filter((e) => e.caseId === c.caseId)
                              .map((evidence: any) => (
                                <div
                                  key={evidence.id}
                                  className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                                  onClick={() => setSelectedEvidence(evidence)}
              
                                >
                                  {/* Title + Status */}
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">
                                      {evidence.title}
                                    </span>

                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        evidence.status === "active"
                                          ? "bg-blue-100 text-blue-600"
                                          : evidence.status === "pending"
                                          ? "bg-yellow-100 text-yellow-600"
                                          : evidence.status === "in-lab"
                                          ? "bg-purple-100 text-purple-600"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {evidence.status}
                                    </span>
                                  </div>

                                  {/* Description */}
                                  <div className="text-sm text-gray-600 mt-1">
                                    {evidence.description}
                                  </div>

                                  {/* Location */}
                                  {evidence.locationFound && (
                                    <div className="text-xs text-gray-400 mt-2">
                                      📍 {evidence.locationFound.address}
                                    </div>
                                  )}
                                  {/* Media*/}
                                  <div className="flex gap-2 mt-2">
                                    {evidence.media?.map((m, index) => (
                                      m.type === "image" && (
                                        <img
                                          key={index}
                                          src={m.url}
                                          className="w-16 h-12 object-cover rounded"  
                                        />
                                      )
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
          }
        </div>
        {/* 右邊地圖 */}
        <div className="w-2/3 bg-white border rounded-lg overflow-hidden">
        <MapContainer
          center={
            selectedEvidence
              ? [
                  selectedEvidence.locationFound.lat,
                  selectedEvidence.locationFound.lng,
                ]
              : center
          }
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <FlyToEvidence evidence={selectedEvidence} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {evidenceList
            .filter((e) => e.locationFound && e.locationFound.lat && e.locationFound.lng)
            .map((evidence: any) => (
            <Marker
              key={evidence.id}
              position={[
                evidence.locationFound.lat,
                evidence.locationFound.lng,
              ]}
            >
              <Popup>
                <div>
                  <div className="font-semibold">{evidence.title}</div>
                  <div>{evidence.locationFound.address}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${                    evidence.status === "active"
                      ? "bg-blue-100 text-blue-600"
                      : evidence.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : evidence.status === "in-lab"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600"                  }`}>
                    {evidence.status}
                  </div>
                  <div>
                     {evidence.media?.map((m, index) => (
                        m.type === "image" && (
                          <img
                            key={index}
                            src={m.url}
                            className="w-32 h-24 object-cover rounded flex-shrink-0"
                          />
                        )
                      ))}
                  </div>
                </div>
              </Popup>  
            </Marker>
          ))}
        </MapContainer>
        </div>
      </div>
    );
}