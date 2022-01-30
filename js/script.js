document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    const chekboxIsCompleted = document.getElementById("inputBookIsComplete");
    const searchForm = document.getElementById("searchBook");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!EDIT_MODE) {
            addBook();
        } else {
            updateBook();
        }
    });

    submitForm.addEventListener("reset", function (event) {
        event.preventDefault();
        setupForm();
    })

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBooks();
    })

    chekboxIsCompleted.addEventListener("change", function (event) {
        event.preventDefault();

        if (!EDIT_MODE) {
            const buttonSubmit = document.getElementById("bookSubmit");

            if (chekboxIsCompleted.checked) {
                buttonSubmit.children[0].innerText = "selesai dibaca"
            } else {
                buttonSubmit.children[0].innerText = "belum selesai dibaca"
            }
        }
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data buku berhasil diperbaharui dalam local storage.");
});
document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});