const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";
let EDIT_MODE = false;

function makeBook(book) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = book.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Penulis: " + book.author;

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun: " + book.year;

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textTitle, textAuthor, textYear);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");

    if (book.isCompleted) {
        buttonContainer.append(
            createUndoButton(),
            createEditButton(),
            createTrashButton()
        );
    } else {
        buttonContainer.append(
            createCheckButton(),
            createEditButton(),
            createTrashButton()
        );
    }

    container.append(buttonContainer);

    return container;
}

function createUndoButton() {
    return createButton("Belum selesai di Baca", "btn-primary", function (event) {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}

function createCheckButton() {
    return createButton("Selesai di Baca", "btn-primary", function (event) {
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("Hapus buku", "btn-secondary", function (event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

function createEditButton() {
    return createButton("Edit buku", "btn-secondary", function (event) {
        editBook(event.target.parentElement.parentElement);
    });
}

function createButton(innerText, buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.innerText = innerText;
    button.classList.add("btn");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function getBookFormValue() {
    const inputId = document.getElementById("inputBookId").value;
    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").value;
    const chekboxIsCompleted = document.getElementById("inputBookIsComplete").checked;

    return composeBookObject(inputId, inputTitle, inputAuthor, inputYear, chekboxIsCompleted);
}

function addBook() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const bookObject = getBookFormValue();
    const book = makeBook(bookObject);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (bookObject.isCompleted) {
        listCompleted.append(book);
    } else {
        uncompletedBookList.append(book);
    }
    updateDataToStorage();
    setupForm();
}

function updateBook() {
    const bookObject = getBookFormValue();

    const bookIndex = findBookIndex(bookObject.id);
    books[bookIndex] = bookObject;

    updateDataToStorage();
    refreshDataFromBooks();
}

function searchBooks() {
    const textSearchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
    const elementBooks = document.getElementsByTagName("article");
    let isSearchTitleNotEmpty = false;

    if (textSearchTitle.trim() !== '') {
        isSearchTitleNotEmpty = true
    }

    for (const elementBook of elementBooks) {
        if (isSearchTitleNotEmpty) {
            const bookTitle = elementBook.children[0].innerText.toLowerCase();

            if (bookTitle.includes(textSearchTitle)) {
                elementBook.style.display = "block";
            } else {
                elementBook.style.display = "none";
            }
        } else {
            elementBook.style.display = "block";
        }
    }
}

function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;

    const newBook = makeBook(book);
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBook(bookElement) {
    const isConfirmed = confirm("Buku akan dihapus dan tidak dapat dikembalikan. Apakah yakin?");

    if (!isConfirmed) {
        return;
    }
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function editBook(bookElement) {
    const book = findBook(bookElement[BOOK_ITEMID]);
    setupForm(book);
}

function setupForm(book) {
    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const inputId = document.getElementById("inputBookId");
    const inputTitle = document.getElementById("inputBookTitle");
    const inputAuthor = document.getElementById("inputBookAuthor");
    const inputYear = document.getElementById("inputBookYear");
    const chekboxIsCompleted = document.getElementById("inputBookIsComplete");
    const buttonSubmit = document.getElementById("bookSubmit");

    if (book != null) {
        EDIT_MODE = true;
        inputId.value = book.id;
        inputTitle.value = book.title;
        inputAuthor.value = book.author;
        inputYear.value = book.year;
        chekboxIsCompleted.checked = book.isCompleted;
        buttonSubmit.innerHTML = "Simpan Perubahan Buku";

        formTitle.innerText = "Edit Buku"
        formSubtitle.innerText = "Ada update atau salah ketik? Silahkan diubah"
    } else {
        EDIT_MODE = false;
        inputId.value = "";
        inputTitle.value = "";
        inputAuthor.value = "";
        inputYear.value = "";
        chekboxIsCompleted.checked = false;
        buttonSubmit.innerHTML = "Masukkan sebagai <span>belum selesai dibaca</span>";

        formTitle.innerText = "Tambah Buku"
        formSubtitle.innerText = "Ada bacaan baru apa kali ini? Tambahin yuk"
    }
}

function undoBookFromCompleted(bookElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;

    const newBook = makeBook(book);
    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    listUncompleted.innerHTML = "";
    listCompleted.innerHTML = "";

    for (const book of books) {
        const newBook = makeBook(book);
        newBook[BOOK_ITEMID] = book.id;

        if (book.isCompleted) {
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }

    setupForm();
}