"use client";

export default function ProfilePage() {
  const dealershipInfo = {
    name: "Badshah Bajaj Motor's",
    email: "badshahbajaj09@gmail.com",
    mobile: "9881882200",
    address:
      "Indian Oil Petrol Pump, G. No 684/A/1, Bagwan Jamayat, Sangli Road, Ichalkaranji, Kolhapur, Maharashtra, 416115, Maharashtra, 416115",
    dealershipId: "476",
    panNo: "AILPB2310H",
    gstin: "27AILPB2310H1ZR",
  };

  const users = [
    {
      name: "Irfan Bagwan",
      email: "toufiqattar999@gmail.com",
      mobile: "9881882200",
      role: "Owner",
      status: "Active",
    },
    {
      name: "Badshah Bajaj",
      email: "badshahbajaj09@gmail.com",
      mobile: "9881882200",
      role: "Executive",
      status: "Active",
    },
    {
      name: "Irfan Bagwan",
      email: "badshahbajajclaim@gmail.com",
      mobile: "9881882200",
      role: "Claims Manager",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      </div>

      {/* Dealership Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Name</label>
            <p className="text-sm text-slate-900">{dealershipInfo.name}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <p className="text-sm text-slate-900">{dealershipInfo.email}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Mobile No.</label>
            <p className="text-sm text-slate-900">{dealershipInfo.mobile}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Dealership Id</label>
            <p className="text-sm text-slate-900">{dealershipInfo.dealershipId}</p>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">Address</label>
            <p className="text-sm text-slate-900">{dealershipInfo.address}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">PAN No.</label>
            <p className="text-sm text-slate-900">{dealershipInfo.panNo}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">GSTIN</label>
            <p className="text-sm text-slate-900">{dealershipInfo.gstin}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Cancelled Check</label>
            <button className="mt-1 text-sm text-blue-600 hover:text-blue-800">View Document</button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-900">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Mobile
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Roles
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{user.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{user.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">{user.mobile}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
