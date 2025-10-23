import React, { useState, useEffect } from 'react';
import { activityApi } from '../../services/api';

interface IActivity {
  _id: string;
  title: string;
  description: string;
  reward_amount: number;
}

interface ActivityFormProps {
  activity?: IActivity | null;
  onSave: () => void;
  onCancel: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activity, onSave, onCancel }) => {
  const [title, setTitle] = useState(activity?.title || '');
  const [description, setDescription] = useState(activity?.description || '');
  const [rewardAmount, setRewardAmount] = useState(activity?.reward_amount || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { title, description, reward_amount: rewardAmount };
      if (activity) {
        await activityApi.adminUpdateActivity(activity._id, data);
      } else {
        await activityApi.adminCreateActivity(data);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save activity:', error);
      alert('Failed to save activity.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{activity ? 'Edit Activity' : 'Create Activity'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rewardAmount">Reward Amount</label>
            <input
              type="number"
              id="rewardAmount"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(parseFloat(e.target.value))}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ActivityManagement: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<IActivity | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityApi.adminGetActivities();
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

  const handleCreateClick = () => {
    setEditingActivity(null);
    setShowForm(true);
  };

  const handleEditClick = (activity: IActivity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityApi.adminDeleteActivity(id);
        fetchActivities(); // Refresh list
      } catch (error) {
        console.error('Failed to delete activity:', error);
        alert('Failed to delete activity.');
      }
    }
  };

  const handleSaveForm = () => {
    setShowForm(false);
    setEditingActivity(null);
    fetchActivities(); // Refresh list after save
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  if (loading) {
    return <div className="text-center p-10">Loading activities...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Activity Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCreateClick}
        >
          Create Activity
        </button>
      </div>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Reward</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {activities.map(activity => (
              <tr key={activity._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="font-medium">{activity.title}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{activity.description}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  <span>{activity.reward_amount} CPL</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button
                      className="w-8 h-8 rounded-full bg-yellow-500 text-white mr-2"
                      onClick={() => handleEditClick(activity)}
                    >
                      E
                    </button>
                    <button
                      className="w-8 h-8 rounded-full bg-red-500 text-white"
                      onClick={() => handleDeleteClick(activity._id)}
                    >
                      D
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ActivityForm
          activity={editingActivity}
          onSave={handleSaveForm}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default ActivityManagement;