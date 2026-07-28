import React from 'react'
import { File, Trash2, Upload } from 'lucide-react'
import type { Certificate } from '../../../../types/company'


interface CompanyCertificatesProps {
  certificates: Certificate[]
  handleAddCertificate: () => void
  handleRemoveCertificate: (index: number) => void
  updateCertificate: (
    index: number,
    field: string,
    value: unknown
  ) => void
}

const CompanyCertificates: React.FC<CompanyCertificatesProps> = ({
  certificates,
  handleAddCertificate,
  handleRemoveCertificate,
  updateCertificate,
}) => {
  console.log('certificates from certificates: ', certificates)
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Documents
        </h2>

        <button
          type="button"
          onClick={handleAddCertificate}
          className="text-sm bg-[#7c5a1a] hover:bg-[#634815] text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          + Add Certificate
        </button>
      </div>

      <div className="space-y-6">
        {certificates.map((cert, index) => (
          <div
            key={cert.id || index}
            className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Certificate #{index + 1}
              </h3>

              {certificates.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCertificate(index)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            {/* Type & Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Document Type
                </label>

                <select
                  value={cert.certificateType}
                  onChange={(e) =>
                    updateCertificate(
                      index,
                      'certificateType',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 bg-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#7c5a1a] outline-none text-sm"
                >
                  <option value="GST">GST Certificate</option>
                  <option value="COI">
                    Certificate of Incorporation
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  {cert.certificateType === 'GST'
                    ? 'GST Number'
                    : 'Certificate Number'}
                </label>

                <input
                  value={cert.certificateNumber}
                  onChange={(e) =>
                    updateCertificate(
                      index,
                      'certificateNumber',
                      e.target.value
                    )
                  }
                  placeholder={
                    cert.certificateType === 'GST'
                      ? 'Enter GST number'
                      : 'Enter certificate number'
                  }
                  className="w-full border border-gray-200 bg-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#7c5a1a] outline-none text-sm"
                />
              </div>
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Upload Certificate File
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#7c5a1a] transition relative bg-white">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) =>
                    updateCertificate(
                      index,
                      'certificateFile',
                      e.target.files?.[0] ?? null
                    )
                  }
                />

                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <Upload className="w-6 h-6 text-gray-400" />

                  <p className="text-sm text-gray-600">
                    Click to upload or drag & drop
                  </p>

                  <p className="text-xs text-gray-400">
                    PDF or Image (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Selected File */}
              {cert.certificateFile && (
                <div className="mt-3 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <span className="text-sm text-amber-700 truncate font-medium">
                    Selected: {cert.certificateFile.name}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateCertificate(
                        index,
                        'certificateFile',
                        null
                      )
                    }
                    className="text-amber-600 hover:text-amber-800 text-xs font-semibold"
                  >
                    Clear File
                  </button>
                </div>
              )}

              {/* Existing File */}
              {cert.fileUrl && !cert.certificateFile && (
                <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <File className="w-4 h-4 text-green-700" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Uploaded Document
                      </p>

                      <p className="text-xs text-gray-500">
                        Active file on server
                      </p>
                    </div>
                  </div>

                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline font-semibold"
                  >
                    View
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompanyCertificates