
import React from 'react';
import { Card } from './common/Card';
import { Icon } from './Icons';
import { User, Project, Task, Chore, ShoppingItem, TaskStatus } from '../types';

const MOCK_USERS: { [key: string]: User } = {
  stacey: { id: 'stacey', name: 'Stacey', avatar: 'https://picsum.photos/seed/stacey/100/100' },
  dale: { id: 'dale', name: 'Dale', avatar: 'https://picsum.photos/seed/dale/100/100' },
  craig: { id: 'craig', name: 'Craig', avatar: 'https://picsum.photos/seed/craig/100/100' },
};

const renovationProject: Project = {
  id: 'reno1',
  title: "Bathroom Redo",
  lead: MOCK_USERS.stacey,
  tasks: [
    { id: 't1', title: 'Pick up paint swatches', description: 'Get samples for "calm blue" and "sea green"', assignee: MOCK_USERS.craig, status: TaskStatus.ToDo, dueDate: 'Saturday' },
    { id: 't2', title: 'Finalize new vanity', description: 'Decide between the two options from Home Depot', assignee: MOCK_USERS.stacey, status: TaskStatus.ToDo },
    { id: 't3', title: 'Demolish old tile', description: 'Be careful with the plumbing', assignee: MOCK_USERS.dale, status: TaskStatus.InProgress },
    { id: 't4', title: 'Purchase toilet', description: 'Model #1234 from Lowes', assignee: MOCK_USERS.stacey, status: TaskStatus.Done },
  ]
};

const chores: Chore[] = [
    {id: 'c1', title: 'Take out trash & recycling', assignee: MOCK_USERS.craig, recurring: 'Weekly'},
    {id: 'c2', title: 'Clean shared bathroom', assignee: MOCK_USERS.stacey, recurring: 'Weekly'},
    {id: 'c3', title: 'Manage mail', assignee: MOCK_USERS.dale, recurring: 'Daily'},
];

const shoppingList: ShoppingItem[] = [
    {id: 's1', name: 'Milk', addedBy: MOCK_USERS.craig, category: 'Groceries'},
    {id: 's2', name: 'Paper Towels', addedBy: MOCK_USERS.stacey, category: 'Supplies'},
    {id: 's3', name: 'Dog food', addedBy: MOCK_USERS.dale, category: 'Pet'},
    {id: 's4', name: 'Ensure', addedBy: MOCK_USERS.stacey, category: "Gram's"},
];

const KanbanCard: React.FC<{ task: Task }> = ({ task }) => (
  <div className="bg-white p-3 rounded-lg shadow border border-gray-200 font-sans">
    <h4 className="font-semibold normal-case tracking-normal font-sans">{task.title}</h4>
    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
    {task.assignee && (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
        <img src={task.assignee.avatar} alt={task.assignee.name} className="w-6 h-6 rounded-full" />
        <span className="text-xs font-medium">{task.assignee.name}</span>
        {task.dueDate && <span className="text-xs text-red-500 ml-auto">{task.dueDate}</span>}
      </div>
    )}
  </div>
);

const KanbanColumn: React.FC<{ title: TaskStatus; tasks: Task[] }> = ({ title, tasks }) => (
  <div className="bg-gray-100 rounded-lg p-3 flex-1">
    <h3 className="font-bold text-center text-gray-600 mb-4">{title}</h3>
    <div className="space-y-3">
      {tasks.map(task => <KanbanCard key={task.id} task={task} />)}
    </div>
  </div>
);

export const Projects: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card title={`Renovations: ${renovationProject.title}`} icon={<Icon name="projects" className="w-6 h-6 text-brand-secondary" />}>
        <div className="flex flex-col md:flex-row gap-4">
          <KanbanColumn title={TaskStatus.ToDo} tasks={renovationProject.tasks.filter(t => t.status === TaskStatus.ToDo)} />
          <KanbanColumn title={TaskStatus.InProgress} tasks={renovationProject.tasks.filter(t => t.status === TaskStatus.InProgress)} />
          <KanbanColumn title={TaskStatus.Done} tasks={renovationProject.tasks.filter(t => t.status === TaskStatus.Done)} />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card title="House Chores" icon={<Icon name="check" className="w-6 h-6 text-brand-accent" />}>
            <ul className="space-y-3">
                {chores.map(chore => (
                    <li key={chore.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-semibold font-sans normal-case">{chore.title}</p>
                            <p className="text-xs text-gray-500">{chore.recurring}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <img src={chore.assignee.avatar} alt={chore.assignee.name} className="w-8 h-8 rounded-full" />
                             <span className="text-sm font-medium">{chore.assignee.name}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
        <Card title="Shared Shopping List" icon={<Icon name="plus" className="w-6 h-6 text-brand-primary" />}>
             <ul className="space-y-2">
                {shoppingList.map(item => (
                    <li key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100">
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                                item.category === 'Groceries' ? 'bg-green-400' :
                                item.category === 'Supplies' ? 'bg-blue-400' :
                                item.category === 'Pet' ? 'bg-yellow-400' : 'bg-red-400'
                            }`}></span>
                            <span className="font-sans">{item.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">added by {item.addedBy.name}</span>
                    </li>
                ))}
            </ul>
        </Card>
      </div>
    </div>
  );
};
