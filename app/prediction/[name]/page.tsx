"use client";

import React, { useEffect, useState } from "react";
require('dotenv').config();

// Function that fetches country images from Unsplash
const getImages = async (country: string) => {
  const client_id = process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID;
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${country}&client_id=${client_id}`
  );
  const data = await response.json();
  return data.results || []; // Return results or an empty array
};

// Define the interface for the params
interface PredictionParams {
  params: { name: string };
}

// Prediction Page
export default function Prediction({ params }: PredictionParams) {
  const { name } = params; // Get the name from params directly

  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string>("Unknown Country");
  const [countryImages, setCountryImages] = useState<any[]>([]); // Initialize to an empty array
  const [countryInfo, setCountryInfo] = useState<any | null>(null); // For country info

  // Fetch country code based on the name
  useEffect(() => {
    const fetchCountryCode = async () => {
      if (name) {
        try {
          const response = await fetch(`https://api.nationalize.io?name=${name}`);
          const data = await response.json();
          if (data?.country?.length > 0) { // Checks if there are any countries
            setCountryCode(data.country[0].country_id); // Set country code
          } else {
            setCountryCode(null); // No country prediction
          }
        } catch (error) {
          console.error("Error fetching nationality:", error);
          setCountryCode(null);
        }
      }
    };

    fetchCountryCode();
  }, [name]);

  // Fetch country name, images, and brief info from country code
  useEffect(() => {
    const fetchCountryData = async (code: string) => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const data = await response.json();
        if (data && data.length > 0) {
          const fullCountryName = data[0].name.common; // Get the name of the country
          setCountryName(fullCountryName);
          const images = await getImages(fullCountryName); // Fetch country images after getting the country name
          setCountryImages(images); // Set images to state
          setCountryInfo(data[0]); // Set country info
        } else {
          setCountryName("Unknown Country");
        }
      } catch (error) {
        console.error("Error fetching country name:", error);
        setCountryName("Unknown Country");
      }
    };

    if (countryCode) {
      fetchCountryData(countryCode);
    }
  }, [countryCode]);

  return (
    <div className="min-h-screen flex items-center justify-start bg-white px-64">
      <div className="p-4 shadow-md bg-black rounded-md">
        <h1 className="text-3xl text-center font-semibold mb-4 text-white">
          Predicted Country for {name}
        </h1>
        {countryCode ? (
          <div className ="text-center text-white">
            <p>Country Code: {countryCode}</p>
            <p>Country Name: {countryName}</p>
            <div className="grid grid-cols-1 md:grid-cols-auto-fit md:min-w-[200px] gap-4 mt-4">
              {countryImages.length > 0 ? ( // Check if there are images to display
                countryImages.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-lg shadow-lg">
                    <img src={image.urls.small} alt={countryName} className="w-full h-auto" />
                  </div>
                ))
              ) : (
                <p>No images available for this country.</p> // Handle no images case
              )}
            </div>
          </div>
        ) : (
          <p>No nationality prediction available</p>
        )}
      </div>

      {/* Right Section - Country Info */}
      <div className="fixed top-60 right-28 w-1/3 h-screen p-4">
        <h2 className="text-3xl font-semibold mb-4 text-navy">Country Info</h2>
        {countryInfo ? (
          <div className="text-black">
            <p><strong>Official Name:</strong> {countryInfo.name.official}</p>
            <p><strong>Capital:</strong> {countryInfo.capital ? countryInfo.capital[0] : "N/A"}</p>
            <p><strong>Region:</strong> {countryInfo.region}</p>
            <p><strong>Subregion:</strong> {countryInfo.subregion}</p>
            <p><strong>Population:</strong> {countryInfo.population.toLocaleString()}</p>
            <p><strong>Area:</strong> {countryInfo.area.toLocaleString()} km²</p>
            <p><strong>Currency:</strong> {Object.keys(countryInfo.currencies)[0]}</p>
            <p><strong>Languages:</strong> {Object.values(countryInfo.languages).join(", ")}</p>
            <h3 className="text-3xl p-20 font-semibold mb-4 text-navy">AI integration coming soon...</h3>
          </div>
        ) : (
          <p>Loading country information...</p>
        )}
      </div>
    </div>
  );
}
