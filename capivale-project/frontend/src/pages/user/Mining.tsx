import React, { useState, useEffect } from 'react';
import { activityApi } from '../../services/api';

interface IActivity {
  _id: string;
  title: string;
  description: string;
  reward_amount: number;
}

const Mining: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityApi.userListActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      alert('Failed to fetch activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleComplete = async (activityId: string) => {
    setCompleting(activityId);
    try {
      const response = await activityApi.userCompleteActivity(activityId);
      alert(response.data.message + ` You earned ${response.data.reward} CPL!`);
      fetchActivities(); // Refresh activities after completion
    } catch (error) {
      console.error('Failed to complete activity:', error);
      alert('Failed to complete activity.');
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading activities...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mine Capivale Coins</h1>
      <p className="text-lg text-gray-600 mb-8">Complete the tasks below to earn CPL coins and increase your balance.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.length === 0 ? (
          <p className="text-gray-600">No activities available at the moment. Check back later!</p>
        ) : (
          activities.map(activity => (
            <div key={activity._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">{activity.title}</h2>
                <p className="text-gray-700 mb-4">{activity.description}</p>
              </div>
              <div className="text-right">
                <button 
                  onClick={() => handleComplete(activity._id)}
                  disabled={completing === activity._id}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:bg-gray-400"
                >
                  {completing === activity._id ? 'Completing...' : `Mine ${activity.reward_amount} CPL`}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Mining;