import React from 'react';
import { Log } from '../../types';
import dayjs from 'dayjs';

interface LogTableListProps {
    log: Log;
}

export const LogTableList: React.FC<LogTableListProps> = ({ log }) => {
    let logStatusClassName: string;

    log.status === 'DEPOSIT'
        ? (logStatusClassName =
              'px-3 py-1 text-xs text-purple-600 bg-purple-200 rounded-full')
        : (logStatusClassName =
              'px-3 py-1 text-xs text-purple-600 bg-red-300 rounded-full');

    return (
        <tr
            // key={index.toString()}
            className="border-b border-gray-200 hover:bg-gray-100"
        >
            <td className="px-6 py-3 text-left whitespace-nowrap">
                <div className="flex items-center">
                    <span className="font-medium">
                        {dayjs(log.createdAt).format('DD MMM YYYY')}
                    </span>
                </div>
            </td>
            <td className="px-6 py-3 text-left">
                <div className="flex items-center">
                    <span>{log.transaction}</span>
                </div>
            </td>
            <td className="px-6 py-3 text-left">
                <div className="flex items-center">
                    <span>{log.balance}</span>
                </div>
            </td>
            <td className="px-6 py-3 text-center">
                <span className={logStatusClassName}>{log.status}</span>
            </td>
        </tr>
    );
};
