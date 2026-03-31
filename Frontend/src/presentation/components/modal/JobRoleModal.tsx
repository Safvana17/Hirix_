import React, { useState } from 'react';
import type { JobRole, ModalMode } from '../../../types/jobRole';

interface JobRoleModalProps {
    isOpen: boolean;
    mode: ModalMode;
    initialData?: JobRole | null;
    onClose: () => void;
    onSave: (data: JobRole) => void;
}

const JobRoleModal: React.FC<JobRoleModalProps> = ({
    isOpen,
    mode,
    initialData,
    onClose,
    onSave
}) => {

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        skills: initialData?.skills?.join(", ") || '',
        experienceMin: initialData?.experienceMin || 0,
        experienceMax: initialData?.experienceMax || 0,
        openings: initialData?.openings || 0
    });

    // useEffect(() => {
    //     if(initialData){
    //         setFormData({
    //             name: initialData.name,
    //             skills: initialData.skills.join(', '),
    //             experienceMin: initialData.experienceMin,
    //             experienceMax: initialData.experienceMax,
    //             openings: initialData.openings
    //         })
    //     }else{
    //         setFormData({
    //             name: '',
    //             skills: '',
    //             experienceMin: 0,
    //             experienceMax: 0,
    //             openings: 0
    //         })
    //     }
    // },[initialData, isOpen])

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
            ...initialData,
            name: formData.name.trim(),
            skills: formattedSkills,
            experienceMin: formData.experienceMin,
            experienceMax: formData.experienceMax,
            openings: formData.openings
        };

        onSave(data);
    };

    const isView = mode === 'view'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8">

                <div className="flex justify-between items-center px-8 py-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {mode === 'create' && 'Add Job Role'}
                        {mode === 'edit' && 'Edit Job Role'}
                        {mode === 'view' && 'View Job Role'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Job Role Name
                        </label>
                        <input
                            type="text"
                            required
                            disabled={isView}
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

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Skills (comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.skills}
                            disabled={isView}
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">
                                Min Experience (years)
                            </label>
                            <input
                                type="number"
                                min={0}
                                disabled={isView}
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
                                disabled={isView}
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

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Openings
                        </label>
                        <input
                            type="number"
                            min={0}
                            disabled={isView}
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

                    {isView && 
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">
                                Status
                            </label>
                            <input
                                type="text"
                                required
                                disabled={isView}
                                value={initialData?.status}
                                className={`w-full px-4 py-3 border ${initialData?.status === 'Active' ? 'bg-green-200 text-green-800 border-green-800' : 'bg-red-200 text-red-800 border-red-800'} rounded-xl outline-none focus:ring-2 focus:ring-amber-500`}
                            />
                        </div>
                    }

                    {!isView &&
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
                    }
                </form>
            </div>
        </div>
    );
};

export default JobRoleModal;