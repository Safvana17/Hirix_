import React, { useState } from 'react';

const NotificationTab: React.FC = () => {
  const [preferences, setPreferences] = useState({
    testSubmissions: false,
    interviewReminders: false,
    subscriptionAlerts: false,
    productUpdates: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saved preferences:', preferences);
    // Here, you can send preferences to your API
  };

  return (
    <div className="bg-white p-5 rounded-xl flex items-center">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl w-full">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Notification Preferences</h2>
          <p className="text-sm text-gray-500 mt-1">Choose what updates you want to receive.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
            <div className="space-y-0.5">
              <label className="text-base font-semibold">Test Submissions</label>
              <p className="text-sm text-gray-500">Receive emails when candidates complete a test.</p>
            </div>
            <input
              type="checkbox"
              name="testSubmissions"
              checked={preferences.testSubmissions}
              onChange={handleChange}
              className="w-5 h-5 accent-[#7c5a1a]"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
            <div className="space-y-0.5">
              <label className="text-base font-semibold">Interview Reminders</label>
              <p className="text-sm text-gray-500">Get notified 24 hours before scheduled interviews.</p>
            </div>
            <input
              type="checkbox"
              name="interviewReminders"
              checked={preferences.interviewReminders}
              onChange={handleChange}
              className="w-5 h-5 accent-[#7c5a1a]"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
            <div className="space-y-0.5">
              <label className="text-base font-semibold">Subscription & Billing</label>
              <p className="text-sm text-gray-500">Important alerts about your current plan.</p>
            </div>
            <input
              type="checkbox"
              name="subscriptionAlerts"
              checked={preferences.subscriptionAlerts}
              onChange={handleChange}
              className="w-5 h-5 accent-[#7c5a1a]"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
            <div className="space-y-0.5">
              <label className="text-base font-semibold">Product Updates</label>
              <p className="text-sm text-gray-500">News about new features and improvements.</p>
            </div>
            <input
              type="checkbox"
              name="productUpdates"
              checked={preferences.productUpdates}
              onChange={handleChange}
              className="w-5 h-5 accent-[#7c5a1a]"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="bg-[#7c5a1a] hover:bg-[#634815] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationTab;