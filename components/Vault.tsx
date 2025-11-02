
import React, { useState } from 'react';
import { Card } from './common/Card';
import { Icon } from './Icons';
import { VaultItem, DocumentItem } from '../types';

const sharedLogins: VaultItem[] = [
    {id: 'v1', service: 'House Wi-Fi', username: 'GrammaHouse'},
    {id: 'v2', service: 'Netflix', username: 'family@email.com'},
    {id: 'v3', service: 'Electric Bill', username: 'stacey@email.com'},
    {id: 'v4', service: 'Gas Company', username: 'stacey@email.com'},
];

const sharedDocs: DocumentItem[] = [
    {id: 'd1', name: "Gram's Insurance Card.pdf", type: 'PDF'},
    {id: 'd2', name: "Stove Warranty.pdf", type: 'PDF'},
    {id: 'd3', name: "Gram's Advanced Directive.docx", type: 'Document'},
];


export const Vault: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // This is a mock authentication. In a real app, this would be a secure check.
        if (password === 'familyfirst') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password. Try again.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-10">
                <Card title="Secure Vault Access" icon={<Icon name="vault" className="w-6 h-6 text-brand-secondary" />}>
                    <p className="text-center text-brand-subtle mb-4">For security, please enter the shared vault password to continue.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="vault-password" className="block text-sm font-medium text-gray-700 normal-case">Vault Password</label>
                            <input
                                type="password"
                                id="vault-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform duration-200 ease-in-out hover:scale-105">
                            Unlock Vault
                        </button>
                    </form>
                </Card>
            </div>
        );
    }


  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card title="Shared Secure Vault" icon={<Icon name="vault" className="w-6 h-6 text-brand-secondary" />}>
            <ul className="space-y-3">
                {sharedLogins.map(item => (
                    <li key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-semibold normal-case font-sans">{item.service}</p>
                            <p className="text-sm text-gray-500">Username: {item.username}</p>
                        </div>
                        <button className="text-sm font-medium text-brand-primary hover:underline transition-transform duration-200 ease-in-out hover:scale-105">
                            Show Password
                        </button>
                    </li>
                ))}
            </ul>
        </Card>
         <Card title="Important Documents" icon={<Icon name="doc" className="w-6 h-6 text-brand-primary" />}>
            <ul className="space-y-3">
                {sharedDocs.map(doc => (
                    <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Icon name="doc" className="w-5 h-5 text-brand-primary" />
                            <div>
                                <p className="font-semibold normal-case font-sans">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.type}</p>
                            </div>
                        </div>
                        <button className="text-sm font-medium text-brand-primary hover:underline transition-transform duration-200 ease-in-out hover:scale-105">
                            Download
                        </button>
                    </li>
                ))}
            </ul>
        </Card>
    </div>
  );
};
