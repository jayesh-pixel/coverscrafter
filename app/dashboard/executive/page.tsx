import { PlaceholderPanel, PlaceholderStatGrid } from "@/components/ui/dashboard-placeholder";

export default function ExecutiveDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <PlaceholderStatGrid
        items={[
          { label: "Insurance (CUT & PAY)", value: "0", trend: "(100%)" },
          { label: "Total Business", value: "₹0/-", trend: "" },
          { label: "Endorsed", value: "0", trend: "" },
          { label: "Cancelled", value: "0", trend: "" },
        ]}
      />

      {/* Policies Expiring Soon Table */}
      <PlaceholderPanel title="Policies Expiring Soon" description="Upcoming policy renewals and expirations.">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <table className="min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Previous Policy Id</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Customer Name</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Mobile Number</th>
                <th className="px-4 py-3 font-semibold text-slate-700">OD Expiry Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700">TP Expiry Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Previous Policy Type</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: "2219043124P113488596", name: "AUDUMBAR ARUN GAWADE", mobile: "7666710021", odExpiry: "2025-11-24", tpExpiry: "2029-11-24", type: "OD1TP5" },
                { id: "2219043124P113698138", name: "RUSHIKESH BALU KAMBALE", mobile: "9112403182", odExpiry: "2025-11-27", tpExpiry: "2029-11-27", type: "OD1TP5" },
                { id: "2219043124P113706258", name: "MARUTI TUKARAM CHAVAN", mobile: "8530805077", odExpiry: "2025-11-27", tpExpiry: "2029-11-27", type: "OD1TP5" },
                { id: "3397-05379014-000-00", name: "OMKAR RAJARAM CHAVAN", mobile: "8805050332", odExpiry: "2025-12-01", tpExpiry: "2029-12-01", type: "OD1TP5" },
                { id: "2214033124P114203166", name: "CHANDRAKANT TATOBA KOLAPE", mobile: "8806074167", odExpiry: "2025-12-06", tpExpiry: "2029-12-06", type: "OD1TP5" },
                { id: "2214033124P114248614", name: "SUNITA SARJERAV KHOT", mobile: "9226607736", odExpiry: "2025-12-08", tpExpiry: "2029-12-08", type: "OD1TP5" },
                { id: "2214033124P114253348", name: "AKASHA SHANKAR NAIK", mobile: "7666594548", odExpiry: "2025-12-08", tpExpiry: "2029-12-08", type: "OD1TP5" },
                { id: "2214033124P114402226", name: "RANI DATTATRAY RUPNAR", mobile: "8857091102", odExpiry: "2025-12-10", tpExpiry: "2029-12-10", type: "OD1TP5" },
              ].map((policy) => (
                <tr key={policy.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{policy.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{policy.name}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.mobile}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.odExpiry}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.tpExpiry}</td>
                  <td className="px-4 py-3 text-slate-600">{policy.type}</td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
                      Renew
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PlaceholderPanel>
    </div>
  );
}
