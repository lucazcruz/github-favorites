export default class Favorites {
  constructor(app){
    this.app = document.querySelector(app);
    this.tbody = this.app.querySelector('tbody')
    this.input = this.app.querySelector('input')
  }

  static fetchData(userName) {
    const url = `https://api.github.com/users/${userName}`

    return fetch(url)
      .then(data => data.json())
      .then( ({ avatar_url, login, public_repos, followers }) => ({
        avatar_url,
        login,
        public_repos,
        followers
      }))
  }

  async updateData(userName) {
    try {
      const userExist = this.data.find( data => userName == data.login)
      if (userExist) throw new Error('Usuário já cadastrado!')
      if (!userName) throw new Error('Usuário não encontrado!')

      const user = await Favorites.fetchData(userName)
      this.data = [user, ...this.data]
      this.save()
      this.updateRows()
    } 
    catch(error) {
      alert(error)
    }
  }

  add() {
    this.app.querySelector('.addButton').onclick = () => {
      const { value } = this.input
      this.updateData(value)
      this.input.value = ''
    }
  }

  save() {
    localStorage.setItem('@favorite_users', JSON.stringify(this.data))
  }

  load() {
    this.data = JSON.parse(localStorage.getItem('@favorite_users')) || []
  }

  deleteRow(userData) {
    const filteredData = this.data.filter( data => data.login !== userData.login )
    this.data = filteredData
    this.save()
    this.updateRows()
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="user">
        <a href="" target="_blank">
          <img src="" alt="">
          <span></span>
        </a>
      </td>
      <td class="repositories"></td>
      <td class="followers"></td>
      <td>
        <button class="deleteButton">×</button>
      </td>
    `
    return tr
  }

  removeRows() {
    this.tbody.querySelectorAll('tr').forEach( row => {
      row.remove()
    })
  }

  updateRows() {
    this.removeRows()

    this.data.forEach( userData => {
      const row = this.createRow()

      row.querySelector('.user a').href = `https://github.com/${userData.login}`
      row.querySelector('.user img').src = userData.avatar_url
      row.querySelector('.user span').textContent = userData.login
      row.querySelector('.repositories').textContent = userData.public_repos
      row.querySelector('.followers').textContent = userData.followers

      row.querySelector('.deleteButton').onclick = () => {
        this.deleteRow(userData)
      }

      this.tbody.append(row)
    })
  }

  init() {
    this.add()
    this.load()
    this.updateRows()
  }
}
