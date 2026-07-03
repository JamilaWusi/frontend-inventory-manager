// frontend-inventory-manager/src/pages/Landing.jsx

export default function Landing({ onGetStarted, onViewDemo }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-widest font-semibold text-emerald-400 mb-4">
            Enterprise Grade Solution
          </h2>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Orchestrate Your <br className="text-green" /> Inventory Logic with Precision
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            StockFlow Pro is the central nervous system for modern logistics. Real-time tracking, military-grade security, and seamless cloud deployment in one unified dashboard.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="bg-green-500  font-semibold px-8 py-3 rounded-lg hover:bg-slate-100 transition"
            >
              Get Started
            </button>
            <button
              onClick={onViewDemo}
              className="bg--green-600  font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition"
            >
              View Demo
            </button>
          </div>

          {/* Dashboard Mockup */}
          <div className="mt-16 bg-slate-700 rounded-lg shadow-2xl p-6 aspect-video flex items-center justify-center">
            <div className="text-slate-400">
              <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard Charts & Metrics
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="bg-slate-50 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6 text-center border-l-4 border-emerald-500">
            <p className="text-4xl font-bold text-slate-900">84,291</p>
            <p className="text-slate-600 mt-2">Total Items</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center border-l-4 border-red-500">
            <p className="text-4xl font-bold text-slate-900">12</p>
            <p className="text-slate-600 mt-2">Critical Errors</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center border-l-4 border-blue-500">
            <p className="text-4xl font-bold text-slate-900">1,402</p>
            <p className="text-slate-600 mt-2">System Uptime hrs</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center border-l-4 border-slate-400">
            <p className="text-4xl font-bold text-slate-900">99.9%</p>
            <p className="text-slate-600 mt-2">Availability</p>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Architected for Speed. Built for Reliability.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our infrastructure handles millions of transactions daily with sub-millisecond latency, ensuring your inventory data is always in sync.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-8">
          {/* Real-time Global Sync */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20H19a2 2 0 002-2v-2a2 2 0 00-2-2h-2.5a2.5 2.5 0 01-2.5-2.5V9.5a2.5 2.5 0 00-2.5-2.5H9.5a2 2 0 00-2 2v2a2 2 0 01-2 2H3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Real-time Global Sync</h3>
            <p className="text-slate-600 mb-3">
              Proprietary delta-sync technology ensures every warehouse, vehicle, and terminal is updated within 50ms of a change.
            </p>
            <p className="text-sm text-emerald-600 font-semibold">Ultra-low latency • Global coverage</p>
          </div>

          {/* Military Grade Security */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Military Grade Security</h3>
            <p className="text-slate-600 mb-3">
              AES-256 encryption at rest and in transit. SOC2 Type II compliant with automated threat detection.
            </p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>✓ End-to-End Encryption (AES-256)</li>
              <li>✓ SSO / SAML Integration</li>
              <li>✓ Multi-Factor Authentication</li>
            </ul>
          </div>

          {/* Cloud Deployment */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Cloud Deployment</h3>
            <p className="text-slate-600 mb-3">
              Deploy on AWS, Azure, or GCP with a single click. Hybrid-cloud support for legacy systems.
            </p>
            <p className="text-sm text-purple-600 font-semibold">AWS • Azure • Google Cloud</p>
          </div>

          {/* API-First Ecosystem */}
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">API-First Ecosystem</h3>
            <p className="text-slate-600 mb-4">
              Connect ERP, CRM, and POS systems seamlessly with robust RESTful API and GraphQL endpoints.
            </p>
            <pre className="bg-slate-900 text-slate-100 text-xs p-3 rounded overflow-x-auto">
{`GET /api/v2/inventory
  ?status=in-stock
  &sort=sku

POST /api/v2/webhooks`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Flow?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join over 1,200 enterprises using StockFlow Pro to scale their operations globally.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-slate-900 font-semibold px-8 py-3 rounded-lg hover:bg-slate-100 transition">
              Book a Personalized Demo
            </button>
            <button className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-emerald-700 transition">
              Start Free Trial
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-4">No credit card required for 14-day evaluation.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-center text-sm">
        <p className="mb-2">
          © 2024 StockFlow Systems v2.4.1 · Privacy Policy · Terms of Service · Security Audit
        </p>
        <p>
          WAREHOUSE • CAPACITY • OPERATIONAL • LOW STOCK ALERTS • GLOBAL UPS • OPTIMIZE
        </p>
      </footer>
    </div>
  );
}