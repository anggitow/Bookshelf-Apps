const UNCOMPLETED_LIST_BOOK_ID = "books";
const COMPLETED_LIST_BOOK_ID = "completed-books";
const BOOK_ITEMID = "itemId";

function makeBook(data, author, timestamp, isCompleted) {

    const textTitle = document.createElement("h3");
    textTitle.innerText = data;

    const textAuthor = document.createElement("h5");
    textAuthor.innerText = author;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);

    if (isCompleted) {
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(
            createCheckButton(),
            createTrashButton()
        );
    }

    return container;
}

function createUndoButton() {
    return createButton("undo-button", function(event) {
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton("trash-button", function(event) {
        removeTaskFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function(event) {
        addTaskToCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function(event) {
        eventListener(event);
    });
    return button;
}


function addBook() {
    const checkbox = document.getElementById("inputBookIsComplete");
    if (checkbox.checked == true) {
        const completedBOOKList = document.getElementById(COMPLETED_LIST_BOOK_ID);
        const textBook = document.getElementById("title").value;
        const textAuthor = document.getElementById("author").value;
        const timestamp = document.getElementById("date").value;
        const dateNumber = parseInt(timestamp); 

        const book = makeBook(textBook, textAuthor, dateNumber, true);
        const bookObject = composeBookObject(textBook, textAuthor, dateNumber, true);

        book[BOOK_ITEMID] = bookObject.id;
        books.push(bookObject);

        completedBOOKList.append(book);
        updateDataToStorage();
    } else {
        const uncompletedBOOKList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
        const textBook = document.getElementById("title").value;
        const textAuthor = document.getElementById("author").value;
        const timestamp = document.getElementById("date").value;
        const dateNumber = parseInt(timestamp); 

        const book = makeBook(textBook, textAuthor, dateNumber, false);
        const bookObject = composeBookObject(textBook, textAuthor, dateNumber, false);

        book[BOOK_ITEMID] = bookObject.id;
        books.push(bookObject);

        uncompletedBOOKList.append(book);
        updateDataToStorage();
    }
}

function addTaskToCompleted(taskElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const taskTitle = taskElement.querySelector(".inner > h3").innerText;
    const taskAuthor = taskElement.querySelector(".inner > h5").innerText;
    const taskTimestamp = taskElement.querySelector(".inner > p").innerText;

    const newBook = makeBook(taskTitle, taskAuthor, taskTimestamp, true);
    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function removeTaskFromCompleted(taskElement) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    taskElement.remove();
    updateDataToStorage();
}

function undoTaskFromCompleted(taskElement) {
    const checkbox = document.getElementById("inputBookIsComplete").checked = false;
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const taskTitle = taskElement.querySelector(".inner > h3").innerText;
    const taskAuthor = taskElement.querySelector(".inner > h5").innerText;
    const taskTimestamp = taskElement.querySelector(".inner > p").innerText;

    const newBook = makeBook(taskTitle, taskAuthor, taskTimestamp, false);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = false;

    newBook[BOOK_ITEMID] = book.id;

    listUncompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();

}