import { useState } from "react";

export default function UsersManager({ users = [], onAddUser, onDeleteUser, currentUser }) {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "Staff",
    businessName: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUser.firstName || !newUser.email || !newUser.password) return;

    onAddUser({
      ...newUser,
      id: Date.now(),
      dateCreated: new Date().toLocaleString(),
      dateUpdated: new Date().toLocaleString(),
    });

    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "Staff",
      businessName: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={newUser.phoneNumber}
          onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option>Admin</option>
          <option>Owner</option>
          <option>Staff</option>
        </select>
        <input
          type="text"
          placeholder="Business Name"
          value={newUser.businessName}
          onChange={(e) => setNewUser({ ...newUser, businessName: e.target.value })}
          className="border rounded px-3 py-2 md:col-span-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-2"
        >
          Add User
        </button>
      </form>

      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.role}</td>
              <td className="px-6 py-4">{user.businessName}</td>
              <td className="px-6 py-4">{user.dateCreated}</td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onDeleteUser(user.id)}
                  disabled={currentUser?.id === user.id}
                  className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
