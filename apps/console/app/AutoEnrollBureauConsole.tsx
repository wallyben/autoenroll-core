'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import type { ImportResult } from '@cc/importers-core';

interface ImportState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  result?: ImportResult;
  error?: string;
}

interface BuildState {
  status: 'idle' | 'building' | 'success' | 'error';
  zipPath?: string;
  error?: string;
}

export default function AutoEnrollBureauConsole() {
  const [importState, setImportState] = useState<ImportState>({ status: 'idle' });
  const [buildState, setBuildState] = useState<BuildState>({ status: 'idle' });
  const [selectedSource, setSelectedSource] = useState<'brightpay' | 'sage'>('brightpay');
  const [runId, setRunId] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportState({ status: 'uploading' });
    setBuildState({ status: 'idle' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', selectedSource);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setImportState({ status: 'success', result: data });
      // Generate a run ID for this import
      setRunId(`RUN_${Date.now()}`);
    } catch (error) {
      setImportState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleBuildZip = async () => {
    if (!importState.result || !runId) return;

    setBuildState({ status: 'building' });

    try {
      const response = await fetch('/api/build-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runId,
          employees: importState.result.employees,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Build failed');
      }

      setBuildState({ status: 'success', zipPath: data.zipPath });
    } catch (error) {
      setBuildState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bureau Console
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Irish Auto-Enrolment Management System
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Import Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <Upload className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Import Payroll Data
              </h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payroll Source
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedSource('brightpay')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedSource === 'brightpay'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  BrightPay
                </button>
                <button
                  onClick={() => setSelectedSource('sage')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedSource === 'sage'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sage (Coming Soon)
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CSV File
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">CSV files only</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={importState.status === 'uploading'}
                />
              </label>
            </div>

            {importState.status === 'uploading' && (
              <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-2" />
                <span className="text-blue-600 dark:text-blue-400">Processing file...</span>
              </div>
            )}

            {importState.status === 'error' && (
              <div className="flex items-start p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-red-600 dark:text-red-400 font-medium">Import Failed</p>
                  <p className="text-sm text-red-500 dark:text-red-400">{importState.error}</p>
                </div>
              </div>
            )}

            {importState.status === 'success' && importState.result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md"
              >
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-green-600 dark:text-green-400 font-medium mb-2">
                      Import Successful
                    </p>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>Records imported: {importState.result.recordCount}</p>
                      {importState.result.warnings.length > 0 && (
                        <p className="text-yellow-600">
                          Warnings: {importState.result.warnings.length}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Build ZIP Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-4">
              <Download className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Build Submission
              </h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Run ID
              </label>
              <input
                type="text"
                value={runId}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                placeholder="Import data first to generate Run ID"
              />
            </div>

            <button
              onClick={handleBuildZip}
              disabled={
                !importState.result ||
                importState.status !== 'success' ||
                buildState.status === 'building'
              }
              className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {buildState.status === 'building' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Building ZIP...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Build Submission ZIP
                </>
              )}
            </button>

            {buildState.status === 'error' && (
              <div className="mt-4 flex items-start p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-red-600 dark:text-red-400 font-medium">Build Failed</p>
                  <p className="text-sm text-red-500 dark:text-red-400">{buildState.error}</p>
                </div>
              </div>
            )}

            {buildState.status === 'success' && buildState.zipPath && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md"
              >
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-green-600 dark:text-green-400 font-medium mb-2">
                      ZIP Created Successfully
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 break-all">
                      File: {buildState.zipPath}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructions
              </h3>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>Import your payroll CSV file using the panel on the left</li>
                <li>Review the import summary and any warnings</li>
                <li>Click &ldquo;Build Submission ZIP&rdquo; to create the NAERSA package</li>
                <li>Submit the generated ZIP file to the pension provider</li>
              </ol>
            </div>
          </motion.div>
        </div>

        {/* Summary Stats */}
        {importState.result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Import Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {importState.result.recordCount}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {importState.result.warnings.length}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {importState.result.errors.length}
                </p>
              </div>
            </div>

            {importState.result.warnings.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Warnings:
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {importState.result.warnings.slice(0, 5).map((warning, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                  {importState.result.warnings.length > 5 && (
                    <li className="text-gray-500 italic">
                      ... and {importState.result.warnings.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
