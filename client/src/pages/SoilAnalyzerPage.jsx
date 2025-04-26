// client/src/pages/SoilAnalyzerPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SoilAnalyzerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ph: 7.0,
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    moisture: 50,
    temperature: 25,
    humidity: 60,
    rainfall: 100,
    soilType: 'loam',
    cropType: '',
    fieldSize: 1,
    organicMatter: 3
  });

  const [loading, setLoading] = useState(false);
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const [presets, setPresets] = useState([]);
      const [savedPresets, setSavedPresets] = useState([]);
      const [presetName, setPresetName] = useState('');
      const [comparisonMode, setComparisonMode] = useState(false);
      const [comparisonData, setComparisonData] = useState(null);
      const [showAdvanced, setShowAdvanced] = useState(false);
      const [soilHealth, setSoilHealth] = useState(null);
      
      // Load saved presets from localStorage on component mount
      useEffect(() => {
          const loadedPresets = localStorage.getItem('soilPresets');
          if (loadedPresets) {
              setSavedPresets(JSON.parse(loadedPresets));
          }
          
          // Define common soil types as presets
          setPresets([
              { name: 'Clay Soil', data: { ph: 6.5, nitrogen: 40, phosphorus: 30, potassium: 60, moisture: 70, soilType: 'clay' } },
              { name: 'Sandy Soil', data: { ph: 5.8, nitrogen: 20, phosphorus: 15, potassium: 25, moisture: 30, soilType: 'sandy' } },
              { name: 'Loamy Soil', data: { ph: 6.8, nitrogen: 55, phosphorus: 45, potassium: 50, moisture: 55, soilType: 'loam' } },
              { name: 'Chalky Soil', data: { ph: 7.8, nitrogen: 30, phosphorus: 25, potassium: 30, moisture: 40, soilType: 'chalky' } },
          ]);
      }, []);
      
      const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({
              ...prev,
              [name]: name === 'soilType' || name === 'cropType' ? value : parseFloat(value)
          }));
      };
      
      const handlePresetLoad = (preset) => {
          setFormData(prev => ({
              ...prev,
              ...preset.data
          }));
      };
      
      const savePreset = () => {
          if (!presetName.trim()) {
              setError("Please enter a preset name");
              return;
          }
          
          const newPreset = {
              name: presetName,
              data: { ...formData },
              date: new Date().toISOString()
          };
          
          const updatedPresets = [...savedPresets, newPreset];
          setSavedPresets(updatedPresets);
          localStorage.setItem('soilPresets', JSON.stringify(updatedPresets));
          setPresetName('');
      };
      
      const deletePreset = (index) => {
          const updatedPresets = savedPresets.filter((_, i) => i !== index);
          setSavedPresets(updatedPresets);
          localStorage.setItem('soilPresets', JSON.stringify(updatedPresets));
      };
      
      const toggleComparisonMode = () => {
          if (comparisonMode && result) {
              setComparisonData(null);
          } else if (result) {
              setComparisonData({ ...result, params: { ...formData } });
          }
          setComparisonMode(!comparisonMode);
      };
      
      const resetForm = () => {
          setFormData({
              ph: 7.0,
              nitrogen: 50,
              phosphorus: 50,
              potassium: 50,
              moisture: 50,
              temperature: 25,
              humidity: 60,
              rainfall: 100,
              soilType: 'loam',
              cropType: '',
              fieldSize: 1,
              organicMatter: 3
          });
          setResult(null);
      };
      
      // Enhanced analysis with more advanced logic
      const mockAnalysisResponse = (params) => {
          console.log("Using enhanced mock analysis with params:", params);
          
          // Soil health index calculation (0-100)
          const calculateSoilHealth = () => {
              let health = 0;
              
              // pH factor (optimal range 6.0-7.0)
              const phFactor = params.ph >= 6.0 && params.ph <= 7.0 ? 20 : 
                              params.ph > 5.0 && params.ph < 8.0 ? 15 :
                              params.ph > 4.0 && params.ph < 9.0 ? 10 : 5;
                              
              // NPK balance factor
              const npkBalance = Math.min(params.nitrogen, params.phosphorus, params.potassium) / 
                              Math.max(params.nitrogen, params.phosphorus, params.potassium);
              const npkFactor = npkBalance > 0.7 ? 25 : 
                              npkBalance > 0.5 ? 20 :
                              npkBalance > 0.3 ? 15 : 10;
              
              // Moisture factor
              const moistureFactor = params.moisture >= 40 && params.moisture <= 70 ? 15 :
                                  params.moisture >= 30 && params.moisture <= 80 ? 10 : 5;
                                  
              // Organic matter factor
              const organicFactor = params.organicMatter >= 3 ? 20 :
                                  params.organicMatter >= 2 ? 15 :
                                  params.organicMatter >= 1 ? 10 : 5;
                                  
              // Temperature factor
              const tempFactor = params.temperature >= 15 && params.temperature <= 30 ? 10 :
                              params.temperature >= 10 && params.temperature <= 35 ? 7 : 4;
                              
              // Calculate total health
              health = phFactor + npkFactor + moistureFactor + organicFactor + tempFactor;
              return {
                  score: health,
                  category: health >= 80 ? "Excellent" :
                          health >= 60 ? "Good" :
                          health >= 40 ? "Fair" : "Poor",
                  factors: {
                      ph: phFactor,
                      npk: npkFactor,
                      moisture: moistureFactor,
                      organicMatter: organicFactor,
                      temperature: tempFactor
                  }
              };
          };
          
          // Calculate soil health
          const soilHealthData = calculateSoilHealth();
          setSoilHealth(soilHealthData);
          
          // More sophisticated crop recommendations based on all parameters
          // Including soil type and specific crop requirements
          let recommendedCrops = [];
          
          // Specific crop recommendations by soil type
          const soilTypeCrops = {
              'clay': ['Wheat', 'Cabbage', 'Broccoli', 'Beans', 'Rice'],
              'sandy': ['Carrots', 'Potatoes', 'Lettuce', 'Strawberries', 'Melons'],
              'loam': ['Corn', 'Tomatoes', 'Peppers', 'Cucumbers', 'Squash'],
              'chalky': ['Spinach', 'Beets', 'Kohlrabi', 'Cauliflower', 'Sweet corn'],
              'silty': ['Leafy greens', 'Pumpkins', 'Legumes', 'Roses', 'Zucchini'],
              'peat': ['Blueberries', 'Cranberries', 'Rhododendrons', 'Azaleas', 'Heathers']
          };
          
          // Add soil type specific recommendations
          if (params.soilType && soilTypeCrops[params.soilType]) {
              recommendedCrops = [...recommendedCrops, ...soilTypeCrops[params.soilType]];
          }
          
          // pH based recommendations
          if (params.ph < 5.5) {
              recommendedCrops.push('Blueberries', 'Potatoes', 'Radishes');
          } else if (params.ph >= 5.5 && params.ph < 6.5) {
              recommendedCrops.push('Corn', 'Tomatoes', 'Carrots', 'Cucumbers');
          } else if (params.ph >= 6.5 && params.ph < 7.5) {
              recommendedCrops.push('Wheat', 'Barley', 'Spinach', 'Lettuce', 'Cabbage');
          } else {
              recommendedCrops.push('Asparagus', 'Beets', 'Cauliflower', 'Okra');
          }
          
          // Nutrient level based recommendations
          const npkTotal = params.nitrogen + params.phosphorus + params.potassium;
          if (npkTotal < 100) {
              recommendedCrops.push('Legumes', 'Beans', 'Peas'); // Low nutrient tolerant
          } else if (npkTotal > 200) {
              recommendedCrops.push('Corn', 'Tomatoes', 'Peppers'); // High nutrient demanding
          }
          
          // Climate condition based recommendations (temperature, humidity, rainfall)
          if (params.temperature < 20 && params.rainfall > 150) {
              recommendedCrops.push('Kale', 'Brussels Sprouts', 'Chard');
          } else if (params.temperature > 30 && params.rainfall < 100) {
              recommendedCrops.push('Okra', 'Peppers', 'Eggplant', 'Watermelon');
          }
          
          // Make sure list is unique
          recommendedCrops = [...new Set(recommendedCrops)];
          
          // Limit to 8 crops
          recommendedCrops = recommendedCrops.slice(0, 8);
          
          // Calculate expected yield for recommended crops
          const cropYields = recommendedCrops.map(crop => {
              // Base yield in tons per hectare
              let baseYield = 0;
              
              switch(crop) {
                  case 'Corn': baseYield = 7.5; break;
                  case 'Wheat': baseYield = 3.0; break;
                  case 'Rice': baseYield = 4.5; break;
                  case 'Potatoes': baseYield = 20.0; break;
                  case 'Tomatoes': baseYield = 35.0; break;
                  case 'Cabbage': baseYield = 30.0; break;
                  case 'Carrots': baseYield = 25.0; break;
                  // Default for other crops
                  default: baseYield = 5.0;
              }
              
              // Adjustment factors based on soil health
              const healthFactor = soilHealthData.score / 100;
              const soilTypeFactor = params.soilType === 'loam' ? 1.2 : 
                                  params.soilType === 'clay' ? 0.9 :
                                  params.soilType === 'sandy' ? 0.8 : 1.0;
                                  
              // Calculate expected yield
              const adjustedYield = baseYield * healthFactor * soilTypeFactor * params.fieldSize;
              
              return {
                  crop,
                  baseYield,
                  expectedYield: adjustedYield.toFixed(2),
                  unit: 'tons'
              };
          });
          
          // Enhanced fertilizer recommendation
          const fertilizers = [
              {
                  name: "Balanced NPK (10-10-10)",
                  description: "General-purpose fertilizer suitable for most crops.",
                  applicationRate: "2-3 kg per 100 square meters",
                  bestFor: ["medium nitrogen", "medium phosphorus", "medium potassium"],
                  cost: "Medium"
              },
              {
                  name: "High-Nitrogen (24-8-8)",
                  description: "Enriched with nitrogen to promote leaf and stem growth.",
                  applicationRate: "1.5-2 kg per 100 square meters",
                  bestFor: ["low nitrogen", "leafy vegetables"],
                  cost: "Medium-High"
              },
              {
                  name: "Phosphate-Rich (8-24-8)",
                  description: "Promotes strong root development and flowering.",
                  applicationRate: "2-2.5 kg per 100 square meters", 
                  bestFor: ["low phosphorus", "flowering plants", "root crops"],
                  cost: "Medium-High"
              },
              {
                  name: "Potassium-Enhanced (8-8-24)",
                  description: "Improves overall plant health and disease resistance.",
                  applicationRate: "2-2.5 kg per 100 square meters",
                  bestFor: ["low potassium", "fruit crops"],
                  cost: "Medium-High"
              },
              {
                  name: "Organic Compost",
                  description: "Improves soil structure and provides slow-release nutrients.",
                  applicationRate: "5-10 kg per 100 square meters",
                  bestFor: ["low organic matter", "organic farming"],
                  cost: "Low-Medium"
              }
          ];
          
          // Select appropriate fertilizer based on soil analysis
          let selectedFertilizer;
          
          if (params.organicMatter < 2) {
              selectedFertilizer = fertilizers[4]; // Organic compost
          } else if (params.nitrogen < 30) {
              selectedFertilizer = fertilizers[1]; // High-Nitrogen
          } else if (params.phosphorus < 30) {
              selectedFertilizer = fertilizers[2]; // Phosphate-Rich
          } else if (params.potassium < 30) {
              selectedFertilizer = fertilizers[3]; // Potassium-Enhanced
          } else {
              selectedFertilizer = fertilizers[0]; // Balanced NPK
          }
          
          // Calculate total fertilizer needed
          const totalFertilizerNeeded = Math.round(params.fieldSize * 100 * 2.5); // in kg
          selectedFertilizer.totalNeeded = totalFertilizerNeeded;
          
          // Secondary (complementary) fertilizer recommendation
          let secondaryFertilizer = null;
          
          // If soil is particularly deficient in multiple nutrients
          if (params.nitrogen < 30 && params.phosphorus < 30) {
              secondaryFertilizer = fertilizers[0]; // Balanced NPK as secondary
          } else if (params.organicMatter < 3 && selectedFertilizer !== fertilizers[4]) {
              secondaryFertilizer = fertilizers[4]; // Organic compost as secondary
          }
          
          // Generate tips based on comprehensive analysis
          const tips = [
              "Rotate crops annually to prevent soil nutrient depletion.",
              "Consider using cover crops during off-seasons to improve soil health.",
          ];
          
          // Soil pH adjustment tips
          if (params.ph < 6.0) {
              tips.push("Add agricultural lime at a rate of 50-100g per square meter to increase soil pH.");
          } else if (params.ph > 7.5) {
              tips.push("Consider adding sulfur (15-25g per square meter) or organic matter to reduce soil pH.");
          }
          
          // Moisture management tips
          if (params.moisture < 40) {
              tips.push("Implement drip irrigation to maintain consistent soil moisture without wasting water.");
              tips.push("Apply mulch to reduce evaporation and maintain soil moisture.");
          } else if (params.moisture > 70) {
              tips.push("Improve drainage by creating raised beds or adding organic matter to prevent waterlogging.");
              tips.push("Consider installing drainage tiles if persistent waterlogging is an issue.");
          }
          
          // Specific crop selection advice
          if (params.cropType) {
              const cropSpecificTips = {
                  'corn': "Plant corn when soil temperature reaches 16°C for optimal germination.",
                  'tomatoes': "Support tomato plants with stakes or cages and prune suckers for better airflow.",
                  'potatoes': "Hill soil around potato plants as they grow to prevent green potatoes.",
                  'wheat': "Plant winter wheat in fall for harvest in early summer.",
                  'rice': "Maintain consistent water levels for rice production.",
                  'lettuce': "Harvest lettuce in the morning for best flavor and texture."
              };
              
              if (cropSpecificTips[params.cropType.toLowerCase()]) {
                  tips.push(cropSpecificTips[params.cropType.toLowerCase()]);
              }
          }
          
          // Seasonal considerations
          const currentMonth = new Date().getMonth();
          // Spring
          if (currentMonth >= 2 && currentMonth <= 4) {
              tips.push("Spring is ideal for soil preparation and planting of most crops.");
          } 
          // Summer
          else if (currentMonth >= 5 && currentMonth <= 7) {
              tips.push("During summer heat, provide adequate irrigation and consider shade cloth for sensitive crops.");
          }
          // Fall
          else if (currentMonth >= 8 && currentMonth <= 10) {
              tips.push("Fall is perfect for planting cover crops and preparing soil for next season.");
          }
          // Winter
          else {
              tips.push("Consider using row covers or cold frames to extend your growing season.");
          }
          
          // Calculate soil amendment recommendations
          const soilAmendments = [];
          
          if (params.organicMatter < 3) {
              soilAmendments.push({
                  name: "Compost",
                  amount: `${params.fieldSize * 500} kg`,
                  purpose: "Increase organic matter and improve soil structure"
              });
          }
          
          if (params.ph < 6.0) {
              soilAmendments.push({
                  name: "Agricultural Lime",
                  amount: `${params.fieldSize * 50} kg`,
                  purpose: "Raise soil pH"
              });
          }
          
          if (params.ph > 7.5) {
              soilAmendments.push({
                  name: "Elemental Sulfur",
                  amount: `${params.fieldSize * 15} kg`,
                  purpose: "Lower soil pH"
              });
          }
          
          // Water management recommendations
          const waterRecommendation = {
              frequency: params.moisture < 30 ? "Daily" : 
                        params.moisture < 50 ? "Every 2-3 days" : 
                        params.moisture < 70 ? "Weekly" : "As needed, monitor for drainage issues",
              amountPerWeek: params.moisture < 30 ? `${Math.round(params.fieldSize * 25)} liters` :
                            params.moisture < 50 ? `${Math.round(params.fieldSize * 15)} liters` :
                            params.moisture < 70 ? `${Math.round(params.fieldSize * 10)} liters` : "Minimal, focus on drainage",
              method: params.moisture < 50 ? "Drip irrigation recommended" : "Standard irrigation",
              notes: params.rainfall > 150 ? "Consider rainwater harvesting system" : 
                    params.rainfall < 50 ? "Drought-resistant crops recommended" : "Standard watering practices"
          };
          
          return {
              recommendedCrops,
              cropYields,
              fertilizer: selectedFertilizer,
              secondaryFertilizer,
              additionalTips: tips,
              soilHealth: soilHealthData,
              soilAmendments,
              waterRecommendation
          };
      };
      
      const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          
          try {
              // Use our enhanced mock response
              const mockResponse = mockAnalysisResponse(formData);
              setResult(mockResponse);
              
              // Comment out the actual API call for now to ensure we're using the mock data
              // If you want to try the API again later, you can uncomment this section
              /*
              const token = localStorage.getItem('token');
              const res = await axios.post(
                  'http://localhost:5000/api/suggestions/analyze',
                  formData,
                  { headers: { Authorization: `Bearer ${token}` } }
              );
              
              setResult(res.data);
              */
          } catch (err) {
              setError(err.response?.data?.message || 'An error occurred while analyzing soil data');
          } finally {
              setLoading(false);
          }
      };
      
      // Calculate soil health visualization color
      const getHealthColor = (score) => {
          if (score >= 80) return 'bg-green-500';
          if (score >= 60) return 'bg-green-300';
          if (score >= 40) return 'bg-yellow-400';
          return 'bg-red-400';
      };
      
      return (
          <div className="max-w-6xl mx-auto text-gray-900">
              <h2 className="text-2xl font-bold mb-6">Advanced Soil Analyzer</h2>
              
              {error && (
                  <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
                      {error}
                  </div>
              )}
              
              <div className="mb-6 flex flex-wrap gap-2">
                  <button 
                      onClick={resetForm} 
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                  >
                      Reset Form
                  </button>
                  
                  <button 
                      onClick={() => setShowAdvanced(!showAdvanced)} 
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md"
                  >
                      {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                  </button>
                  
                  {result && (
                      <button 
                          onClick={toggleComparisonMode} 
                          className={`${comparisonMode ? 'bg-purple-600' : 'bg-purple-200'} ${comparisonMode ? 'text-white' : 'text-purple-700'} px-4 py-2 rounded-md`}
                      >
                          {comparisonMode ? 'Exit Comparison Mode' : 'Compare Results'}
                      </button>
                  )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className={`${comparisonMode ? 'md:col-span-2' : 'md:col-span-3'}`}>
                      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg shadow">
                          <h3 className="text-lg font-semibold mb-4">Soil Parameters</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                  <label className="block text-gray-700 mb-1">pH Level</label>
                                  <input
                                      type="range"
                                      name="ph"
                                      min="0"
                                      max="14"
                                      step="0.1"
                                      value={formData.ph}
                                      onChange={handleChange}
                                      className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-gray-500">
                                      <span>Acidic (0)</span>
                                      <span>{formData.ph}</span>
                                      <span>Alkaline (14)</span>
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-gray-700 mb-1">Nitrogen (N)</label>
                                  <input
                                      type="range"
                                      name="nitrogen"
                                      min="0"
                                      max="100"
                                      value={formData.nitrogen}
                                      onChange={handleChange}
                                      className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-gray-500">
                                      <span>Low</span>
                                      <span>{formData.nitrogen} ppm</span>
                                      <span>High</span>
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-gray-700 mb-1">Phosphorus (P)</label>
                                  <input
                                      type="range"
                                      name="phosphorus"
                                      min="0"
                                      max="100"
                                      value={formData.phosphorus}
                                      onChange={handleChange}
                                      className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-gray-500">
                                      <span>Low</span>
                                      <span>{formData.phosphorus} ppm</span>
                                      <span>High</span>
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-gray-700 mb-1">Potassium (K)</label>
                                  <input
                                      type="range"
                                      name="potassium"
                                      min="0"
                                      max="100"
                                      value={formData.potassium}
                                      onChange={handleChange}
                                      className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-gray-500">
                                      <span>Low</span>
                                      <span>{formData.potassium} ppm</span>
                                      <span>High</span>
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-gray-700 mb-1">Soil Moisture</label>
                                  <input
                                      type="range"
                                      name="moisture"
                                      min="0"
                                      max="100"
                                      value={formData.moisture}
                                      onChange={handleChange}
                                      className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-gray-500">
                                      <span>Dry</span>
                                      <span>{formData.moisture}%</span>
                                      <span>Wet</span>
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-gray-700 mb-1">Temperature</label>
                                  <input
                                      type="range"
                                      name="temperature"
                                      min="0"
                                      max="50"
                                      value={formData.temperature}
                                      onChange={handleChange}
                                      className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-gray-500">
                                      <span>Cold</span>
                                      <span>{formData.temperature}°C</span>
                                      <span>Hot</span>
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-gray-700 mb-1">Humidity</label>
                                  <input
                                      type="range"
                                      name="humidity"
                                      min="0"
                                      max="100"
                                      value={formData.humidity}
                                      onChange={handleChange}
                                      className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-gray-500">
                                      <span>Dry</span>
                                      <span>{formData.humidity}%</span>
                                      <span>Humid</span>
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-gray-700 mb-1">Rainfall</label>
                                  <input
                                      type="range"
                                      name="rainfall"
                                      min="0"
                                      max="300"
                                      value={formData.rainfall}
                                      onChange={handleChange}
                                      className="w-full"
                                  />
                                  <div className="flex justify-between text-sm text-gray-500">
                                      <span>Low</span>
                                      <span>{formData.rainfall} mm</span>
                                      <span>High</span>
                                  </div>
                              </div>
                              
                              <div>
                                  <label className="block text-gray-700 mb-1">Soil Type</label>
                                  <select
                                      name="soilType"
                                      value={formData.soilType}
                                      onChange={handleChange}
                                      className="w-full p-2 border rounded-md"
                                  >
                                      <option value="clay">Clay</option>
                                      <option value="sandy">Sandy</option>
                                      <option value="loam">Loam</option>
                                      <option value="chalky">Chalky</option>
                                      <option value="silty">Silty</option>
                                      <option value="peat">Peat</option>
                                  </select>
                              </div>
                              
                              <div>
                                  <label className="block text-gray-700 mb-1">Field Size (hectares)</label>
                                  <input
                                      type="number"
                                      name="fieldSize"
                                      min="0.1"
                                      step="0.1"
                                      value={formData.fieldSize}
                                      onChange={handleChange}
                                      className="w-full p-2 border rounded-md"
                                  />
                              </div>
                          </div>
                          
                          {showAdvanced && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                  <h4 className="font-medium mb-3">Advanced Parameters</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-gray-700 mb-1">Organic Matter (%)</label>
                                          <input
                                              type="range"
                                              name="organicMatter"
                                              min="0"
                                              max="10"
                                              step="0.1"
                                              value={formData.organicMatter}
                                              onChange={handleChange}
                                              className="w-full"
                                          />
                                          <div className="flex justify-between text-sm text-gray-500">
                                              <span>Low</span>
                                              <span>{formData.organicMatter}%</span>
                                              <span>High</span>
                                          </div>
                                      </div>
                                      
                                      <div>
                                      <label className="block text-gray-700 mb-1">Specific Crop (optional)</label>
                                          <input
                                              type="text"
                                              name="cropType"
                                              placeholder="e.g. corn, tomatoes, wheat"
                                              value={formData.cropType}
                                              onChange={handleChange}
                                              className="w-full p-2 border rounded-md"
                                          />
                                      </div>
                                  </div>
                              </div>
                          )}
                          
                          <div className="mt-6">
                              <button
                                  type="submit"
                                  className="bg-green-700 text-white px-6 py-2 rounded-md mr-3"
                                  disabled={loading}
                              >
                                  {loading ? 'Analyzing...' : 'Analyze Soil'}
                              </button>
                          </div>
                      </form>
                      
                      <div className="mb-6 bg-white p-4 rounded-lg shadow">
                          <h3 className="text-lg font-semibold mb-3">Presets</h3>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                              {presets.map((preset, idx) => (
                                  <button
                                      key={idx}
                                      onClick={() => handlePresetLoad(preset)}
                                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm"
                                  >
                                      {preset.name}
                                  </button>
                              ))}
                          </div>
                          
                          <div className="mt-4">
                              <h4 className="font-medium mb-2">Saved Presets</h4>
                              
                              {savedPresets.length > 0 ? (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                      {savedPresets.map((preset, idx) => (
                                          <div key={idx} className="flex items-center">
                                              <button
                                                  onClick={() => handlePresetLoad(preset)}
                                                  className="bg-green-100 text-green-800 px-3 py-1 rounded-l-md text-sm"
                                              >
                                                  {preset.name}
                                              </button>
                                              <button
                                                  onClick={() => deletePreset(idx)}
                                                  className="bg-red-100 text-red-800 px-2 py-1 rounded-r-md text-sm"
                                              >
                                                  ×
                                              </button>
                                          </div>
                                      ))}
                                  </div>
                              ) : (
                                  <p className="text-sm text-gray-500 mb-3">No saved presets</p>
                              )}
                              
                              <div className="flex">
                                  <input
                                      type="text"
                                      value={presetName}
                                      onChange={(e) => setPresetName(e.target.value)}
                                      placeholder="Preset name"
                                      className="p-2 border rounded-l-md flex-1"
                                  />
                                  <button
                                      onClick={savePreset}
                                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
                                  >
                                      Save Current
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  {/* Sidebar for comparison mode */}
                  {comparisonMode && comparisonData && (
                      <div className="md:col-span-2 bg-purple-50 p-4 rounded-lg shadow mb-6">
                          <h3 className="text-lg font-bold mb-2 text-purple-800">Previous Results</h3>
                          <div className="text-sm mb-4 p-2 bg-purple-100 rounded">
                              <p><span className="font-medium">pH:</span> {comparisonData.params.ph}</p>
                              <p><span className="font-medium">N-P-K:</span> {comparisonData.params.nitrogen}-{comparisonData.params.phosphorus}-{comparisonData.params.potassium}</p>
                              <p><span className="font-medium">Moisture:</span> {comparisonData.params.moisture}%</p>
                              <p><span className="font-medium">Soil Type:</span> {comparisonData.params.soilType}</p>
                          </div>
                          
                          <div className="mb-4">
                              <h4 className="font-bold text-purple-700 mb-2">Soil Health Score</h4>
                              <div className="flex items-center mb-2">
                                  <div className={`h-4 rounded-full w-full ${getHealthColor(comparisonData.soilHealth.score)}`}>
                                      <div className="relative -top-6 text-center text-sm font-bold">
                                          {comparisonData.soilHealth.score}/100 - {comparisonData.soilHealth.category}
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="mb-4">
                              <h4 className="font-bold text-purple-700 mb-2">Recommended Crops</h4>
                              <div className="flex flex-wrap gap-2">
                                  {comparisonData.recommendedCrops.map((crop, index) => (
                                      <span key={index} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                                          {crop}
                                      </span>
                                  ))}
                              </div>
                          </div>
                          
                          <div className="mb-4">
                              <h4 className="font-bold text-purple-700 mb-2">Fertilizer</h4>
                              <p className="font-medium">{comparisonData.fertilizer.name}</p>
                          </div>
                      </div>
                  )}
              </div>
              
              {/* Results section */}
              {result && (
                  <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Comprehensive Soil Analysis Results</h3>
                      
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                          <h4 className="font-bold text-blue-800 mb-3">Soil Health Assessment</h4>
                          <div className="flex items-center mb-4">
                              <div className={`h-6 rounded-full w-full ${getHealthColor(soilHealth.score)}`}>
                                  <div className="relative -top-6 text-center font-bold">
                                      {soilHealth.score}/100 - {soilHealth.category}
                                  </div>
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                              <div className="bg-white p-2 rounded text-center">
                                  <div className="text-lg font-bold">{soilHealth.factors.ph}/20</div>
                                  <div className="text-xs">pH Balance</div>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                  <div className="text-lg font-bold">{soilHealth.factors.npk}/25</div>
                                  <div className="text-xs">NPK Balance</div>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                  <div className="text-lg font-bold">{soilHealth.factors.moisture}/15</div>
                                  <div className="text-xs">Moisture</div>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                  <div className="text-lg font-bold">{soilHealth.factors.organicMatter}/20</div>
                                  <div className="text-xs">Organic Matter</div>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                  <div className="text-lg font-bold">{soilHealth.factors.temperature}/10</div>
                                  <div className="text-xs">Temperature</div>
                              </div>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-bold text-green-800 mb-3">Recommended Crops</h4>
                              <div className="flex flex-wrap gap-2 mb-4">
                                  {result.recommendedCrops.map((crop, index) => (
                                      <span 
                                          key={index}
                                          className="bg-green-200 text-green-800 px-3 py-1 rounded-full"
                                      >
                                          {crop}
                                      </span>
                                  ))}
                              </div>
                              
                              <h5 className="font-semibold text-green-700 mt-4 mb-2">Estimated Yields</h5>
                              <div className="overflow-x-auto">
                                  <table className="min-w-full bg-white rounded">
                                      <thead className="bg-green-100">
                                          <tr>
                                              <th className="py-2 px-3 text-left">Crop</th>
                                              <th className="py-2 px-3 text-right">Expected Yield</th>
                                              <th className="py-2 px-3 text-right">Unit</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {result.cropYields.map((item, idx) => (
                                              <tr key={idx} className={idx % 2 === 0 ? 'bg-green-50' : 'bg-white'}>
                                                  <td className="py-2 px-3">{item.crop}</td>
                                                  <td className="py-2 px-3 text-right">{item.expectedYield}</td>
                                                  <td className="py-2 px-3 text-right">{item.unit}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-bold text-blue-800 mb-3">Fertilizer Recommendations</h4>
                              <div className="bg-white p-3 rounded mb-3">
                                  <h5 className="font-medium text-lg">{result.fertilizer.name}</h5>
                                  <p className="text-gray-700 mb-2">{result.fertilizer.description}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                                      <div>
                                          <p className="text-sm">
                                              <strong>Application Rate:</strong> {result.fertilizer.applicationRate}
                                          </p>
                                          <p className="text-sm">
                                              <strong>Best For:</strong> {result.fertilizer.bestFor.join(', ')}
                                          </p>
                                      </div>
                                      <div>
                                          <p className="text-sm">
                                              <strong>Cost Level:</strong> {result.fertilizer.cost}
                                          </p>
                                          <p className="text-sm">
                                              <strong>Total Needed:</strong> {result.fertilizer.totalNeeded}kg
                                          </p>
                                      </div>
                                  </div>
                              </div>
                              
                              {result.secondaryFertilizer && (
                                  <div className="bg-white p-3 rounded mb-3">
                                      <h5 className="font-medium">Secondary: {result.secondaryFertilizer.name}</h5>
                                      <p className="text-gray-700 text-sm">{result.secondaryFertilizer.description}</p>
                                  </div>
                              )}
                              
                              <h5 className="font-semibold text-blue-700 mt-4 mb-2">Soil Amendments</h5>
                              {result.soilAmendments.length > 0 ? (
                                  <div className="space-y-2">
                                      {result.soilAmendments.map((amendment, idx) => (
                                          <div key={idx} className="bg-white p-2 rounded">
                                              <div className="font-medium">{amendment.name}</div>
                                              <div className="text-sm">Amount: {amendment.amount}</div>
                                              <div className="text-sm text-gray-600">{amendment.purpose}</div>
                                          </div>
                                      ))}
                                  </div>
                              ) : (
                                  <p className="text-sm italic">No additional amendments needed</p>
                              )}
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <div className="bg-yellow-50 p-4 rounded-lg">
                              <h4 className="font-bold text-yellow-800 mb-3">Additional Tips</h4>
                              <ul className="list-disc list-inside space-y-2">
                                  {result.additionalTips.map((tip, index) => (
                                      <li key={index} className="text-gray-800">{tip}</li>
                                  ))}
                              </ul>
                          </div>
                          
                          <div className="bg-indigo-50 p-4 rounded-lg">
                              <h4 className="font-bold text-indigo-800 mb-3">Water Management</h4>
                              <div className="bg-white p-3 rounded">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      <div>
                                          <p><span className="font-medium">Frequency:</span> {result.waterRecommendation.frequency}</p>
                                          <p><span className="font-medium">Amount per Week:</span> {result.waterRecommendation.amountPerWeek}</p>
                                      </div>
                                      <div>
                                          <p><span className="font-medium">Method:</span> {result.waterRecommendation.method}</p>
                                          <p><span className="font-medium">Notes:</span> {result.waterRecommendation.notes}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };
  
  export default SoilAnalyzerPage;