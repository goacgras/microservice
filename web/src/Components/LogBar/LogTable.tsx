import React from 'react';
import useSWR from 'swr';
import { Log } from '../../types';
import { LogTableList } from './LogTableList';

export const LogTable: React.FC = () => {
    const { data: logs, revalidate, error } = useSWR<Log[]>(
        '/transaction/logs'
    );
    revalidate();

    const initialLoading = !logs && !error;

    if (initialLoading) {
        return <div>loading...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <div className="items-center justify-center min-h-full overflow-hidden font-sans bg-gray-100 ">
                <div className="w-full lg:w-full">
                    <div className="my-0 mt-0 bg-white rounded shadow-md">
                        <table className="w-full table-auto min-w-max">
                            <thead>
                                <tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-200">
                                    <th className="px-6 py-3 text-left">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Transaction
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Balance
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-light text-gray-600">
                                {logs?.map((log, index) => (
                                    <LogTableList key={index} log={log} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
