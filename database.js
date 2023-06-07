import fs from 'node:fs/promises';

const databasePath = new URL('./db.json', import.meta.url);

export class Database {
  //transformar propriedades e metodos em privados usando o # na frente
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persist();
    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      const newData = Object.assign(this.#database[table][rowIndex], {
        id,
        title: data.title ? data.title : this.#database[table][rowIndex].title,
        description: data.description
          ? data.description
          : this.#database[table][rowIndex].description,
        updated_at: new Date(),
      });

      this.#database[table][rowIndex] = { id, ...newData };
      this.#persist();
    } else {
      throw new Error('Task not found');
    }
  }

  completeTask(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      const data = this.#database[table][rowIndex];
      const date = new Date();
      let completeAt = new Date();

      if (data.completed_at) {
        completeAt = null;
      }

      this.#database[table][rowIndex] = {
        id,
        ...data,
        completed_at: completeAt,
        updated_at: date,
      };
      this.#persist();
    } else {
      throw new Error('Task not found');
    }
  }
}

//banco de dados (falso) com persistencia de dados em arquivo local
