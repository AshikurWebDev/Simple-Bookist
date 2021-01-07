//Book class: Represents a Book

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    // this.title = title;
    // this.author = author;
    // this.isbn = isbn;
  }
}

//Store class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books")); //converting JSON to simple javaScript object
    }
    return books; //returning the book object
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book); //Adding the book to javaScript objecct

    localStorage.setItem("books", JSON.stringify(books)); //Converting the javaScript object to JSON and send it to localStorage
  }

  static removeBook(isbn) {
    const books = Store.getBooks(); //Fetching all the books

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1); //Deleting the specific value from the object
      }
    });

    localStorage.setItem("books", JSON.stringify(books)); //Again converting the object to JSON
  }
}

//UI class : Handle UI Task

class UI {
  static displayBooks() {
    const books = Store.getBooks(); //Fetching the book list

    books.forEach((book) => UI.addBookToLiist(book)); //Add the book list to the UI part
  }

  static addBookToLiist(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href= "#" class = "btn btn-danger btn-sm delete">X</a></td>
        `;
    list.appendChild(row);
  }

  //Delete book lsit
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  //Showing alert
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //Vanish in 3 second
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  //Removing the book
  static clearFields() {
    document.querySelector("#title").value = " ";
    document.querySelector("#author").value = " ";
    document.querySelector("#isbn").value = " ";
  }
}

// Event: Display book

document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //Prevent Default value
  e.preventDefault();
  //get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //Validate the form information
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill all field. All field are required", "danger");
  } else {
    //Getting the a new book information
    const book = new Book(title, author, isbn);

    //Add book to UI
    UI.addBookToLiist(book);

    //Add book to local store
    Store.addBook(book);

    //Show success message
    UI.showAlert("Book has been added successfully .", "success");

    //clear field
    UI.clearFields();
  }
});

//Event: Remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  //Remove book From UI
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  //Show success message
  UI.showAlert("Removed Successfully.", "success");
});
