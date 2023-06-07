import { buildRoutePath } from './utils/build-route-path.js';
import { randomUUID } from 'node:crypto';
import { Database } from './database.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query;

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null,
      );

      return response.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body;

      if (!title || !description) {
        return response
          .writeHead(400)
          .end('Invalid request. Please provide a Title and Description');
      }

      const date = new Date();

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: date,
        updated_at: date,
      };

      database.insert('tasks', task);

      return response.writeHead(201).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      if (!title && !description) {
        return response
          .writeHead(400)
          .end('Invalid request, please provide a Title or Description');
      }

      try {
        database.update('tasks', id, {
          title,
          description,
        });

        return response.writeHead(204).end();
      } catch (error) {
        return response.writeHead(404).end(Buffer.from(String(error)));
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params;

      try {
        database.completeTask('tasks', id);

        return response.writeHead(204).end();
      } catch (error) {
        return response.writeHead(404).end(Buffer.from(String(error)));
      }
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;
      database.delete('tasks', id);

      return response.writeHead(204).end();
    },
  },
];
