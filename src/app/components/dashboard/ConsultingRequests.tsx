"use client"
import React, { useState } from 'react'
import { ConsultingRequest } from '../../types/types'

export default function ConsultingRequests() {
    const [requests, setRequests] = useState<ConsultingRequest[]>([
        { id: '1', requestText: 'How can I improve my value proposition?', status: 'PENDING' },
        { id: '2', requestText: 'Suggestions for customer segments?', status: 'COMPLETED' },
      ]);
      const [newRequest, setNewRequest] = useState<string>('');
    
      return (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Consulting Requests</h2>
            <div className="p-6 bg-white rounded-lg shadow-md mb-8">
              <textarea
                value={newRequest}
                onChange={(e) => setNewRequest(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
                rows={4}
                placeholder="Enter your consulting request..."
              ></textarea>
              <button
                onClick={() => {
                  if (newRequest.trim()) {
                    setRequests([
                      ...requests,
                      { id: (requests.length + 1).toString(), requestText: newRequest, status: 'PENDING' },
                    ]);
                    setNewRequest('');
                  }
                }}
                className="bg-linear-to-r from-blue-600 to-cyan-500 text-gray-500 px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Request
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-gray-600">Request</th>
                    <th className="px-6 py-3 text-left text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-t">
                      <td className="px-6 py-4">{request.requestText}</td>
                      <td className="px-6 py-4">{request.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );
}
