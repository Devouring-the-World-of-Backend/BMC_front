// app.js

document.addEventListener("DOMContentLoaded", fetchBooks);
var nowNum = 0;

async function fetchBooks() {
    const response = await fetch('http://localhost:8000/books');
    const books = await response.json();

    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.innerHTML = `
            <img src="https://marketplace.canva.com/EAD12irp-Wk/1/0/1003w/canva-%EC%9D%BC%EB%AA%B0-%EB%A1%9C%EB%A7%A8%EC%8A%A4-%EC%A0%84%EC%9E%90%EC%B1%85-%ED%91%9C%EC%A7%80-rhOetH7hcqE.jpg" width="230" height="350" alt="이미지 설명">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button class="small-button" onclick="fetchBookDetails(${book.id})">상세 보기</button>
            <button class="small-button" onclick="showUpdateBook(${book.id})">수정</button>
            <button class="small-button" onclick="deleteBook(${book.id})">삭제</button>
        `;
        bookItem.className='grid-item';
        bookList.appendChild(bookItem);
    });
}

async function searchBooks(query){
    const response = await fetch('http://localhost:8000/books/search?'+query);
    const books = await response.json();

    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.innerHTML = `
            <img src="https://marketplace.canva.com/EAD12irp-Wk/1/0/1003w/canva-%EC%9D%BC%EB%AA%B0-%EB%A1%9C%EB%A7%A8%EC%8A%A4-%EC%A0%84%EC%9E%90%EC%B1%85-%ED%91%9C%EC%A7%80-rhOetH7hcqE.jpg" width="230" height="350" alt="이미지 설명">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button class="small-button" onclick="fetchBookDetails(${book.id})">상세 보기</button>
            <button class="small-button" onclick="showUpdateBook(${book.id})">수정</button>
            <button class="small-button" onclick="deleteBook(${book.id})">삭제</button>
        `;
        bookItem.className='grid-item';
        bookList.appendChild(bookItem);
    });
}

const searchBookForm = document.getElementById('search-book-form');
const addBookForm = document.getElementById('add-book-form');

searchBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(searchBookForm);
    var data = formData.entries();
    var query = '';

    for(let [key,value] of data){
        if(value.trim()){
            query += key+'='+value+'&';
        }
    }

    query = query.slice(0,-1);
    searchBooks(query);
});


addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addBookForm);
    const data = Object.fromEntries(formData);

    const response = await fetch('http://localhost:8000/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        fetchBooks(); // 책 목록 다시 불러오기
    }
});

async function bookUpdate(bookId){
    const formData = new FormData(document.getElementById('update-book-form'));
    const data = Object.fromEntries(formData);

    const response = await fetch(`http://localhost:8000/books/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        fetchBooks(); // 책 목록 다시 불러오기
    }
}

async function fetchBookDetails(bookId) {
    const response = await fetch(`http://localhost:8000/books/${bookId}`);
    const book = await response.json();

    document.getElementById('detail-title').textContent = `Title: ${book.title}`;
    document.getElementById('detail-author').textContent = `Author: ${book.author}`;
    document.getElementById('detail-published-year').textContent = `Published Year: ${book.published_year}`;
    document.getElementById('detail-description').textContent = `Description: ${book.description}`;
    document.getElementById('modal-detail').style.display = 'block';
}

function showUpdateBook(bookId){
    const updateBook = document.getElementById('book-update');
    toInner = `
            <h2>Update Book</h2>
            <form class="book-form" id="update-book-form">
                <input type="text" id="up-title" name="title" placeholder="Title" required>
                <input type="text" id="up-author" name="author" placeholder="Author" required>
                <input type="text" id="up-description" name="description" placeholder="Description" required>
                <input type="number" id="up-published_year" name="published_year" placeholder="Published Year" required>
                <button onclick="bookUpdate(${bookId})">Update Book</button>
                <button onclick="hideUpdate()">Close</button>
            </form>
    `
    updateBook.innerHTML = toInner;
    document.getElementById('modal-update').style.display = 'block';
}

function hideDetails() {
    document.getElementById('modal-detail').style.display = 'none';
}

function hideUpdate() {
    document.getElementById('modal-update').style.display = 'none';
}

function hideSearch() {
    document.getElementById('book-search').style.display = 'none';
    document.getElementById('searchButton').style.display = 'block';
}

function openSearch(){
    document.getElementById('book-search').style.display = 'block';
    document.getElementById('searchButton').style.display = 'none';
}

async function deleteBook(bookId) {
    const response = await fetch(`http://localhost:8000/books/${bookId}`,{
        method:'DELETE'
    });
    if (response.ok) {
        fetchBooks();
    }
} 



