"use client"
import React, { useState } from 'react'
import { User } from '@/app/types/types'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
      { id: '1', email: 'user1@example.com', name: 'User One', role: 'USER' },
      { id: '2', email: 'user2@example.com', name: 'User Two', role: 'USER' },
    ]);
  
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">User Management</h2>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-gray-600">Role</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:underline mr-4">Edit</button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => setUsers(users.filter((u) => u.id !== user.id))}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
}
