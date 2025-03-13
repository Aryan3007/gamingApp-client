/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"

import axios from "axios"
import { memo, useCallback, useEffect, useState } from "react"
import { server } from "../constants/config"

const Exposure = ({ user, onWalletUpdate, onExposureUpdate }) => {
  const [lastFetchTime, setLastFetchTime] = useState(0)

  // Fetch user data to update wallet amount
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    if (!token) return

    try {
      const response = await axios.get(`${server}api/v1/user/me`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      onWalletUpdate(response?.data.user.amount)
    } catch (error) {
      console.log(error)
      // We don't dispatch userNotExist here as that's handled by the parent component
    }
  }, [onWalletUpdate])

  // Get total exposure directly from the API
  const getTotalExposure = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    if (!token) return 0

    try {
      const response = await axios.get(`${server}api/v1/bet/total-exposure`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Total exposure response:", response.data)

      // Return the exposure value from the API response
      if (response.data.success) {
        return response.data.exposure || 0
      }
    } catch (error) {
      console.error("Error fetching total exposure:", error)
    }
    return 0
  }, [])

  // Optimized update function with throttling
  const updateData = useCallback(async () => {
    const now = Date.now()
    // Throttle updates to once per second
    if (now - lastFetchTime < 1000) return

    setLastFetchTime(now)

    // Fetch user data and total exposure in parallel
    const [_, totalExposure] = await Promise.all([fetchUserData(), getTotalExposure()])

    // Update the exposure value
    onExposureUpdate(totalExposure)
  }, [fetchUserData, getTotalExposure, lastFetchTime, onExposureUpdate])

  // Effect for initial data load and interval setup
  useEffect(() => {
    if (!user) return

    // Initial data load
    updateData()

    // Set up interval for updates
    const interval = setInterval(updateData, 1000)

    return () => clearInterval(interval)
  }, [user, updateData])

  // This component doesn't render anything, it just handles the data fetching
  return null
}

const ExposureCalculator = memo(Exposure)
ExposureCalculator.displayName = "ExposureCalculator"

export default Exposure

