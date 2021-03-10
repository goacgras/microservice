import React from 'react';
import { LogTable } from './LogTable';

export const LogSideBar: React.FC = () => {
    return (
        <div className="block ml-2 w-160">
            {/* Title */}
            <div className="bg-gray-400 rounded">
                <div className="p-4 border-b-2">
                    <p className="text-lg font-semibold text-center">Logs</p>
                </div>
            </div>
            {/* Table */}
            <LogTable />
        </div>
    );
};
