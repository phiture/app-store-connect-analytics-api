'use client';

import React, {FormEvent, useState} from 'react';
import axios from 'axios';
import {ArrowTopRightOnSquareIcon, CheckIcon} from "@heroicons/react/20/solid";
import generateAscToken from "@/components/GenerateAscToken";
import {DocumentDuplicateIcon} from "@heroicons/react/24/solid";
import {Switch} from "@headlessui/react";

const Home: React.FC = () => {
    const [appId, setAppId] = useState<string>('');
    const [accessType, setAccessType] = useState<'ONGOING' | 'ONE_TIME_SNAPSHOT'>('ONGOING');
    const [issuerId, setIssuerId] = useState<string>('');
    const [keyId, setKeyId] = useState<string>('');
    const [keyContents, setKeyContents] = useState<string>('');
    const [response, setResponse] = useState<any>(null);
    const [curlResponse, setCurlResponse] = useState<any>(null);
    const [showCurl, setShowCurl] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (showCurl) {
            const curlCommand = await generateCurlCommand(issuerId, keyId, keyContents, appId, accessType);
            setCurlResponse(curlCommand);
        } else {
            try {
                const resp = await axios.post('/api/request', {
                    appId,
                    accessType,
                    issuerId,
                    keyId,
                    keyContents
                });
                setResponse(resp.data);
            } catch (error) {
                console.error("Error making the request:", error);
                if (error instanceof Error) {
                    setResponse(error.message);
                } else {
                    setResponse("An unknown error occurred");
                }
            }
        }
    };

    const generateCurlCommand = async (issuerId: string, keyId: string, privateKey: string, appId: string, accessType: string) => {
        const token = await generateAscToken(issuerId, keyId, privateKey);
        return `curl -X POST https://api.appstoreconnect.apple.com/v1/analyticsReportRequests \\
-H "Authorization: Bearer ${token}" \\
-H "Content-Type: application/json" \\
-d '{
  "data": {
    "type": "analyticsReportRequests",
    "attributes": {
      "accessType": "${accessType}"
    },
    "relationships": {
      "app": {
        "data": {
          "type": "apps",
          "id": "${appId}"
        }
      }
    }
  }
}'`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">App Store Connect</h1>
                <p className="text-center">Enable your analytics reports utilizing the App Store Connect API</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">App ID:</label>
                        <input
                            type="text"
                            value={appId}
                            onChange={(e) => setAppId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Access Type:</label>
                        <select
                            value={accessType}
                            onChange={(e) => setAccessType(e.target.value as 'ONGOING' | 'ONE_TIME_SNAPSHOT')}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="ONGOING">ONGOING</option>
                            <option value="ONE_TIME_SNAPSHOT">ONE TIME SNAPSHOT</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issuer ID:</label>
                        <input
                            type="text"
                            value={issuerId}
                            onChange={(e) => setIssuerId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key ID:</label>
                        <input
                            type="text"
                            value={keyId}
                            onChange={(e) => setKeyId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key Contents:</label>
                        <textarea
                            value={keyContents}
                            onChange={(e) => setKeyContents(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex items-center">
                        <Switch
                            checked={showCurl}
                            onChange={setShowCurl}
                            className={`${showCurl ? 'bg-indigo-600' : 'bg-gray-200'}
      relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out`}
                        >
                            <span className="sr-only">Show cURL Command, do NOT send any request</span>
                            <span
                                className={`${showCurl ? 'translate-x-6' : 'translate-x-1'}
        inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                            />
                        </Switch>
                        <span className="ml-2 text-sm text-gray-900 dark:text-gray-300">Show cURL Command, do NOT send any request</span>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </form>
                {response && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-2">Response:</h2>
                        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-black dark:text-white whitespace-pre-wrap break-words">
                            <code>{JSON.stringify(response, null, 2)}</code>
                        </pre>
                    </div>
                )}
                {curlResponse && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-2">
                            Curl command:
                        </h2>
                        <div className="relative">
                            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-black dark:text-white whitespace-pre-wrap break-words">
                                <code>{curlResponse}</code>
                            </pre>
                            <DocumentDuplicateIcon
                                className="absolute top-2 right-2 h-6 w-6 text-gray-500 cursor-pointer"
                                onClick={() => copyToClipboard(curlResponse)}
                                aria-label="Copy to clipboard"
                            />
                        </div>
                    </div>
                )}

                {copied && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md flex items-center">
                        <CheckIcon className="h-5 w-5 mr-2"/>
                        Copied to clipboard
                    </div>
                )}
                <hr className="my-6"/>
                <p className="text-center mt-4">
                    For official documentation on App Store Connect Analytics, please visit: {' '}
                    <a href="https://developer.apple.com/documentation/analytics-reports" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline inline-flex items-center">
                        this link
                        <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4"/>
                    </a>
                </p>
                <p className="text-center mt-4">
                    To view the server code for this project, visit: {' '}
                    <a href="https://github.com/phiture/app-store-connect-analytics-api" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline inline-flex items-center">
                        this GitHub repository
                        <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4"/>
                    </a>
                </p>
                <hr className="my-6"/>
                <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 mb-6 rounded" role="alert">
                    <p className="font-bold">Important Information</p>
                    <p className="text-sm">To adhere to security policies (CORS), this request is processed through our backend server. Please be assured that we do not store or retain any of your information.</p>
                </div>
                <hr className="my-6"/>
            </div>
        </div>
    );
};

export default Home;
