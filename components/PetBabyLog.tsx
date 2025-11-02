
import React from 'react';
import { Card } from './common/Card';
import { Icon } from './Icons';
import { PetLog, BabyPrepTask, User } from '../types';

const petBabyContacts = [
    {name: "Dr. Pawson (Veterinarian)", number: "555-PET-CARE"},
    {name: "Happy Paws Grooming", number: "555-GROOMER"},
    {name: "Dr. Childs (Pediatrician)", number: "555-BABY-DR"},
];

interface PetBabyLogProps {
    petLogs: PetLog[];
    babyPrepTasks: BabyPrepTask[];
}

export const PetBabyLog: React.FC<PetBabyLogProps> = ({ petLogs, babyPrepTasks }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
      <Card title="Luna's Log" icon={<Icon name="dog" className="w-6 h-6 text-yellow-600" />} className="lg:col-span-2">
        <div className="flow-root">
          <ul className="-mb-8">
            {petLogs.map((log, logIdx) => (
              <li key={log.id}>
                <div className="relative pb-8">
                  {logIdx !== petLogs.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${log.activity === 'Fed' ? 'bg-green-500' : 'bg-blue-500'}`}>
                        <Icon name={log.activity === 'Fed' ? 'plus' : 'check'} className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {log.activity} by <span className="font-medium text-gray-900">{log.loggedBy.name}</span>
                        </p>
                        <p className="mt-1 text-sm text-gray-700">{log.notes}</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>{log.timestamp}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <div className="space-y-8">
        <Card title="Harper Prep Checklist" icon={<Icon name="baby" className="w-6 h-6 text-pink-400" />}>
            <ul className="space-y-3">
                {babyPrepTasks.map(item => (
                    <li key={item.id} className={`flex items-center gap-3 p-2 rounded-lg ${item.completed ? 'bg-green-50 text-gray-500 line-through' : 'bg-yellow-50'}`}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.completed ? 'bg-brand-accent border-brand-accent' : 'border-gray-300'}`}>
                            {item.completed && <Icon name="check" className="w-4 h-4 text-white" />}
                        </div>
                        <span>{item.task}</span>
                    </li>
                ))}
            </ul>
        </Card>
        
        <Card title="Pet & Baby Contacts" icon={<Icon name="phone" className="w-6 h-6 text-blue-500" />}>
             <ul className="space-y-3">
                {petBabyContacts.map(contact => (
                    <li key={contact.name} className="p-2 rounded-lg bg-gray-50">
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-brand-subtle">{contact.number}</p>
                    </li>
                ))}
             </ul>
        </Card>
      </div>
    </div>
  );
};
