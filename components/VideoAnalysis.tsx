import React, { useState, useRef } from 'react';
import { VideoAnalysis as VideoAnalysisType, CrowdAnalysisResult, CrowdCategory, GenderCount } from '../types';
import { getVideoAnalysis } from '../services/geminiService';

const VideoAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CrowdAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setAnalysisResult(null);
    } else {
      alert('Please select a valid video file.');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      console.log('Starting analysis for file:', selectedFile.name);
      const result = await getVideoAnalysis(selectedFile);
      console.log('Analysis result:', result);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCategoryColor = (category: CrowdCategory) => {
    switch (category) {
      case CrowdCategory.GOOD:
        return 'text-green-400 bg-green-400/10 border-green-400/50';
      case CrowdCategory.AVERAGE:
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/50';
      case CrowdCategory.HIGH:
        return 'text-red-400 bg-red-400/10 border-red-400/50';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/50';
    }
  };

  const getCategoryDescription = (category: CrowdCategory) => {
    switch (category) {
      case CrowdCategory.GOOD:
        return 'Good (4-5 people)';
      case CrowdCategory.AVERAGE:
        return 'Average (5-25 people)';
      case CrowdCategory.HIGH:
        return 'High (>25 people)';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <i className="fas fa-video text-blue-400"></i>
        Video Analysis
      </h3>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <i className="fas fa-upload"></i>
              Choose Video
            </button>
            {selectedFile && (
              <span className="text-slate-300 text-sm">{selectedFile.name}</span>
            )}
          </div>

          {videoUrl && (
            <div className="bg-slate-800 rounded-lg p-4">
              <video
                src={videoUrl}
                controls
                className="w-full max-h-64 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Analyzing...
              </>
            ) : (
              <>
                <i className="fas fa-play"></i>
                Analyze Video
              </>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
            <h4 className="text-md font-semibold text-white mb-4">Analysis Results</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total People */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">{analysisResult.totalPeople}</div>
                <div className="text-sm text-slate-400">Total People</div>
              </div>

              {/* Crowd Category */}
              <div className={`p-4 rounded-lg border ${getCategoryColor(analysisResult.category)}`}>
                <div className="text-lg font-bold">{getCategoryDescription(analysisResult.category)}</div>
                <div className="text-sm opacity-80">Crowd Situation</div>
              </div>

              {/* Gender Breakdown */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">Boys:</span>
                  <span className="text-lg font-bold text-blue-400">{analysisResult.genderBreakdown.boys}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Girls:</span>
                  <span className="text-lg font-bold text-pink-400">{analysisResult.genderBreakdown.girls}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 mt-4">
              Analyzed at: {new Date(analysisResult.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalysis;
