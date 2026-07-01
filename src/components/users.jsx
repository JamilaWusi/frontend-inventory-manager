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

    onAddUser?.({
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
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">User Management</h2>
        <p className="text-sm text-slate-600">Create and manage users from this section.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 sm:p-6">
        <input
          type="text"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={newUser.phoneNumber}
          onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2"
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
          className="w-full rounded border border-slate-300 px-3 py-2 sm:col-span-2"
        />
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 sm:col-span-2"
        >
          Add User
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-180 w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Business</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.businessName}</td>
                <td className="px-4 py-3">{user.dateCreated}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onDeleteUser?.(user.id)}
                    disabled={currentUser?.id === user.id}
                    className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
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
  );
}
