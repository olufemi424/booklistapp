//Book Class: Represent a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class: Handle the Ui
class UI {
  //display books
  static displayBooks() {
    const StoredBooks = Store.getBooks();

    const books = StoredBooks;

    //loop thru each books
    books.forEach(book => {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    //create a new tr element
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete"/>X</td>
    `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.target.classList.contains("delete")) {
      el.target.parentNode.parentNode.remove();
      UI.showAlert("Book Removed", "success");
    }
    Store.removeBook(
      el.target.parentElement.previousElementSibling.textContent
    );
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //vanishing in 2s
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Store Class: Handle Storage

//Events: Display book
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add book
document.querySelector("#book-form").addEventListener("submit", e => {
  e.preventDefault();
  //get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Pls fill in all fields", "danger");
  } else {
    const book = new Book(title, author, isbn);
    //Add book to UI
    UI.addBookToList(book);

    //Add book to store
    Store.addBook(book);

    // alert success
    UI.showAlert("Book added", "success");

    //Clear fields
    UI.clearFields();
  }

  //instatiate book
});

//Event: Delete book
document.querySelector("#book-list").addEventListener("click", UI.deleteBook);
