
import React from 'react';
import { Card } from './common/Card';
import { Icon } from './Icons';
import { User, Project, Task, Chore, ShoppingItem, TaskStatus } from '../types';

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

interface ProjectsProps {
    project: Project;
    chores: Chore[];
    shoppingList: ShoppingItem[];
}

export const Projects: React.FC<ProjectsProps> = ({ project, chores, shoppingList }) => {
  return (
    <div className="space-y-8">
      <Card title={`Renovations: ${project.title}`} icon={<Icon name="projects" className="w-6 h-6 text-brand-secondary" />}>
        <div className="flex flex-col md:flex-row gap-4">
          <KanbanColumn title={TaskStatus.ToDo} tasks={project.tasks.filter(t => t.status === TaskStatus.ToDo)} />
          <KanbanColumn title={TaskStatus.InProgress} tasks={project.tasks.filter(t => t.status === TaskStatus.InProgress)} />
          <KanbanColumn title={TaskStatus.Done} tasks={project.tasks.filter(t => t.status === TaskStatus.Done)} />
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
