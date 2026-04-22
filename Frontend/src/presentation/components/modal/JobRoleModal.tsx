import React, { useState } from 'react';
import type { JobRole, ModalMode } from '../../../types/jobRole';
import { createJobRoleScheama } from '../../../lib/validation/jobRoleValidation';
import { ZodError } from 'zod';

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
    const [localError, setLocalError] = useState<Record<string, string>>({})

    if (!isOpen) return null;

    const validate = () => {
        try {
        createJobRoleScheama.parse(formData)
        setLocalError({})
        return true

        } catch (error) {
        if(error instanceof ZodError){
            const errors: Record<string, string> = {}
            error.issues.forEach((issue) => {
            const field = issue.path[0] 
            if(typeof field === 'string' ||typeof field === 'number')
            errors[field] = issue.message
            })
            setLocalError(errors)
        }
        return false
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!validate()) return

        const formattedSkills = formData.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(Boolean);

        if (formattedSkills.length === 0) {
          setLocalError({skills: 'Atleast one skill required'})
          return;
        }


        if( mode === 'create'){
            onSave({
                name: formData.name.trim(),
                skills: formattedSkills,
                experienceMin: formData.experienceMin,
                experienceMax: formData.experienceMax,
                openings: formData.openings,
                status: 'Active',
                id: ''
            })
        }else if(mode === 'edit' && initialData){
            onSave({
                id: initialData.id,
                status: initialData.status,
                name: formData.name.trim(),
                skills: formattedSkills,
                experienceMin: formData.experienceMin,
                experienceMax: formData.experienceMax,
                openings: formData.openings,
            })
        }
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
                        {localError.name && <p className='text-[#FBBEBE] text-sm'>{localError.name}</p>}
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
                        {localError.skills && <p className='text-[#FBBEBE] text-sm'>{localError.skills}</p>}
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
                            {localError.experienceMin && <p className='text-[#FBBEBE] text-sm'>{localError.experienceMin}</p>}
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
                            {localError.experienceMax && <p className='text-[#FBBEBE] text-sm'>{localError.experienceMax}</p>}
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
                        {localError.openings && <p className='text-[#FBBEBE] text-sm'>{localError.openings}</p>}
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
                                {mode === 'create' ? 'Add Job Role' : 'Update'}
                            </button>
                        </div>
                    }
                </form>
            </div>
        </div>
    );
};

export default JobRoleModal;