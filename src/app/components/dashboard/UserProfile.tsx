"use client"
import React, { useState } from 'react'
import { Profile } from '@/app/types/types';

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile>({ name: 'John Doe', email: 'john@example.com' });

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h2>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-2">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <button className="mt-4 bg-linear-to-r from-blue-600 to-cyan-500 text-gray-500 px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-2">Current Password</label>
              <input
                type="password"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">New Password</label>
              <input
                type="password"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <button className="mt-4 bg-linear-to-r from-blue-600 to-cyan-500 text-gray-500 px-4 py-2 rounded hover:bg-green-700">Update Password</button>
        </div>
      </div>
    </section>
  );
}
