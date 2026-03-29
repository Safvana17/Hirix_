import React, { useState } from 'react';
import type { JobRole } from '../../../types/jobRole';

interface JobRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: JobRole) => void;
}

const JobRoleModal: React.FC<JobRoleModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {

    const [formData, setFormData] = useState({
        name: '',
        skills: '',
        experienceMin: 0,
        experienceMax: 0,
        openings: 0
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formattedSkills = formData.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(Boolean);

        if (formattedSkills.length === 0) {
          alert("Please add at least one skill");
          return;
        }

        const data: JobRole = {
            name: formData.name.trim(),
            skills: formattedSkills,
            experienceMin: formData.experienceMin,
            experienceMax: formData.experienceMax,
            openings: formData.openings
        };

        onSave(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8">

                {/* Header */}
                <div className="flex justify-between items-center px-8 py-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Add Job Role
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* Job Role Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Job Role Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                            }
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Enter job role name"
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Skills (comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.skills}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    skills: e.target.value
                                })
                            }
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="React, Node.js, MongoDB"
                        />
                    </div>

                    {/* Experience */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">
                                Min Experience (years)
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={formData.experienceMin}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        experienceMin: Number(e.target.value)
                                    })
                                }
                                className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">
                                Max Experience (years)
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={formData.experienceMax}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        experienceMax: Number(e.target.value)
                                    })
                                }
                                className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    {/* Openings */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Openings
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={formData.openings}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    openings: Number(e.target.value)
                                })
                            }
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border text-gray-500 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
                        >
                            Add Job Role
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobRoleModal;