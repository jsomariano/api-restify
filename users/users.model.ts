const users = [
  {
    id: "1",
    name: "Junior Santos",
    email: "junior_santos2100@outlook.com"
  },
  {
    id: "2",
    name: "João silva",
    email: "joao_silva@outlook.com"
  }
]

export class User {
  static findAll(): Promise<any[]> {
    return Promise.resolve(users)
  }

  static findById(id: string): Promise<any> {
    return new Promise(resolve => {
      const filtered = users.filter(user => user.id === id)
      let user;
      if (filtered.length > 0) {
        user = filtered
      }
      resolve(user)
    })
  }
}