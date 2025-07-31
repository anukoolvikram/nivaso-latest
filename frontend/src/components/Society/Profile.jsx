import {IdentificationIcon, Squares2X2Icon, EnvelopeIcon, HomeModernIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import Loading from '../Loading/Loading'
import apiClient from '../../services/apiClient'

const SocietyProfile = () => {
  const [society, setSociety] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/society/details`);
        const data=response.data;
        setSociety(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load society details.')
      } finally {
        setLoading(false)
      }
    }
    fetchSociety()
  }, [])

  if (loading) {
    return (
        <Loading />
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!society) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">No society found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm font-montserrat">
      <div className="max-w-4xl mx-auto">

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Society Details Card */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              Society Information
            </div>
            <div className="space-y-4 font-inter">
              <div className="flex items-start">
                <IdentificationIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Society Code</p>
                  <p className="font-medium">{society.society_code}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Squares2X2Icon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{society.society_type}</p>
                </div>
              </div>

              <div className="flex items-start">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Contact Email</p>
                  <p className="font-medium">{society.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Building Structure Card */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HomeModernIcon className="h-5 w-5 text-blue-500" />
              Building Structure
            </div>
            <div className="grid grid-cols-3 gap-4 font-inter items-center m-8">
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-navy bg-gray-100 p-4 rounded border border-purplegray">{society.wing_count}</p>
                <p className="text-xs text-gray-500">Wings</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-navy bg-gray-100 p-4 rounded border border-purplegray">{society.floors_per_wing}</p>
                <p className="text-xs text-gray-500">Floors per Wing</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-navy bg-gray-100 p-4 rounded border border-purplegray">{society.rooms_per_floor}</p>
                <p className="text-xs text-gray-500">Rooms per Floor</p>
              </div>
            </div>
          </div>

          {/* Federation Details (Conditional) */}
          {society.federation_code !== 'FED17032025' && (
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                {/* <BuildingLibraryIcon className="h-5 w-5 text-blue-500" /> */}
                Federation Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <IdentificationIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Federation Code</p>
                    <p className="font-medium">{society.federation_code}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Federation Name</p>
                    <p className="font-medium">{society.federation_name}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocietyProfile